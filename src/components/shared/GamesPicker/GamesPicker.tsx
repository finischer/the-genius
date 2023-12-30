import { Group, Text } from "@mantine/core";
import type { GameshowMode } from "@prisma/client";
import { IconInfoSquareRounded, IconUser, IconUsers } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import ActionIcon from "../ActionIcon";
import Paper from "../Paper";
import classes from "./gamesPicker.module.css";
import { type IGamesPickerProps, type TTransferListData } from "./gamesPicker.types";

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
      <Paper
        variant="light"
        pos="relative"
        onClick={() => console.log("Select game: ", name)}
      >
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
        {isNew && (
          <div className={classes.ribbonWrapper}>
            <div className={classes.ribbon}>Neu</div>
          </div>
        )}
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
