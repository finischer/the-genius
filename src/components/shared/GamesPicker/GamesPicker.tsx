import { Box, Flex, Group, Paper } from "@mantine/core";
import React, { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { type TTransferListData, type IGamesPickerProps } from "./gamesPicker.types";
import List from "../List";
import { Text } from "@mantine/core";
import Card from "../Card/Card";
import {
  IconInfoCircle,
  IconInfoSmall,
  IconInfoSquareRounded,
  IconUser,
  IconUsers,
} from "@tabler/icons-react";
import ActionIcon from "../ActionIcon";
import type { GameshowMode } from "@prisma/client";

const availableGames: TTransferListData = [
  [
    { value: "flaggen", label: "Flaggen" },
    { value: "merken", label: "Merken" },
    { value: "geheimwoerter", label: "Geheimwörter" },
    { value: "set", label: "Set" },
    { value: "duSagst", label: "Du sagst ..." },
    // { value: "referatBingo", label: "Referat-Bingo" },
    // { value: 'zehnSetzen', label: 'Zehn setzen' },
    // { value: 'fragenhagel', label: 'Fragenhagel' },
    // { value: 'buchstabensalat', label: 'Buchstabensalat' },
  ],
  [],
];

const GamesPicker: React.FC<IGamesPickerProps> = ({ setSelectedGames }) => {
  // const [games, setGames] = useState(availableGames[0].map((g) => ({ ...g, id: g.value })));
  const [games, setGames] = useState<TTransferListData>(availableGames);

  useEffect(() => {
    setSelectedGames(games[1]);
  }, [games]);

  const GameCard = ({ name, mode, isNew = false }: { name: string; mode: GameshowMode; isNew?: boolean }) => {
    return (
      <Paper bg="dark.7">
        <Group>
          {mode === "DUELL" && <IconUser />}
          {mode === "TEAM" && <IconUsers />}
          <Text>{name}</Text>
          <ActionIcon
            variant="default"
            toolTip="Details anzeigen"
          >
            <IconInfoSquareRounded />
          </ActionIcon>
        </Group>

        {/* New Banner */}
        <Box
          pos="absolute"
          top={0}
          right={0}
        >
          <Text>Neu</Text>
        </Box>
      </Paper>
    );
  };

  return (
    <Paper display="inline-block">
      <Group>
        <GameCard
          name="Merken"
          mode="DUELL"
        />
        <GameCard
          name="Referatbingo"
          mode="DUELL"
        />
        <GameCard
          name="Geheimwörter"
          mode="DUELL"
        />
        <GameCard
          name="Du sagst ..."
          mode="TEAM"
        />
        <GameCard
          name="Flaggen"
          mode="DUELL"
        />
        <GameCard
          name="Set"
          mode="DUELL"
        />
      </Group>
    </Paper>
  );
};

export default GamesPicker;
