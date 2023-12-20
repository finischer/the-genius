import { Flex, TransferList, type TransferListData } from "@mantine/core";
import React, { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { type TTransferListData, type IGamesPickerProps } from "./gamesPicker.types";
import List from "../List";

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

  return (
    // <Flex gap="xl">
    //   <List
    //     data={games}
    //     setData={setGames}
    //     renderValueByKey="label"
    //   />
    //   <List
    //     data={games}
    //     setData={setGames}
    //     renderValueByKey="label"
    //     editable
    //   />
    // </Flex>
    <TransferList
      value={games}
      onChange={setGames as Dispatch<SetStateAction<TransferListData>>}
      searchPlaceholder="Suchen ..."
      nothingFound="Kein Spiel gefunden"
      titles={[`Verfügbare Spiele (${games[0].length})`, `Ausgewählte Spiele (${games[1].length})`]}
      breakpoint="sm"
      listHeight={400}
    />
  );
};

export default GamesPicker;
