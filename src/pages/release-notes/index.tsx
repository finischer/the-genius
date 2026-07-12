import { Stack, Text, Title } from "@mantine/core";
import fs from "fs";
import type { GetStaticProps } from "next";
import path from "path";
import PageLayout from "~/components/layout/PageLayout";
import { ReleaseNoteCard } from "~/components/release-notes/ReleaseNoteCard";
import {
  releaseNoteSchema,
  type ReleaseNote,
  type ReleaseNotesIndex
} from "~/types/releaseNotes";
import { sortVersionsDescending } from "~/utils/semver";

interface ReleaseNotesPageProps {
  releaseNotes: ReleaseNote[];
}

/**
 * Übersichtsseite unter `/release-notes` (Req. 1.1 – 1.5).
 *
 * Liest zur Build-Zeit die Release-Notes-Dateien aus `public/release-notes/`,
 * sortiert Versionen absteigend und rendert für jede Version eine
 * `<ReleaseNoteCard>`. Wenn (noch) keine Release Notes vorhanden sind, wird
 * ein Hinweistext angezeigt.
 */
const ReleaseNotesPage = ({ releaseNotes }: ReleaseNotesPageProps) => {
  return (
    <PageLayout>
      <Stack gap="lg">
        <Title order={1}>Release Notes</Title>

        {releaseNotes.length === 0 ? (
          <Text c="dimmed">Noch keine Release Notes verfügbar</Text>
        ) : (
          <Stack gap="md">
            {releaseNotes.map((releaseNote) => (
              <ReleaseNoteCard
                key={releaseNote.version}
                releaseNote={releaseNote}
              />
            ))}
          </Stack>
        )}
      </Stack>
    </PageLayout>
  );
};

export default ReleaseNotesPage;

/**
 * Liest die Release-Notes-Daten synchron vom Dateisystem.
 *
 * - Fehlt oder ist die `index.json` invalide, wird ein leeres Array zurückgegeben,
 *   damit die Seite nicht crasht (Req. 1.5 kann dann greifen).
 * - Einzelne `<version>.json`-Dateien werden mit `releaseNoteSchema.safeParse`
 *   validiert; invalide Einträge werden übersprungen.
 * - Die Ergebnisliste ist nach semver absteigend sortiert (neueste zuerst, Req. 1.2).
 */
export const getStaticProps: GetStaticProps<ReleaseNotesPageProps> = () => {
  const releaseNotesDir = path.join(process.cwd(), "public", "release-notes");
  const indexPath = path.join(releaseNotesDir, "index.json");

  let versions: string[] = [];

  try {
    const rawIndex = fs.readFileSync(indexPath, "utf-8");
    const parsedIndex = JSON.parse(rawIndex) as Partial<ReleaseNotesIndex>;

    if (Array.isArray(parsedIndex.versions)) {
      versions = parsedIndex.versions.filter(
        (version): version is string => typeof version === "string"
      );
    }
  } catch (error) {
    console.error(
      "[release-notes] Konnte index.json nicht lesen oder parsen:",
      error
    );
    return { props: { releaseNotes: [] } };
  }

  const sortedVersions = sortVersionsDescending(versions);

  const releaseNotes: ReleaseNote[] = [];

  for (const version of sortedVersions) {
    const versionPath = path.join(releaseNotesDir, `${version}.json`);

    try {
      const rawNote = fs.readFileSync(versionPath, "utf-8");
      const parsedNote: unknown = JSON.parse(rawNote);
      const result = releaseNoteSchema.safeParse(parsedNote);

      if (result.success) {
        releaseNotes.push(result.data);
      } else {
        console.error(
          `[release-notes] Release Note für Version ${version} ist ungültig:`,
          result.error.flatten()
        );
      }
    } catch (error) {
      console.error(
        `[release-notes] Konnte Release Note für Version ${version} nicht lesen:`,
        error
      );
    }
  }

  return {
    props: {
      releaseNotes
    }
  };
};
