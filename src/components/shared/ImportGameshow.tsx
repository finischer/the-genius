import React from "react";
import { GameshowCard } from "./GameshowCard/GameshowCard";
import type { IGameshowCardProps } from "./GameshowCard/gameshowCard.types";
import { Grid, GridCol } from "@mantine/core";

const mockdata: IGameshowCardProps[] = [
  {
    id: 1,
    title: "TheGenius Show #1",
    creator: "TheGenius",
    description: "Enthält 5 Spiele. Der Schwierigkeitsgrad ist mittel.",
    badges: [
      { label: "Merken" },
      { label: "Geheimwörter" },
      { label: "Set" },
      { label: "Flaggen" },
      { label: "Du sagst ..." }
    ]
  },
  {
    id: 2,
    title: "TheGenius Show #1",
    creator: "TheGenius",
    description: "Enthält 5 Spiele. Der Schwierigkeitsgrad ist mittel.",
    badges: [
      { label: "Merken" },
      { label: "Geheimwörter" },
      { label: "Set" },
      { label: "Flaggen" },
      { label: "Du sagst ..." }
    ]
  },
  {
    id: 3,
    title: "TheGenius Show #1",
    creator: "TheGenius",
    description: "Enthält 5 Spiele. Der Schwierigkeitsgrad ist mittel.",
    badges: [
      { label: "Merken" },
      { label: "Geheimwörter" },
      { label: "Set" },
      { label: "Flaggen" },
      { label: "Du sagst ..." }
    ]
  },
  {
    id: 4,
    title: "TheGenius Show #1",
    creator: "TheGenius",
    description: "Enthält 5 Spiele. Der Schwierigkeitsgrad ist mittel.",
    badges: [
      { label: "Merken" },
      { label: "Geheimwörter" },
      { label: "Set" },
      { label: "Flaggen" },
      { label: "Du sagst ..." }
    ]
  },
  {
    id: 5,
    title: "TheGenius Show #1",
    creator: "TheGenius",
    description: "Enthält 5 Spiele. Der Schwierigkeitsgrad ist mittel.",
    badges: [
      { label: "Merken" },
      { label: "Geheimwörter" },
      { label: "Set" },
      { label: "Flaggen" },
      { label: "Du sagst ..." }
    ]
  },
  {
    id: 6,
    title: "TheGenius Show #1",
    creator: "TheGenius",
    description: "Enthält 5 Spiele. Der Schwierigkeitsgrad ist mittel.",
    badges: [
      { label: "Merken" },
      { label: "Geheimwörter" },
      { label: "Set" },
      { label: "Flaggen" },
      { label: "Du sagst ..." }
    ]
  },
  {
    id: 7,
    title: "TheGenius Show #1",
    creator: "TheGenius",
    description: "Enthält 5 Spiele. Der Schwierigkeitsgrad ist mittel.",
    badges: [
      { label: "Merken" },
      { label: "Geheimwörter" },
      { label: "Set" },
      { label: "Flaggen" },
      { label: "Du sagst ..." }
    ]
  }
];

const ImportGameshow = () => {
  const cards = mockdata.map((data) => (
    <GridCol key={data.id} span={{ base: 12, md: 6, lg: 4 }}>
      <GameshowCard {...data} />
    </GridCol>
  ));

  return <Grid gutter="xl">{cards}</Grid>;
};

export default ImportGameshow;
