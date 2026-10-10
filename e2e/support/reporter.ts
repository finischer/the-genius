import path from "node:path";
import type {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestError,
  TestResult
} from "@playwright/test/reporter";

const EXPECTED_ERROR_ANNOTATION = "expected-error";
const SPINNER_FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
const REDRAW_INTERVAL_MS = 100;
const ANSI_PATTERN = /\u001b\[[0-9;]*m/g;

const useColor = process.env.NO_COLOR === undefined;
const liveLog = process.env.E2E_LIVE_LOG !== "false";
const isInteractive = Boolean(process.stdout.isTTY) && liveLog;
// Start lines duplicate the result lines of the group block, so non-interactive
// output only prints them on request
const startLines = process.env.E2E_LIVE_LOG === "true";

const paint = (code: number, text: string): string =>
  useColor ? `\u001b[${code}m${text}\u001b[0m` : text;
const dim = (text: string) => paint(2, text);
const bold = (text: string) => paint(1, text);
const green = (text: string) => paint(32, text);
const red = (text: string) => paint(31, text);
const yellow = (text: string) => paint(33, text);
const cyan = (text: string) => paint(36, text);

type TStatus = "running" | "passed" | "failed" | "flaky" | "skipped";

interface ITestState {
  title: string;
  status: TStatus;
  startedAt: number;
  durationMs: number;
  attempt: number;
  error?: string;
  note?: string;
}

interface IGroup {
  header: string;
  expected: number;
  tests: Map<string, ITestState>;
  printed: boolean;
  /** Wall-clock span of the group; tests run in parallel, so no sum. */
  startedAt?: number;
  endedAt?: number;
}

interface IFailure {
  name: string;
  attempts: number;
  errors: TestError[];
}

function timestamp(): string {
  return new Date().toISOString().slice(11, 19);
}

function seconds(ms: number): string {
  return `${(ms / 1000).toFixed(1)}s`;
}

function clock(ms: number): string {
  const total = Math.floor(ms / 1000);
  const mm = String(Math.floor(total / 60)).padStart(2, "0");
  return `${mm}:${String(total % 60).padStart(2, "0")}`;
}

function plain(text: string): string {
  return text.replace(ANSI_PATTERN, "");
}

function firstLine(text: string | undefined): string {
  return (
    plain(text ?? "")
      .split("\n")
      .find((line) => line.trim() !== "")
      ?.trim() ?? ""
  );
}

/** `project › file › describe blocks` of a test, i.e. its test group. */
function groupHeader(test: TestCase): string {
  const [, project = "", file = "", ...describes] = test
    .titlePath()
    .slice(0, -1);
  return [project, path.basename(file), ...describes].join(" › ");
}

function indent(text: string, spaces: number): string {
  const pad = " ".repeat(spaces);
  return text
    .split("\n")
    .map((line) => `${pad}${line}`)
    .join("\n");
}

/**
 * Terminal reporter organised by test group (project › file › describe).
 *
 * - Interactive terminal: a live region shows every active group with its
 *   tests. Running tests get a spinner that turns into ✔ / ✘ when they end.
 *   A finished group is printed permanently above the region.
 * - Non-interactive output (CI): one dimmed line per started test and one
 *   block per finished group, no cursor movement.
 * - Failures are repeated with their stack trace at the end of the run.
 */
export default class E2eReporter implements Reporter {
  private groups = new Map<string, IGroup>();
  private failures: IFailure[] = [];
  private total = 0;
  private done = 0;
  private counts = { passed: 0, failed: 0, flaky: 0, skipped: 0 };
  private startedAt = Date.now();
  private frame = 0;
  private timer: NodeJS.Timeout | undefined;
  private regionLines = 0;

  onBegin(_config: FullConfig, suite: Suite): void {
    const tests = suite.allTests();
    this.total = tests.length;
    this.startedAt = Date.now();
    for (const test of tests) {
      const header = groupHeader(test);
      const group = this.groups.get(header) ?? {
        header,
        expected: 0,
        tests: new Map(),
        printed: false
      };
      group.expected += 1;
      this.groups.set(header, group);
    }
    this.emit(
      `${dim(timestamp())} ${cyan("●")} ${cyan(
        `Running ${this.total} tests in ${this.groups.size} groups`
      )}\n`
    );
    if (isInteractive) {
      this.timer = setInterval(() => {
        this.frame = (this.frame + 1) % SPINNER_FRAMES.length;
        this.redraw();
      }, REDRAW_INTERVAL_MS);
      this.timer.unref();
    }
  }

  onTestBegin(test: TestCase, result: TestResult): void {
    const group = this.groups.get(groupHeader(test));
    if (!group) return;
    const note = test.annotations.find(
      (annotation) => annotation.type === EXPECTED_ERROR_ANNOTATION
    )?.description;
    group.startedAt ??= Date.now();
    group.tests.set(test.id, {
      title: test.title,
      status: "running",
      startedAt: Date.now(),
      durationMs: 0,
      attempt: result.retry + 1,
      note
    });

    if (isInteractive) {
      this.redraw();
    } else if (startLines) {
      const retry = result.retry > 0 ? ` (retry #${result.retry})` : "";
      this.emit(
        `${dim(timestamp())} ${dim(`▶ running ${group.header} › ${test.title}${retry}`)}\n`
      );
    }
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    const group = this.groups.get(groupHeader(test));
    const state = group?.tests.get(test.id);
    if (!group || !state) return;

    const willRetry =
      result.status !== "passed" &&
      result.status !== "skipped" &&
      result.retry < test.retries;
    if (willRetry) {
      state.attempt = result.retry + 2;
      return;
    }

    group.endedAt = Date.now();
    state.durationMs = result.duration;
    state.attempt = result.retry + 1;
    if (result.status === "skipped") {
      state.status = "skipped";
    } else if (result.status === "passed") {
      state.status = result.retry > 0 ? "flaky" : "passed";
    } else {
      state.status = "failed";
      state.error = firstLine(result.error?.message);
      this.failures.push({
        name: `${group.header} › ${test.title}`,
        attempts: result.retry + 1,
        errors: result.errors
      });
    }
    this.counts[state.status] += 1;
    this.done += 1;

    const finished = [...group.tests.values()].filter(
      (t) => t.status !== "running"
    ).length;
    if (finished >= group.expected) {
      group.printed = true;
      this.emit(`${this.renderGroup(group, false).join("\n")}\n`);
    } else {
      this.redraw();
    }
  }

  onStdOut(chunk: string | Buffer): void {
    this.forward(chunk);
  }

  onStdErr(chunk: string | Buffer): void {
    this.forward(chunk);
  }

  onEnd(result: FullResult): void {
    if (this.timer) clearInterval(this.timer);
    this.clearRegion();

    for (const group of this.groups.values()) {
      if (!group.printed && group.tests.size > 0) {
        group.printed = true;
        process.stdout.write(`${this.renderGroup(group, false).join("\n")}\n`);
      }
    }

    const { passed, failed, flaky, skipped } = this.counts;
    const status = result.status === "passed" ? green : red;
    process.stdout.write(
      `${dim(timestamp())} ${cyan("●")} ${status(result.status.toUpperCase())}  ${green(
        `${passed} passed`
      )}, ${failed > 0 ? red(`${failed} failed`) : `${failed} failed`}, ${
        flaky > 0 ? yellow(`${flaky} flaky`) : `${flaky} flaky`
      }, ${skipped} skipped  ${dim(`(${clock(Date.now() - this.startedAt)})`)}\n`
    );
    this.printFailures();
  }

  printsToStdio(): boolean {
    return true;
  }

  private printFailures(): void {
    if (this.failures.length === 0) return;
    const lines = [
      "",
      red(bold(`━━ ${this.failures.length} failed test(s) ━━`))
    ];
    this.failures.forEach((failure, index) => {
      lines.push(
        "",
        red(`${index + 1}) ${failure.name}`) +
          dim(
            `  (${failure.attempts} attempt${failure.attempts > 1 ? "s" : ""})`
          )
      );
      for (const error of failure.errors) {
        const body = error.stack ?? error.message ?? "unknown error";
        const snippet =
          error.snippet && !body.includes(error.snippet)
            ? `\n${error.snippet}`
            : "";
        const text = useColor
          ? `${body}${snippet}`
          : plain(`${body}${snippet}`);
        lines.push(indent(text, 4));
      }
    });
    process.stdout.write(`${lines.join("\n")}\n`);
  }

  private renderGroup(group: IGroup, live: boolean): string[] {
    const tests = [...group.tests.values()];
    const finished = tests.filter((t) => t.status !== "running");
    const total =
      group.startedAt === undefined
        ? 0
        : (live ? Date.now() : (group.endedAt ?? Date.now())) - group.startedAt;
    const hasFailure = tests.some((t) => t.status === "failed");
    const count = live
      ? `${finished.length}/${group.expected} tests`
      : `${tests.length} tests`;
    const lines = [
      `${dim(timestamp())} ${hasFailure ? red("■") : live ? cyan("■") : green("■")} ${bold(
        group.header
      )} ${dim(`(${count}, ${seconds(total)})`)}${
        live ? "" : dim(`  [${this.done}/${this.total}]`)
      }`
    ];
    for (const test of tests) {
      lines.push(
        `      ${this.symbol(test)} ${test.title}  ${this.timing(test)}${this.suffix(test)}`
      );
      if (test.note) {
        lines.push(
          `          ${cyan(`ℹ expected error output: ${test.note}`)}`
        );
      }
      if (test.error) lines.push(`          ${red(test.error)}`);
    }
    return lines;
  }

  private symbol(test: ITestState): string {
    switch (test.status) {
      case "running":
        return cyan(SPINNER_FRAMES[this.frame] ?? "…");
      case "passed":
        return green("✔");
      case "failed":
        return red("✘");
      case "flaky":
        return yellow("⚠");
      default:
        return yellow("⊘");
    }
  }

  private timing(test: ITestState): string {
    const ms =
      test.status === "running" ? Date.now() - test.startedAt : test.durationMs;
    return dim(seconds(ms));
  }

  private suffix(test: ITestState): string {
    if (test.status === "running" && test.attempt > 1) {
      return yellow(`  retry #${test.attempt - 1}`);
    }
    if (test.status === "flaky") {
      return yellow(`  flaky, passed on attempt ${test.attempt}`);
    }
    if (test.status === "failed" && test.attempt > 1) {
      return red(`  failed after ${test.attempt} attempts`);
    }
    return test.status === "skipped" ? yellow("  skipped") : "";
  }

  private progressLine(): string {
    const { passed, failed, flaky } = this.counts;
    const running = [...this.groups.values()].reduce(
      (sum, g) =>
        sum +
        [...g.tests.values()].filter((t) => t.status === "running").length,
      0
    );
    return [
      `${cyan("●")} ${bold(`${this.done}/${this.total}`)} done`,
      green(`✔ ${passed}`),
      failed > 0 ? red(`✘ ${failed}`) : dim(`✘ ${failed}`),
      flaky > 0 ? yellow(`⚠ ${flaky}`) : dim(`⚠ ${flaky}`),
      cyan(`${SPINNER_FRAMES[this.frame] ?? ""} ${running} running`),
      dim(clock(Date.now() - this.startedAt))
    ].join("  ");
  }

  private regionContent(): string[] {
    const lines = [this.progressLine()];
    for (const group of this.groups.values()) {
      if (group.printed || group.tests.size === 0) continue;
      lines.push(...this.renderGroup(group, true));
    }
    return lines;
  }

  private fit(line: string): string {
    const columns = (process.stdout.columns ?? 120) - 1;
    const visible = plain(line);
    return visible.length > columns
      ? `${visible.slice(0, columns - 1)}…`
      : line;
  }

  private clearRegion(): void {
    if (!isInteractive || this.regionLines === 0) return;
    process.stdout.write(`\u001b[${this.regionLines}A\u001b[0J`);
    this.regionLines = 0;
  }

  private drawRegion(): void {
    if (!isInteractive) return;
    const lines = this.regionContent().map((line) => this.fit(line));
    process.stdout.write(`${lines.join("\n")}\n`);
    this.regionLines = lines.length;
  }

  private redraw(): void {
    if (!isInteractive) return;
    this.clearRegion();
    this.drawRegion();
  }

  /** Writes permanent output above the live region. */
  private emit(text: string): void {
    this.clearRegion();
    process.stdout.write(text);
    this.drawRegion();
  }

  /** Output of the web servers, kept visually apart from the test blocks. */
  private forward(chunk: string | Buffer): void {
    const lines = chunk
      .toString()
      .split("\n")
      .filter((line) => line.trim() !== "")
      .map((line) => `${dim(timestamp())}   ${dim(`│ ${line}`)}`);
    if (lines.length > 0) this.emit(`${lines.join("\n")}\n`);
  }
}
