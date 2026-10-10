import { readFileSync, readdirSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { E2E_REQUIRED_ENV } from "../../env";
import { Game } from "../../../../src/games/core/types";

const ROOT = resolve(__dirname, "../../../..");
const SRC_DIR = join(ROOT, "src");
const TEST_ID_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)+$/;
const SOURCE_EXTENSIONS = /\.(ts|tsx|js|jsx)$/;

const collectSourceFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      return entry.name === "examples" ? [] : collectSourceFiles(fullPath);
    }
    return SOURCE_EXTENSIONS.test(entry.name) ? [fullPath] : [];
  });

// Matches data-testid="x", data-testid={"x"}, data-testid={`x-${y}`}
// and object keys like "data-testid": "x"
const TEST_ID_LITERAL =
  /["']?data-testid["']?\s*[=:]\s*(?:"([^"]*)"|'([^']*)'|\{\s*"([^"]*)"\s*\}|\{\s*`([^`]*)`\s*\})/g;

interface ITestIdOccurrence {
  file: string;
  raw: string;
  normalized: string;
}

const scanTestIds = (): ITestIdOccurrence[] =>
  collectSourceFiles(SRC_DIR).flatMap((file) => {
    const content = readFileSync(file, "utf8");
    return [...content.matchAll(TEST_ID_LITERAL)].map((match) => {
      const raw = match[1] ?? match[2] ?? match[3] ?? match[4] ?? "";
      return {
        file: relative(ROOT, file),
        raw,
        // Dynamic parts are replaced by a neutral segment
        normalized: raw.replace(/\$\{[^}]*\}/g, "x")
      };
    });
  });

describe("repo scan: data-testid convention", () => {
  const occurrences = scanTestIds();

  it("finds data-testid literals in src", () => {
    expect(occurrences.length).toBeGreaterThan(0);
  });

  it("uses kebab-case with at least two segments for every data-testid", () => {
    const violations = occurrences
      .filter(({ normalized }) => !TEST_ID_PATTERN.test(normalized))
      .map(({ file, raw }) => `${file}: "${raw}"`);

    expect(violations).toEqual([]);
  });
});

describe("repo scan: game registry", () => {
  it("lists every Game enum value in GAME_CONFIGS", () => {
    const content = readFileSync(
      join(SRC_DIR, "games/core/games.config.ts"),
      "utf8"
    );
    const enumByKey = Game as Record<string, string>;
    const configured = [...content.matchAll(/^\s*identifier:\s*Game\.(\w+)/gm)]
      .map((match) => enumByKey[match[1] ?? ""])
      .sort();

    expect(configured.every((value) => value !== undefined)).toBe(true);
    expect(configured).toEqual(Object.values(Game).sort());
  });
});

describe("repo scan: .env.test.example", () => {
  it("contains every name from E2E_REQUIRED_ENV", () => {
    const content = readFileSync(join(ROOT, ".env.test.example"), "utf8");
    const declared = new Set(
      content
        .split("\n")
        .map((line) => /^\s*#?\s*([A-Z][A-Z0-9_]*)\s*=/.exec(line)?.[1])
        .filter((name): name is string => name !== undefined)
    );

    const missing = E2E_REQUIRED_ENV.filter((name) => !declared.has(name));
    expect(missing).toEqual([]);
  });
});
