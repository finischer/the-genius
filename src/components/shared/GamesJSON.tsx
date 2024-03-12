import React from "react";
import type { TGame } from "../room/Game/games/game.types";
import { Box, ScrollArea, Stack, Text } from "@mantine/core";
import useSyncedRoom from "~/hooks/useSyncedRoom";

const GamesJSON = ({ games }: { games: TGame[] }) => {
  const room = useSyncedRoom();

  const GameCard = ({ game }: { game: TGame }) => {
    return (
      <Box
        bg="dark"
        style={{
          borderRadius: "1rem",
        }}
      >
        <pre key={game.identifier}>
          <code>{JSON.stringify({ ...game, rules: undefined }, null, 2)}</code>
        </pre>
      </Box>
    );
  };

  return (
    <ScrollArea
      p="md"
      w={600}
      pos="absolute"
      h="100%"
      right={10}
      // style={{
      //   transform: "scale(0.6)",
      // }}
    >
      <Stack>
        <Text>Raum State:</Text>
        <Box
          bg="dark"
          style={{
            borderRadius: "1rem",
          }}
        >
          <pre>
            <code>{JSON.stringify({ ...room, games: undefined }, null, 2)}</code>
          </pre>
        </Box>
        <Text>Spiele: </Text>
        {games.map((game) => (
          <GameCard
            key={game.identifier}
            game={game}
          />
        ))}
      </Stack>
    </ScrollArea>
  );
};

export default GamesJSON;
