import {
  Anchor,
  Divider,
  List,
  Modal,
  Stack,
  Text,
  Title
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import Link from "next/link";
import { type FC } from "react";

import type {
  ChangeCategory,
  ChangeEntry,
  ReleaseNote
} from "~/types/releaseNotes";
import { api } from "~/utils/api";

interface NewReleaseModalProps {
  opened: boolean;
  onClose: () => void;
  releaseNote: ReleaseNote;
}

/**
 * Deterministische Reihenfolge, in der Kategorien im Modal-Rendering
 * dargestellt werden. Kategorien ohne Einträge werden nicht angezeigt
 * (Req. 4.2). Reihenfolge identisch zu `ReleaseNoteDetail` (Task 4.6).
 */
const CATEGORY_ORDER: readonly ChangeCategory[] = [
  "feature",
  "bugfix",
  "improvement",
  "other"
] as const;

/**
 * Menschenlesbare Labels für die Kategorien-Überschriften.
 * Konsistent zu `ReleaseNoteDetail` (Task 4.6, Req. 4.2).
 */
const CATEGORY_LABELS: Record<ChangeCategory, string> = {
  feature: "Neue Features",
  bugfix: "Bugfixes",
  improvement: "Verbesserungen",
  other: "Sonstiges"
};

/**
 * Gruppiert Änderungseinträge nach ihrer Kategorie. Die Reihenfolge
 * der Einträge innerhalb einer Kategorie bleibt gegenüber dem Input
 * erhalten.
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
 * Modal, das dem User auf der Startseite angezeigt wird, wenn seit
 * seinem letzten Besuch ein neues Release erschienen ist.
 *
 * Verhalten:
 * - Zeigt Versionsnummer im Titel sowie alle Änderungen aufgegliedert
 *   nach Kategorien; Kategorien ohne Einträge werden ausgelassen
 *   (Req. 4.2).
 * - Enthält einen Link auf `/release-notes/{version}` zur vollständigen
 *   Detail-Seite des aktuellen Releases (Req. 4.4).
 * - Beim Schließen (Schließen-Button, Backdrop-Klick, ESC) wird die
 *   tRPC-Mutation `releaseNotes.markAsSeen` mit der aktuellen Version
 *   aufgerufen. Anschließend wird der Parent-`onClose`-Handler
 *   ausgeführt (Req. 4.3).
 * - Fehler der Mutation werden über eine nicht-blockierende Mantine-
 *   Notification signalisiert; die App-Funktionalität bleibt
 *   unbeeinträchtigt (Req. 6.5).
 */
const NewReleaseModal: FC<NewReleaseModalProps> = ({
  opened,
  onClose,
  releaseNote
}) => {
  const markAsSeenMutation = api.releaseNotes.markAsSeen.useMutation();

  const grouped = groupChangesByCategory(releaseNote.changes);
  const categoriesToRender = CATEGORY_ORDER.filter(
    (category) => grouped[category].length > 0
  );

  const handleClose = () => {
    markAsSeenMutation.mutate(
      { version: releaseNote.version },
      {
        onError: (error) => {
          notifications.show({
            color: "red",
            title: "Fehler",
            message:
              error.message ||
              "Konnte die gesehene Release-Version nicht speichern"
          });
        }
      }
    );

    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      closeOnClickOutside={true}
      closeOnEscape={true}
      centered
      size="lg"
      title={<Text fw={600}>Neues Release: {releaseNote.version}</Text>}
    >
      <Stack gap="lg">
        {categoriesToRender.map((category, index) => {
          const entries = grouped[category];

          return (
            <Stack key={category} gap="xs">
              {index > 0 && <Divider />}
              <Title order={3}>{CATEGORY_LABELS[category]}</Title>
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

        <Divider />
        <Anchor component={Link} href={`/release-notes/${releaseNote.version}`}>
          Zur vollständigen Release Note
        </Anchor>
      </Stack>
    </Modal>
  );
};

export default NewReleaseModal;
export { NewReleaseModal };
export type { NewReleaseModalProps };
