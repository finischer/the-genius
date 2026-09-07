import {
  Button,
  Group,
  Menu,
  Stack,
  Text,
  TextInput,
  rem
} from "@mantine/core";
import { filterArray } from "@syncedstore/core";
import {
  IconMessageCircle,
  IconRefresh,
  IconSettings
} from "@tabler/icons-react";
import React, { useState } from "react";
import { useUser } from "~/hooks/useUser";
import type { Team } from "~/types/gameshow.types";

export function applyRename(
  team: Team,
  value: string,
  isHost?: boolean
): { team: Team; error: string | null } {
  if (isHost === false) return { team, error: null };

  const trimmed = value.trim();

  if (!trimmed) {
    return { team, error: "Name darf nicht leer sein" };
  }

  if (trimmed.length > 30) {
    return { team, error: "Name darf maximal 30 Zeichen haben" };
  }

  return { team: { ...team, name: trimmed }, error: null };
}

// ---------------------------------------------------------------------------
// Plain object snapshot of a player (no Yjs proxy)
// ---------------------------------------------------------------------------

export type TKickTarget = { id: string; userId: string; name: string };

// ---------------------------------------------------------------------------
// React component — renders only Menu.Items, NO modals.
// Modals are rendered by the parent (Scorebar) to avoid FocusTrap conflicts.
// ---------------------------------------------------------------------------

interface IScorebarModMenuProps {
  team: Team;
  closeMenu: () => void;
  onKickRequest: (target: TKickTarget) => void;
  onResetRequest: () => void;
  onRenameCommit: (newName: string) => void;
  isDuellMode?: boolean;
}

const ScorebarModMenu: React.FC<IScorebarModMenuProps> = ({
  team,
  closeMenu,
  onKickRequest,
  onResetRequest,
  onRenameCommit,
  isDuellMode = false
}) => {
  const { user } = useUser();

  const [renameValue, setRenameValue] = useState<string>(team.name);
  const [renameError, setRenameError] = useState<string | null>(null);
  const [renameOpen, setRenameOpen] = useState<boolean>(false);

  const handleRenameSave = () => {
    const { error, team: result } = applyRename(team, renameValue);
    if (error) {
      setRenameError(error);
      return;
    }
    setRenameOpen(false);
    setRenameError(null);
    closeMenu();
    onRenameCommit(result.name);
  };

  const handleRenameDiscard = () => {
    setRenameValue(team.name);
    setRenameError(null);
    setRenameOpen(false);
  };

  const handleRenameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleRenameSave();
    else if (e.key === "Escape") handleRenameDiscard();
  };

  return (
    <>
      {/* Team umbenennen */}
      {renameOpen ? (
        <Menu.Item component="div">
          <Stack gap="xs">
            <TextInput
              autoFocus
              value={renameValue}
              onChange={(e) => setRenameValue(e.currentTarget.value)}
              onKeyDown={handleRenameKeyDown}
              error={renameError}
              placeholder="Teamname"
              size="xs"
            />
            <Group gap="xs" justify="flex-end">
              <Button size="xs" variant="subtle" onClick={handleRenameDiscard}>
                Abbrechen
              </Button>
              <Button size="xs" onClick={handleRenameSave}>
                Speichern
              </Button>
            </Group>
          </Stack>
        </Menu.Item>
      ) : (
        <Menu.Item
          leftSection={
            <IconSettings style={{ width: rem(14), height: rem(14) }} />
          }
          disabled={isDuellMode}
          onClick={() => {
            if (isDuellMode) return;
            setRenameValue(team.name);
            setRenameError(null);
            setRenameOpen(true);
          }}
        >
          Team umbenennen
        </Menu.Item>
      )}

      {/* Spieler entfernen */}
      <Menu.Item
        component="div"
        leftSection={
          <IconMessageCircle style={{ width: rem(14), height: rem(14) }} />
        }
      >
        <Stack gap="xs">
          <Text size="sm" fw={500}>
            Spieler entfernen
          </Text>
          {team.players.length === 0 ? (
            <Text size="xs" c="dimmed">
              Keine Spieler im Team
            </Text>
          ) : (
            team.players.map((player) => (
              <Group key={player.userId} justify="space-between" wrap="nowrap">
                <Text size="xs" truncate>
                  {player.name}
                </Text>
                {player.userId !== user.id && (
                  <Button
                    size="compact-xs"
                    variant="subtle"
                    color="red"
                    onClick={() => {
                      const snapshot: TKickTarget = {
                        id: player.id,
                        userId: player.userId,
                        name: player.name
                      };
                      closeMenu();
                      onKickRequest(snapshot);
                    }}
                  >
                    Entfernen
                  </Button>
                )}
              </Group>
            ))
          )}
        </Stack>
      </Menu.Item>

      {/* Team zurücksetzen */}
      <Menu.Item
        leftSection={
          <IconRefresh style={{ width: rem(14), height: rem(14) }} />
        }
        color="red"
        onClick={() => {
          closeMenu();
          onResetRequest();
        }}
      >
        Team zurücksetzen
      </Menu.Item>
    </>
  );
};

export { filterArray };
export default ScorebarModMenu;
