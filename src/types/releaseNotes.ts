import { z } from "zod";

/**
 * Zod-Schema für einen einzelnen Änderungseintrag einer Release Note.
 *
 * Constraints (Req. 6.1):
 * - `category`: einer der Werte `"feature" | "bugfix" | "improvement" | "other"`
 * - `description`: String mit maximal 500 Zeichen
 */
export const changeEntrySchema = z.object({
  category: z.enum(["feature", "bugfix", "improvement", "other"]),
  description: z.string().max(500)
});

/**
 * Zod-Schema für eine vollständige Release Note.
 *
 * Constraints (Req. 6.1):
 * - `version`: String im Format `MAJOR.MINOR.PATCH` (semver, ohne Pre-Release / Build-Metadata)
 * - `date`: ISO-8601-Datum inkl. Zeitzonen-Offset
 * - `changes`: Array mit maximal 50 `ChangeEntry`-Objekten
 */
export const releaseNoteSchema = z.object({
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  date: z.string().datetime({ offset: true }),
  changes: z.array(changeEntrySchema).max(50)
});

/**
 * Kategorien-Enum für Änderungseinträge. Wird direkt aus dem Zod-Schema abgeleitet,
 * damit Runtime-Validierung und statische Typen synchron bleiben.
 */
export type ChangeCategory = z.infer<typeof changeEntrySchema>["category"];

/**
 * Ein einzelner Änderungseintrag einer Release Note. Besitzt ausschließlich
 * die Felder `category` und `description` – keine PR-Links, keine PR-IDs.
 */
export type ChangeEntry = z.infer<typeof changeEntrySchema>;

/**
 * Eine vollständige Release Note, wie sie unter `public/release-notes/<version>.json`
 * gespeichert wird.
 */
export type ReleaseNote = z.infer<typeof releaseNoteSchema>;

/**
 * Struktur der Index-Datei `public/release-notes/index.json`.
 *
 * - `versions`: alle Versionen in absteigender semver-Reihenfolge (neueste zuerst)
 * - `latest`: neueste Version; leerer String vor dem ersten Release
 */
export interface ReleaseNotesIndex {
  versions: string[];
  latest: string;
}
