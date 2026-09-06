import { Stack, Text } from "@mantine/core";
import React, { type FC } from "react";
import VisibilityToggle from "~/components/shared/VisibilityToggle";
import type { TZehnSetzenGameState } from "../config";
import type { Team } from "~/types/gameshow.types";

interface TeamModButtonsProps {
  team: Team;
  game: TZehnSetzenGameState;
}

/**
 * Per-team mod control for toggling score visibility inside answer elements.
 * Uses game.display.teamScores (existing Yjs game state) — not componentVisibility —
 * because this is game-specific score display logic, not generic UI visibility.
 */
const TeamModButtons: FC<TeamModButtonsProps> = ({ team, game }) => {
  const displayTeamScores = game.display.teamScores[team.shortName];

  const toggleAnswerScores = () => {
    game.display.teamScores[team.shortName] = !displayTeamScores;
  };

  return (
    <Stack align="center" gap="xs">
      <Text size="sm" fw="bold">
        {team.name}
      </Text>
      <VisibilityToggle
        label="Scores"
        visible={displayTeamScores}
        onToggle={toggleAnswerScores}
      />
    </Stack>
  );
};

export default TeamModButtons;
