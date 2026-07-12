import fs from "fs";
import path from "path";

import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure
} from "~/server/api/trpc";
import {
  releaseNoteSchema,
  type ReleaseNote,
  type ReleaseNotesIndex
} from "~/types/releaseNotes";

/**
 * Regex für semver-Versionen im Format MAJOR.MINOR.PATCH.
 * Wird sowohl beim `markAsSeen`-Input als auch für die zu lesenden
 * JSON-Dateinamen verwendet, damit keine ungültigen Pfadfragmente
 * an das Dateisystem weitergegeben werden.
 */
const SEMVER_REGEX = /^\d+\.\d+\.\d+$/;

const RELEASE_NOTES_DIR = path.join(process.cwd(), "public", "release-notes");
const RELEASE_NOTES_INDEX_FILE = path.join(RELEASE_NOTES_DIR, "index.json");

/**
 * Liest und parst eine JSON-Datei vom Dateisystem.
 * Gibt `null` zurück, wenn die Datei nicht existiert oder das JSON
 * ungültig ist. In allen anderen Fehlerfällen wird `console.error`
 * geloggt und `null` zurückgegeben, damit `getLatest` nicht wirft.
 */
function readJsonFile(filePath: string): unknown {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  let raw: string;
  try {
    raw = fs.readFileSync(filePath, "utf-8");
  } catch (error) {
    console.error(`Failed to read release notes file: ${filePath}`, error);
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error(`Invalid JSON in release notes file: ${filePath}`, error);
    return null;
  }
}

export const releaseNotesRouter = createTRPCRouter({
  /**
   * Gibt die `seenReleaseVersion` des aktuell eingeloggten Users zurück.
   * Wenn der User noch keine Version gesehen hat, wird `null` zurückgegeben
   * (First-Visit-Fall, siehe Req. 4.5).
   */
  getSeenVersion: protectedProcedure
    .output(z.string().nullable())
    .query(async ({ ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { seenReleaseVersion: true }
      });

      return user?.seenReleaseVersion ?? null;
    }),

  /**
   * Setzt die `seenReleaseVersion` des aktuellen Users auf den übergebenen Wert.
   * Bei Prisma-Fehlern wird der Fehler geloggt und ein `TRPCError` mit Code
   * `INTERNAL_SERVER_ERROR` geworfen, damit der Client eine nicht-blockierende
   * Notification zeigen kann (Req. 6.4, 6.5).
   */
  markAsSeen: protectedProcedure
    .input(z.object({ version: z.string().regex(SEMVER_REGEX) }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.user.update({
          where: { id: ctx.session.user.id },
          data: { seenReleaseVersion: input.version }
        });
      } catch (error) {
        console.error("Failed to update seenReleaseVersion", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Konnte die gesehene Release-Version nicht speichern"
        });
      }
    }),

  /**
   * Liest die neueste Release Note aus `public/release-notes/`.
   *
   * Ablauf:
   * 1. `index.json` einlesen; wenn nicht vorhanden oder ungültig → `null`
   * 2. Wenn `versions` leer ist → `null` (kein Release Note existiert)
   * 3. Erste Version aus `versions` (bereits absteigend sortiert) lesen
   * 4. `<version>.json` einlesen und via `releaseNoteSchema.safeParse`
   *    validieren; bei Validierungsfehler → `console.error` + `null`
   */
  getLatest: publicProcedure
    .output(releaseNoteSchema.nullable())
    .query((): ReleaseNote | null => {
      const indexRaw = readJsonFile(RELEASE_NOTES_INDEX_FILE);
      if (indexRaw === null) {
        return null;
      }

      const index = indexRaw as Partial<ReleaseNotesIndex>;
      const versions = index.versions;
      if (!Array.isArray(versions) || versions.length === 0) {
        return null;
      }

      const latestVersion = versions[0];
      if (
        typeof latestVersion !== "string" ||
        !SEMVER_REGEX.test(latestVersion)
      ) {
        console.error(
          `Invalid latest version in release notes index: ${String(latestVersion)}`
        );
        return null;
      }

      const versionFile = path.join(RELEASE_NOTES_DIR, `${latestVersion}.json`);
      const releaseNoteRaw = readJsonFile(versionFile);
      if (releaseNoteRaw === null) {
        return null;
      }

      const parsed = releaseNoteSchema.safeParse(releaseNoteRaw);
      if (!parsed.success) {
        console.error(
          `Invalid release note JSON at ${versionFile}:`,
          parsed.error.flatten()
        );
        return null;
      }

      return parsed.data;
    })
});
