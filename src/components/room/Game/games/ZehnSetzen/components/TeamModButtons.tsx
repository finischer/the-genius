import React, { type FC } from "react";
import type { TZehnSetzenGameState } from "../config";
import type { Team } from "~/types/gameshow.types";
import { Button, ButtonGroup, Stack, Text } from "@mantine/core";

interface TeamModButtonsProps {
  team: Team;
  game: TZehnSetzenGameState;
}

const TeamModButtons: FC<TeamModButtonsProps> = ({ team, game }) => {
  const toggleAnswerScores = () => {
    game.display.teamScores[team.shortName] =
      !game.display.teamScores[team.shortName];
  };

  const displayTeamScores = game.display.teamScores[team.shortName];

  return (
    <Stack px="md" w={250} align="center">
      <Text fw="bold">{team.name}</Text>
      <ButtonGroup>
        <Button variant="default" onClick={toggleAnswerScores}>
          Scores {displayTeamScores ? "ausblenden" : "anzeigen"}
        </Button>
      </ButtonGroup>
    </Stack>
  );
};

export default TeamModButtons;
