/**
 * Release-Notes-Generator
 *
 * Wird ausschließlich in GitHub Actions (Workflow `publish.yml`) ausgeführt –
 * nie zur Laufzeit der Applikation. Erzeugt aus den seit dem letzten Git-Tag
 * gemergten Pull Requests eine strukturierte JSON-Release-Note und aktualisiert
 * den Release-Notes-Index unter `public/release-notes/`.
 *
 * Ablauf (siehe Task 2.3, Requirements 5.1–5.4):
 * 1. Version aus `package.json` lesen und validieren (Format `MAJOR.MINOR.PATCH`).
 * 2. Letzten Git-Tag (`v*`) + Tag-Datum via `git`-CLI ermitteln.
 * 3. GitHub REST API paginiert nach gemergten PRs (base=main, state=closed)
 *    abfragen und auf PRs mit `merged_at > tagDate` filtern.
 * 4. Jeden PR über {@link categorizePR} kategorisieren und eine
 *    Beschreibung (max. 500 Zeichen) ableiten.
 * 5. `ReleaseNote` zusammenbauen, mit `releaseNoteSchema` validieren und nach
 *    `public/release-notes/<version>.json` schreiben.
 * 6. `public/release-notes/index.json` aktualisieren (Version prepend, semver-
 *    sortiert, `latest` neu setzen; Duplikate werden nicht doppelt eingefügt).
 *
 * Bei jeglichem Fehler (fehlende Env-Variable, GitHub-API-Fehler,
 * Netzwerk-Fehler, Validierungsfehler) wird `process.exit(1)` aufgerufen und
 * es werden keine unvollständigen Dateien geschrieben.
 */

import { execSync } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";

import {
  releaseNoteSchema,
  type ChangeCategory,
  type ChangeEntry,
  type ReleaseNote,
  type ReleaseNotesIndex,
} from "~/types/releaseNotes";
import { sortVersionsDescending } from "~/utils/semver";

/**
 * Kategorie-Labels in Prioritäts-Reihenfolge.
 *
 * Ein PR kann mehrere Labels tragen; falls mehrere davon einer Kategorie
 * entsprechen, gewinnt die zuerst genannte Kategorie. Damit ist die Zuordnung
 * deterministisch – unabhängig davon, in welcher Reihenfolge die Labels von
 * der GitHub-API geliefert werden.
 */
const CATEGORY_LABEL_PRIORITY: readonly ChangeCategory[] = [
  "feature",
  "bugfix",
  "improvement",
  "other",
] as const;

/**
 * Conventional-Commit-Präfixe für die Titel-Analyse.
 *
 * Erlaubte Formen:
 * - `feat:`, `feat(scope):`, `feat!:`, `feat(scope)!:`
 * - analog für `fix`, `refactor`, `perf`, `improve`, `improvement`, `feature`,
 *   `bugfix`
 *
 * Die Reihenfolge legt die Priorität fest; das erste passende Pattern gewinnt.
 */
const TITLE_PATTERNS: readonly {
  readonly pattern: RegExp;
  readonly category: ChangeCategory;
}[] = [
  {
    pattern: /^(feat|feature)(\([^)]*\))?!?:/i,
    category: "feature",
  },
  {
    pattern: /^(fix|bugfix)(\([^)]*\))?!?:/i,
    category: "bugfix",
  },
  {
    pattern: /^(refactor|perf|improve|improvement)(\([^)]*\))?!?:/i,
    category: "improvement",
  },
] as const;

/** Semver-Regex, deckungsgleich mit `releaseNoteSchema.version`. */
const VERSION_REGEX = /^\d+\.\d+\.\d+$/;

/** Maximale Länge einer PR-Beschreibung gemäß `releaseNoteSchema`. */
const MAX_DESCRIPTION_LENGTH = 500;

/** GitHub-API-Seitengröße (Maximum laut REST-API-Dokumentation). */
const PAGE_SIZE = 100;

/** Absoluter Pfad zum Release-Notes-Ausgabeverzeichnis. */
const RELEASE_NOTES_DIR = path.resolve(
  process.cwd(),
  "public",
  "release-notes",
);

/** Absoluter Pfad zur `index.json`. */
const RELEASE_NOTES_INDEX_PATH = path.join(RELEASE_NOTES_DIR, "index.json");

/**
 * Ordnet einen Pull Request einer der vier `ChangeCategory`-Werte zu.
 *
 * Regeln (in dieser Reihenfolge):
 * 1. **Label-Vorrang**: Enthält der PR ein Label, dessen normalisierter Wert
 *    (getrimmt, kleingeschrieben) einer der Kategorien `feature`, `bugfix`,
 *    `improvement` oder `other` entspricht, wird diese Kategorie
 *    zurückgegeben. Bei mehreren Treffern gewinnt die Kategorie, die in
 *    {@link CATEGORY_LABEL_PRIORITY} zuerst gelistet ist.
 * 2. **Titel-Analyse (Conventional-Commit-Style)**: Beginnt der Titel mit
 *    `feat:` / `feature:` → `"feature"`, `fix:` / `bugfix:` → `"bugfix"`,
 *    `refactor:` / `perf:` / `improve:` / `improvement:` → `"improvement"`.
 *    Optionale Scopes (`feat(api):`) und Breaking-Change-Marker (`feat!:`)
 *    werden erkannt.
 * 3. **Default**: `"other"`.
 *
 * Die Funktion ist rein und deterministisch – keine I/O, keine Seiteneffekte,
 * derselbe Input erzeugt immer denselben Output.
 *
 * @param labels - GitHub-Labels des PRs (in beliebiger Reihenfolge)
 * @param title  - Titel des Pull Requests
 * @returns Eine der vier gültigen `ChangeCategory`-Werte
 */
export function categorizePR(
  labels: string[],
  title: string,
): ChangeCategory {
  // 1) Label-basierte Kategorisierung (höchste Priorität)
  const normalizedLabels = new Set(
    labels.map((label) => label.trim().toLowerCase()),
  );
  for (const category of CATEGORY_LABEL_PRIORITY) {
    if (normalizedLabels.has(category)) {
      return category;
    }
  }

  // 2) Titel-basierte Kategorisierung (Fallback)
  const normalizedTitle = title.trim();
  for (const { pattern, category } of TITLE_PATTERNS) {
    if (pattern.test(normalizedTitle)) {
      return category;
    }
  }

  // 3) Default
  return "other";
}

// ---------------------------------------------------------------------------
// Interne Typen für GitHub-API-Antworten (nur die von uns benötigten Felder)
// ---------------------------------------------------------------------------

interface GitHubLabel {
  name: string;
}

interface GitHubPullRequest {
  number: number;
  title: string;
  body: string | null;
  merged_at: string | null;
  updated_at: string;
  labels: GitHubLabel[];
}

interface OwnerRepo {
  owner: string;
  repo: string;
}

// ---------------------------------------------------------------------------
// Fehlerbehandlung
// ---------------------------------------------------------------------------

/**
 * Bricht den Prozess mit einer lesbaren Fehlermeldung ab.
 * Gibt aus TypeScript-Sicht `never` zurück, damit Aufrufstellen den Fluss
 * korrekt weiterverfolgen können.
 */
function fail(message: string, cause?: unknown): never {
  console.error(`[generate-release-notes] ${message}`);
  if (cause !== undefined) {
    console.error(cause);
  }
  process.exit(1);
}

// ---------------------------------------------------------------------------
// package.json / GITHUB_REPOSITORY einlesen
// ---------------------------------------------------------------------------

/**
 * Liest und validiert die Version aus der `package.json` im Projektwurzel-
 * verzeichnis. Bricht bei fehlendem Feld oder ungültigem Format ab.
 */
async function readVersionFromPackageJson(): Promise<string> {
  const packageJsonPath = path.resolve(process.cwd(), "package.json");
  let raw: string;
  try {
    raw = await fs.readFile(packageJsonPath, "utf-8");
  } catch (error) {
    fail(
      `Konnte package.json unter ${packageJsonPath} nicht lesen.`,
      error,
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    fail(`package.json enthält kein gültiges JSON.`, error);
  }

  if (
    typeof parsed !== "object" ||
    parsed === null ||
    !("version" in parsed) ||
    typeof parsed.version !== "string"
  ) {
    fail(
      "package.json enthält kein string-wertiges `version`-Feld.",
    );
  }

  const version = parsed.version;
  if (!VERSION_REGEX.test(version)) {
    fail(
      `Version "${version}" in package.json entspricht nicht dem Format MAJOR.MINOR.PATCH.`,
    );
  }

  return version;
}

/**
 * Zerlegt `GITHUB_REPOSITORY` im Format `owner/repo` in seine Bestandteile.
 * Bricht bei fehlender oder ungültiger Variable ab.
 */
function readOwnerRepoFromEnv(): OwnerRepo {
  const value = process.env.GITHUB_REPOSITORY;
  if (!value || value.trim() === "") {
    fail("Umgebungsvariable GITHUB_REPOSITORY ist nicht gesetzt.");
  }

  const parts = value.split("/");
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    fail(
      `GITHUB_REPOSITORY "${value}" hat nicht das erwartete Format "owner/repo".`,
    );
  }

  return { owner: parts[0], repo: parts[1] };
}

/**
 * Liest den `GITHUB_TOKEN`. Bricht bei fehlender Variable ab.
 */
function readGitHubTokenFromEnv(): string {
  const token = process.env.GITHUB_TOKEN;
  if (!token || token.trim() === "") {
    fail("Umgebungsvariable GITHUB_TOKEN ist nicht gesetzt.");
  }
  return token;
}

// ---------------------------------------------------------------------------
// Git-Tag ermitteln
// ---------------------------------------------------------------------------

/**
 * Ermittelt den zuletzt gesetzten `v*`-Tag (semver-absteigend sortiert).
 *
 * Rückgabe:
 * - Tag-Name inklusive `v`-Präfix (z.B. `"v1.2.3"`), falls ein Tag existiert.
 * - `null`, wenn das Repository keinen einzigen `v*`-Tag besitzt (dann werden
 *   im weiteren Verlauf alle gemergten PRs berücksichtigt).
 */
function getLatestGitTag(): string | null {
  let output: string;
  try {
    output = execSync("git tag --sort=-version:refname", {
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (error) {
    fail("`git tag` fehlgeschlagen.", error);
  }

  const firstMatchingTag = output
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line.startsWith("v"));

  return firstMatchingTag && firstMatchingTag.length > 0
    ? firstMatchingTag
    : null;
}

/**
 * Ermittelt das Autor-Datum (ISO-8601 mit Offset) des übergebenen Tags via
 * `git log -1 --format=%aI <tag>`. Bricht bei Fehlern ab.
 */
function getTagDate(tag: string): string {
  let output: string;
  try {
    // Argument wird als einzelner Parameter übergeben, um Command-Injection
    // auszuschließen. Der Tag stammt zwar aus einer eigenen `git tag`-Ausgabe,
    // dennoch bleibt die Argumentliste explizit.
    output = execSync(`git log -1 --format=%aI ${JSON.stringify(tag)}`, {
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (error) {
    fail(`Konnte Tag-Datum für "${tag}" nicht ermitteln.`, error);
  }

  const trimmed = output.trim();
  if (trimmed === "") {
    fail(`Tag "${tag}" existiert nicht oder liefert kein Datum.`);
  }
  return trimmed;
}

// ---------------------------------------------------------------------------
// GitHub REST API: gemergte PRs abrufen
// ---------------------------------------------------------------------------

/**
 * Ruft eine einzelne Seite gemergter PRs (base=main, state=closed) von der
 * GitHub REST API ab. Wirft bei HTTP- oder Netzwerkfehlern.
 */
async function fetchPullsPage(
  { owner, repo }: OwnerRepo,
  token: string,
  page: number,
): Promise<GitHubPullRequest[]> {
  const url = new URL(
    `https://api.github.com/repos/${owner}/${repo}/pulls`,
  );
  url.searchParams.set("state", "closed");
  url.searchParams.set("base", "main");
  url.searchParams.set("sort", "updated");
  url.searchParams.set("direction", "desc");
  url.searchParams.set("per_page", String(PAGE_SIZE));
  url.searchParams.set("page", String(page));

  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "the-genius-release-notes-generator",
    },
  });

  if (!response.ok) {
    const bodyText = await response.text().catch(() => "");
    throw new Error(
      `GitHub API ${response.status} ${response.statusText}: ${bodyText}`,
    );
  }

  const data = (await response.json()) as GitHubPullRequest[];
  return data;
}

/**
 * Lädt paginiert alle geschlossenen PRs, die *nach* `sinceDate` gemergt
 * wurden. Da die API nach `updated`-Datum absteigend sortiert ist und ein
 * gemergter PR sein `updated_at` mindestens gleich `merged_at` hat, brechen
 * wir die Pagination ab, sobald wir eine Seite sehen, deren letzter Eintrag
 * älter als `sinceDate` ist.
 *
 * Wenn `sinceDate === null` werden alle gemergten PRs berücksichtigt.
 */
async function fetchMergedPullRequestsSince(
  ownerRepo: OwnerRepo,
  token: string,
  sinceDate: string | null,
): Promise<GitHubPullRequest[]> {
  const sinceMs =
    sinceDate === null ? Number.NEGATIVE_INFINITY : Date.parse(sinceDate);
  if (Number.isNaN(sinceMs)) {
    fail(`Ungültiges Tag-Datum "${sinceDate}".`);
  }

  const merged: GitHubPullRequest[] = [];

  for (let page = 1; ; page++) {
    const pulls = await fetchPullsPage(ownerRepo, token, page);
    if (pulls.length === 0) break;

    for (const pull of pulls) {
      if (pull.merged_at === null) continue;
      const mergedAtMs = Date.parse(pull.merged_at);
      if (Number.isNaN(mergedAtMs)) continue;
      if (mergedAtMs > sinceMs) {
        merged.push(pull);
      }
    }

    // Abbruchkriterium: Wenn der letzte PR dieser Seite (nach updated_at
    // absteigend sortiert) älter als sinceDate ist, kann keine weitere Seite
    // relevante PRs enthalten.
    const last = pulls[pulls.length - 1];
    if (last) {
      const lastUpdatedMs = Date.parse(last.updated_at);
      if (!Number.isNaN(lastUpdatedMs) && lastUpdatedMs <= sinceMs) {
        break;
      }
    }

    if (pulls.length < PAGE_SIZE) break;
  }

  return merged;
}

// ---------------------------------------------------------------------------
// PR → ChangeEntry
// ---------------------------------------------------------------------------

/**
 * Leitet aus einem PR eine anzeigefreundliche `description` ab.
 *
 * Präferenz:
 * 1. Titel (getrimmt, falls nicht-leer).
 * 2. Erster Absatz des PR-Bodys, falls kein Titel vorhanden.
 * 3. Fallback: `"PR #<number>"`.
 *
 * Die Länge wird immer auf {@link MAX_DESCRIPTION_LENGTH} Zeichen begrenzt.
 */
function derivePullRequestDescription(pr: GitHubPullRequest): string {
  const trimmedTitle = pr.title.trim();
  if (trimmedTitle.length > 0) {
    return truncate(trimmedTitle, MAX_DESCRIPTION_LENGTH);
  }

  const body = (pr.body ?? "").trim();
  if (body.length > 0) {
    // Erster Absatz = alles bis zur ersten Leerzeile.
    const firstParagraph = body.split(/\r?\n\r?\n/)[0]?.trim() ?? "";
    if (firstParagraph.length > 0) {
      return truncate(firstParagraph, MAX_DESCRIPTION_LENGTH);
    }
  }

  return `PR #${pr.number}`;
}

function truncate(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  return value.slice(0, maxLength);
}

/**
 * Konvertiert eine Liste roher PRs in `ChangeEntry`-Objekte.
 * Enthält ausschließlich die Felder `category` und `description`.
 */
function toChangeEntries(pulls: GitHubPullRequest[]): ChangeEntry[] {
  return pulls.map((pr) => ({
    category: categorizePR(
      pr.labels.map((label) => label.name),
      pr.title,
    ),
    description: derivePullRequestDescription(pr),
  }));
}

// ---------------------------------------------------------------------------
// Dateien schreiben
// ---------------------------------------------------------------------------

/**
 * Schreibt eine validierte Release Note nach `public/release-notes/<version>.json`.
 * Legt das Zielverzeichnis bei Bedarf an.
 */
async function writeReleaseNoteFile(releaseNote: ReleaseNote): Promise<void> {
  await fs.mkdir(RELEASE_NOTES_DIR, { recursive: true });
  const targetPath = path.join(
    RELEASE_NOTES_DIR,
    `${releaseNote.version}.json`,
  );
  const payload = `${JSON.stringify(releaseNote, null, 2)}\n`;
  await fs.writeFile(targetPath, payload, "utf-8");
}

/**
 * Aktualisiert `public/release-notes/index.json`:
 * - Fügt die neue Version am Anfang von `versions` ein (nur wenn nicht bereits
 *   vorhanden) und sortiert das Ergebnis semver-absteigend.
 * - Setzt `latest` auf die neueste Version im resultierenden Array.
 *
 * Existiert die Datei nicht, wird sie mit einer neuen Struktur angelegt.
 */
async function updateIndexFile(newVersion: string): Promise<void> {
  await fs.mkdir(RELEASE_NOTES_DIR, { recursive: true });

  let currentIndex: ReleaseNotesIndex = { versions: [], latest: "" };

  try {
    const raw = await fs.readFile(RELEASE_NOTES_INDEX_PATH, "utf-8");
    const parsed = JSON.parse(raw) as unknown;
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "versions" in parsed &&
      Array.isArray(parsed.versions)
    ) {
      const versions = (parsed.versions as unknown[]).filter(
        (entry): entry is string => typeof entry === "string",
      );
      const latestRaw =
        "latest" in parsed ? (parsed as { latest: unknown }).latest : "";
      currentIndex = {
        versions,
        latest: typeof latestRaw === "string" ? latestRaw : "",
      };
    }
  } catch (error: unknown) {
    // ENOENT ist ok – wir starten mit einer leeren Struktur. Andere Fehler
    // führen zum Abbruch, um keinen fehlerhaften Index zu überschreiben.
    if (
      typeof error !== "object" ||
      error === null ||
      (error as NodeJS.ErrnoException).code !== "ENOENT"
    ) {
      fail(
        `Konnte bestehende ${RELEASE_NOTES_INDEX_PATH} nicht lesen/parsen.`,
        error,
      );
    }
  }

  const merged = currentIndex.versions.includes(newVersion)
    ? currentIndex.versions
    : [newVersion, ...currentIndex.versions];

  const sortedVersions = sortVersionsDescending(merged);
  const updated: ReleaseNotesIndex = {
    versions: sortedVersions,
    latest: sortedVersions[0] ?? newVersion,
  };

  const payload = `${JSON.stringify(updated, null, 2)}\n`;
  await fs.writeFile(RELEASE_NOTES_INDEX_PATH, payload, "utf-8");
}

// ---------------------------------------------------------------------------
// Haupt-Workflow
// ---------------------------------------------------------------------------

export async function main(): Promise<void> {
  const version = await readVersionFromPackageJson();
  const ownerRepo = readOwnerRepoFromEnv();
  const token = readGitHubTokenFromEnv();

  const latestTag = getLatestGitTag();
  const sinceDate = latestTag !== null ? getTagDate(latestTag) : null;

  let pulls: GitHubPullRequest[];
  try {
    pulls = await fetchMergedPullRequestsSince(ownerRepo, token, sinceDate);
  } catch (error) {
    fail("Fehler beim Abruf der Pull Requests von GitHub.", error);
  }

  const changes = toChangeEntries(pulls);

  const draft = {
    version,
    date: new Date().toISOString(),
    changes,
  };

  const validation = releaseNoteSchema.safeParse(draft);
  if (!validation.success) {
    fail(
      "Zusammengebaute Release Note ist nicht schema-konform.",
      validation.error.format(),
    );
  }

  await writeReleaseNoteFile(validation.data);
  await updateIndexFile(validation.data.version);

  console.log(
    `[generate-release-notes] Release Note für Version ${validation.data.version} geschrieben (${validation.data.changes.length} Änderungen).`,
  );
}

// Wenn das Skript direkt via `tsx scripts/generate-release-notes.ts` gestartet
// wird, führen wir `main` aus und fangen jeden Fehler ab. Bei Import aus
// Tests bleibt die Ausführung aus.
const isDirectExecution = (() => {
  const entry = process.argv[1];
  if (!entry) return false;
  // `import.meta.url` wäre sauberer, ist aber unter `verbatimModuleSyntax`
  // + Ziel `esnext` in diesem Setup nicht ohne weiteres verfügbar. Der
  // Vergleich über den Dateinamen genügt für den GitHub-Actions-Kontext.
  return entry.endsWith("generate-release-notes.ts");
})();

if (isDirectExecution) {
  void main().catch((err: unknown) => {
    console.error(err);
    process.exit(1);
  });
}
