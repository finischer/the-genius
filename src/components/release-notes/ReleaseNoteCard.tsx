import { Badge, Card, Group, Stack, Text } from "@mantine/core";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useMemo, type FC, type KeyboardEvent } from "react";
import type { ChangeCategory, ReleaseNote } from "~/types/releaseNotes";

/**
 * Anzeige-Labels der Änderungskategorien.
 * Identisch zu den Labels in `ReleaseNoteDetail` (Task 4.6).
 */
const CATEGORY_LABELS: Record<ChangeCategory, string> = {
  feature: "Neue Features",
  bugfix: "Bugfixes",
  improvement: "Verbesserungen",
  other: "Sonstiges"
};

/**
 * Reihenfolge, in der Kategorien in der Card-Zusammenfassung angezeigt werden.
 */
const CATEGORY_ORDER: ChangeCategory[] = [
  "feature",
  "improvement",
  "bugfix",
  "other"
];

interface ReleaseNoteCardProps {
  releaseNote: ReleaseNote;
}

/**
 * Übersichts-Card einer Release Note (Req. 1.3, 1.4).
 *
 * Zeigt Versionsnummer, Datum (Format `DD.MM.YYYY`) sowie eine Zusammenfassung
 * aller Kategorien, für die mindestens ein Änderungseintrag vorhanden ist
 * (jede Kategorie mit Label und Anzahl Einträge). Ein Klick navigiert zur
 * zugehörigen Detailseite unter `/release-notes/[version]`.
 */
const ReleaseNoteCard: FC<ReleaseNoteCardProps> = ({ releaseNote }) => {
  const router = useRouter();

  const formattedDate = useMemo(
    () => dayjs(releaseNote.date).format("DD.MM.YYYY"),
    [releaseNote.date]
  );

  const categorySummaries = useMemo(() => {
    const counts = new Map<ChangeCategory, number>();
    for (const change of releaseNote.changes) {
      counts.set(change.category, (counts.get(change.category) ?? 0) + 1);
    }

    return CATEGORY_ORDER.filter(
      (category) => (counts.get(category) ?? 0) > 0
    ).map((category) => ({
      category,
      label: CATEGORY_LABELS[category],
      count: counts.get(category) ?? 0
    }));
  }, [releaseNote.changes]);

  const navigateToDetail = () => {
    void router.push(`/release-notes/${releaseNote.version}`);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      navigateToDetail();
    }
  };

  return (
    <Card
      withBorder
      radius="md"
      p="md"
      onClick={navigateToDetail}
      onKeyDown={handleKeyDown}
      role="link"
      tabIndex={0}
      style={{ cursor: "pointer" }}
    >
      <Stack gap="sm">
        <Group justify="space-between" align="center" wrap="nowrap">
          <Text fz="lg" fw={600}>
            Version {releaseNote.version}
          </Text>
          <Text fz="sm" c="dimmed">
            {formattedDate}
          </Text>
        </Group>

        {categorySummaries.length > 0 && (
          <Group gap="xs" wrap="wrap">
            {categorySummaries.map((summary) => (
              <Badge key={summary.category} variant="light">
                {summary.label} ({summary.count})
              </Badge>
            ))}
          </Group>
        )}
      </Stack>
    </Card>
  );
};

export default ReleaseNoteCard;
export { ReleaseNoteCard };
export type { ReleaseNoteCardProps };
