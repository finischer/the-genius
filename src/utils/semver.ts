/**
 * Semver-Hilfsfunktionen für Release Notes.
 *
 * Unterstützt ausschließlich das Format `MAJOR.MINOR.PATCH` mit rein
 * numerischen Segmenten (z.B. `1.2.3`). Pre-Release-Tags, Build-Metadaten
 * oder abweichende Formate werden bewusst nicht unterstützt.
 */

const SEMVER_REGEX = /^\d+\.\d+\.\d+$/;

/**
 * Zerlegt einen Versionsstring in ein Tuple aus [major, minor, patch].
 *
 * @throws Error wenn der Versionsstring nicht dem Format `MAJOR.MINOR.PATCH`
 *   entspricht.
 */
function parseVersion(version: string): [number, number, number] {
  if (!SEMVER_REGEX.test(version)) {
    throw new Error(
      `Ungültiger Versionsstring "${version}": erwartet Format MAJOR.MINOR.PATCH.`
    );
  }

  const [major, minor, patch] = version.split(".").map(Number) as [
    number,
    number,
    number
  ];

  return [major, minor, patch];
}

/**
 * Vergleicht zwei semver-Versionsstrings im Format `MAJOR.MINOR.PATCH`.
 *
 * @returns Positive Zahl wenn `a > b`, negative Zahl wenn `a < b`, `0` wenn
 *   beide Versionen semantisch gleich sind.
 * @throws Error wenn einer der Strings nicht dem erwarteten Format entspricht.
 */
export function compareVersions(a: string, b: string): number {
  const [aMajor, aMinor, aPatch] = parseVersion(a);
  const [bMajor, bMinor, bPatch] = parseVersion(b);

  if (aMajor !== bMajor) return aMajor - bMajor;
  if (aMinor !== bMinor) return aMinor - bMinor;
  return aPatch - bPatch;
}

/**
 * Sortiert ein Array von semver-Versionsstrings absteigend (neueste zuerst).
 *
 * Gibt ein neues Array zurück; das Eingabearray bleibt unverändert.
 *
 * @throws Error wenn einer der Strings nicht dem Format `MAJOR.MINOR.PATCH`
 *   entspricht.
 */
export function sortVersionsDescending(versions: string[]): string[] {
  return [...versions].sort((a, b) => compareVersions(b, a));
}

/**
 * Entscheidet, ob das New-Release-Modal für einen Nutzer angezeigt werden soll.
 *
 * Regeln:
 * - Wenn `seenVersion === null` (First-Visit-Fall), wird `false` zurückgegeben.
 *   Der Aufrufer ist dafür zuständig, `seenReleaseVersion` in diesem Fall
 *   sofort auf die aktuelle Version zu setzen, damit das Modal beim ersten
 *   Besuch nicht erscheint.
 * - Wenn `currentVersion` semantisch größer als `seenVersion` ist, wird `true`
 *   zurückgegeben.
 * - Ansonsten (gleiche oder ältere Version) wird `false` zurückgegeben.
 *
 * @param currentVersion Aktuelle App-Version im Format `MAJOR.MINOR.PATCH`.
 * @param seenVersion Zuletzt vom Nutzer gesehene Version oder `null`, falls
 *   der Nutzer noch keine Version gesehen hat.
 * @throws Error wenn einer der übergebenen Strings nicht dem Format
 *   `MAJOR.MINOR.PATCH` entspricht.
 */
export function shouldShowModal(
  currentVersion: string,
  seenVersion: string | null
): boolean {
  if (seenVersion === null) {
    return false;
  }

  return compareVersions(currentVersion, seenVersion) > 0;
}
