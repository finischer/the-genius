import { Divider, List, Stack, Text, Title } from "@mantine/core";
import { type FC } from "react";
import type {
  ChangeCategory,
  ChangeEntry,
  ReleaseNote
} from "~/types/releaseNotes";

interface ReleaseNoteDetailProps {
  releaseNote: ReleaseNote;
}

/**
 * Deterministische Reihenfolge, in der Kategorien im Detail-Rendering
 * dargestellt werden. Kategorien ohne Einträge werden nicht angezeigt.
 */
const CATEGORY_ORDER: readonly ChangeCategory[] = [
  "feature",
  "bugfix",
  "improvement",
  "other"
] as const;

/**
 * Menschenlesbare Labels für die Kategorien-Überschriften (Req. 2.2).
 */
const CATEGORY_LABELS: Record<ChangeCategory, string> = {
  feature: "Neue Features",
  bugfix: "Bugfixes",
  improvement: "Verbesserungen",
  other: "Sonstiges"
};

/**
 * Formatiert ein ISO-8601-Datum als `DD.MM.YYYY`.
 *
 * Wir parsen die ersten 10 Zeichen (`YYYY-MM-DD`) manuell, um unabhängig
 * von der lokalen Zeitzone dasselbe Datum zu erhalten wie im
 * ursprünglich gespeicherten JSON.
 */
function formatDate(isoDate: string): string {
  const datePart = isoDate.slice(0, 10);
  const [year, month, day] = datePart.split("-");

  if (year === undefined || month === undefined || day === undefined) {
    return isoDate;
  }

  return `${day}.${month}.${year}`;
}

/**
 * Gruppiert Änderungseinträge nach ihrer Kategorie. Die Reihenfolge der
 * Einträge innerhalb einer Kategorie bleibt gegenüber dem Input erhalten.
 */
function groupChangesByCategory(
  changes: ChangeEntry[]
): Record<ChangeCategory, ChangeEntry[]> {
  const grouped: Record<ChangeCategory, ChangeEntry[]> = {
    feature: [],
    bugfix: [],
    improvement: [],
    other: []
  };

  for (const change of changes) {
    grouped[change.category].push(change);
  }

  return grouped;
}

/**
 * Detail-Darstellung einer Release Note (Req. 2.2).
 *
 * - Zeigt Versionsnummer und Datum (`DD.MM.YYYY`) als Header.
 * - Rendert Kategorien in fester Reihenfolge (`feature → bugfix →
 *   improvement → other`). Kategorien ohne Einträge werden komplett
 *   ausgelassen.
 * - Jeder Eintrag wird ausschließlich mit seinem `description`-Text
 *   angezeigt (keine Links, keine PR-Referenzen).
 */
const ReleaseNoteDetail: FC<ReleaseNoteDetailProps> = ({ releaseNote }) => {
  const grouped = groupChangesByCategory(releaseNote.changes);

  const categoriesToRender = CATEGORY_ORDER.filter(
    (category) => grouped[category].length > 0
  );

  return (
    <Stack gap="lg">
      <Stack gap={4}>
        <Title order={1}>{releaseNote.version}</Title>
        <Text c="dimmed">{formatDate(releaseNote.date)}</Text>
      </Stack>

      {categoriesToRender.map((category, index) => {
        const entries = grouped[category];

        return (
          <Stack key={category} gap="xs">
            {index > 0 && <Divider />}
            <Title order={2} size="h3">
              {CATEGORY_LABELS[category]}
            </Title>
            <List spacing="xs">
              {entries.map((entry, entryIndex) => (
                <List.Item key={`${category}-${entryIndex}`}>
                  {entry.description}
                </List.Item>
              ))}
            </List>
          </Stack>
        );
      })}
    </Stack>
  );
};

export default ReleaseNoteDetail;
export type { ReleaseNoteDetailProps };
