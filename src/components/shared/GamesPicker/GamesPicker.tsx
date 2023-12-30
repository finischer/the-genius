import { Group, Text } from "@mantine/core";
import type { Game } from "@prisma/client";
import { IconInfoSquareRounded, IconUser, IconUsers } from "@tabler/icons-react";
import React from "react";
import { api } from "~/utils/api";
import ActionIcon from "../ActionIcon";
import Paper from "../Paper";
import classes from "./gamesPicker.module.css";
import { type IGamesPickerProps, type TTransferListData } from "./gamesPicker.types";

const GamesPicker: React.FC<IGamesPickerProps> = ({ setSelectedGames }) => {
  const { data: games } = api.games.getAll.useQuery();

  // useEffect(() => {
  //   setSelectedGames(games[1]);
  // }, [games]);

  const GameCard = ({ game }: { game: Game }) => {
    return (
      <Paper
        variant="light"
        pos="relative"
        onClick={() => console.log("Select game: ", game.name)}
      >
        <Group>
          {game.mode === "DUELL" && <IconUser />}
          {game.mode === "TEAM" && <IconUsers />}
          <Text>{game.name}</Text>
          <ActionIcon
            variant="default"
            toolTip="Details anzeigen"
          >
            <IconInfoSquareRounded />
          </ActionIcon>
        </Group>

        {/* New Banner */}
        {game.isNew && (
          <div className={classes.ribbonWrapper}>
            <div className={classes.ribbon}>Neu</div>
          </div>
        )}
      </Paper>
    );
  };

  return (
    <Paper display="inline-block">
      {!games && <Text>Aktuell sind keine Spieler verfügbar</Text>}

      {games && (
        <Group>
          {games.map((game) => (
            <GameCard
              key={game.id}
              game={game}
            />
          ))}
        </Group>
      )}
    </Paper>
  );
};

export default GamesPicker;
