import { Group, Stack, Text } from "@mantine/core";
import type { Game } from "@prisma/client";
import { IconInfoSquareRounded, IconUser, IconUsers } from "@tabler/icons-react";
import React from "react";
import { api } from "~/utils/api";
import ActionIcon from "../ActionIcon";
import List from "../List";
import Paper from "../Paper";
import classes from "./gamesPicker.module.css";
import { type IGamesPickerProps } from "./gamesPicker.types";
import GameDetailsModal from "~/components/gameshows/GameDetailsModal";
import { useDisclosure } from "@mantine/hooks";

const GamesPicker: React.FC<IGamesPickerProps> = ({ selectedGames, setSelectedGames }) => {
  const { data: games, isLoading } = api.games.getAll.useQuery();

  const handleSelectGame = (game: Game) => {
    setSelectedGames((draft) => {
      draft.push(game);
    });
  };

  const GameCard = ({ game }: { game: Game }) => {
    const alreadySelected = selectedGames.find((g) => g.id === game.id) ? true : false;
    const [gameRulesOpened, { open: openGameDetails, close: closeGameDetails }] = useDisclosure(false);

    return (
      <>
        <GameDetailsModal
          game={game}
          opened={gameRulesOpened}
          onClose={closeGameDetails}
        />
        <Paper
          variant="light"
          pos="relative"
          disabled={alreadySelected || !game.active}
          onClick={() => {
            if (alreadySelected || !game.active) return;
            handleSelectGame(game);
          }}
          opacity={alreadySelected || !game.active ? 0.3 : 1}
        >
          <Group>
            {game.mode === "DUELL" && <IconUser />}
            {game.mode === "TEAM" && <IconUsers />}
            <Text>{game.name}</Text>
            <ActionIcon
              variant="default"
              toolTip="Details anzeigen"
              onClick={openGameDetails}
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
      </>
    );
  };

  return (
    <Stack gap="xl">
      <Paper display="inline-block">
        {!games && (
          <Text>{isLoading ? "Spiele werden geladen ..." : "Aktuell sind keine Spieler verfügbar"}</Text>
        )}

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

      <List
        data={selectedGames}
        setData={setSelectedGames}
        itemName="Spiel"
        renderValueByKey="name"
        editable
        deletableItems
        emptyListText="Füge dein erstes Spiel hinzu"
        showIndex
      />
    </Stack>
  );
};

export default GamesPicker;
