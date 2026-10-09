import type {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestResult
} from "@playwright/test/reporter";

const EXPECTED_ERROR_ANNOTATION = "expected-error";

function timestamp(): string {
  return new Date().toISOString().slice(11, 19);
}

function firstLine(text: string | undefined): string {
  const stripped = (text ?? "").replace(/\u001b\[[0-9;]*m/g, "");
  return (
    stripped
      .split("\n")
      .find((line) => line.trim() !== "")
      ?.trim() ?? ""
  );
}

function describeTest(test: TestCase): string {
  const [, project, file, ...titles] = test.titlePath();
  return `${project ?? ""} › ${file ?? ""} › ${titles.join(" › ")}`;
}

/**
 * Prints one line when a test starts and one when it ends, so the log shows
 * which test is running and whether an error in the output is expected.
 */
export default class E2eReporter implements Reporter {
  private total = 0;
  private flaky: string[] = [];

  onBegin(_config: FullConfig, suite: Suite): void {
    this.total = suite.allTests().length;
    this.log(`Starting ${this.total} tests`);
  }

  onTestBegin(test: TestCase, result: TestResult): void {
    const attempt = result.retry > 0 ? ` (retry #${result.retry})` : "";
    this.log(`▶ [w${result.workerIndex}] ${describeTest(test)}${attempt}`);
    for (const annotation of test.annotations) {
      if (annotation.type === EXPECTED_ERROR_ANNOTATION) {
        this.log(
          `  ℹ [w${result.workerIndex}] error output is expected: ${annotation.description ?? ""}`
        );
      }
    }
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    const seconds = (result.duration / 1000).toFixed(1);
    const prefix = `[w${result.workerIndex}] ${describeTest(test)} (${seconds}s)`;
    switch (result.status) {
      case "passed":
        this.log(`✔ ${prefix}`);
        break;
      case "skipped":
        this.log(`⊘ SKIPPED ${prefix}`);
        break;
      default: {
        const willRetry = result.retry < test.retries;
        const label = willRetry ? "✘ FAILED, will retry" : "✘ FAILED";
        this.log(`${label} ${prefix} [${result.status}]`);
        this.log(`    ${firstLine(result.error?.message)}`);
      }
    }
    if (result.status === "passed" && test.outcome() === "flaky") {
      this.flaky.push(describeTest(test));
      this.log(
        `  ⚠ [w${result.workerIndex}] passed only after a retry (flaky)`
      );
    }
  }

  onStdOut(chunk: string | Buffer, test?: TestCase): void {
    this.forward(chunk, test);
  }

  onStdErr(chunk: string | Buffer, test?: TestCase): void {
    this.forward(chunk, test);
  }

  onEnd(result: FullResult): void {
    this.log(`Finished with status "${result.status}"`);
    for (const name of this.flaky) this.log(`  ⚠ FLAKY ${name}`);
  }

  printsToStdio(): boolean {
    return true;
  }

  private forward(chunk: string | Buffer, test?: TestCase): void {
    const origin = test ? ` (${describeTest(test)})` : "";
    for (const line of chunk.toString().split("\n")) {
      if (line.trim() === "") continue;
      process.stdout.write(`${timestamp()}   │ ${line}${origin}\n`);
    }
  }

  private log(message: string): void {
    process.stdout.write(`${timestamp()} ${message}\n`);
  }
}
