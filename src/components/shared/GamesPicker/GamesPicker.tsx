import { Button, Group, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import type { Game } from "@prisma/client";
import { IconInfoSquareRounded, IconUser, IconUsers } from "@tabler/icons-react";
import React from "react";
import GameDetailsModal from "~/components/gameshows/GameDetailsModal";
import { GAME_STATE_MAP } from "~/components/room/Game/games/game.constants";
import type { Games } from "~/components/room/Game/games/game.types";
import { api } from "~/utils/api";
import List from "../List";
import Paper from "../Paper";
import Tooltip from "../Tooltip";
import classes from "./gamesPicker.module.css";
import { type IGamesPickerProps } from "./gamesPicker.types";

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

    const defaultGameState = GAME_STATE_MAP[game.slug as Games];

    return (
      <>
        <GameDetailsModal
          game={defaultGameState}
          opened={gameRulesOpened}
          onClose={closeGameDetails}
        />

        <Button.Group>
          <Button
            variant="default"
            onClick={() => {
              if (alreadySelected || !game.active) return;
              handleSelectGame(game);
            }}
            disabled={alreadySelected || !game.active}
            opacity={alreadySelected || !game.active ? 0.3 : 1}
          >
            <Group
              gap="md"
              ml={game.isNew ? "md" : undefined}
            >
              {game.mode === "DUELL" && <IconUser />}
              {game.mode === "TEAM" && <IconUsers />}
              <Text>{game.name}</Text>
            </Group>

            {game.isNew && (
              <div className={classes.ribbonWrapper}>
                <div className={classes.ribbon}>Neu</div>
              </div>
            )}
          </Button>

          <Tooltip label="Details anzeigen">
            <Button
              variant="default"
              onClick={openGameDetails}
            >
              <IconInfoSquareRounded />
            </Button>
          </Tooltip>
        </Button.Group>
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
