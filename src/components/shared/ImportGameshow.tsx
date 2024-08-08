import { Grid, GridCol } from "@mantine/core";
import type { Game } from "@prisma/client";
import { api } from "~/utils/api";
import PageLayout from "../layout/PageLayout";
import { GameshowCard } from "./GameshowCard/GameshowCard";

// const mockdata: IGameshowCardProps[] = [
//   {
//     id: 1,
//     title: "TheGenius Show #1",
//     creator: "TheGenius",
//     description: "Enthält 5 Spiele. Der Schwierigkeitsgrad ist mittel.",
//     badges: [
//       { label: "Merken" },
//       { label: "Geheimwörter" },
//       { label: "Set" },
//       { label: "Flaggen" },
//       { label: "Du sagst ..." }
//     ]
//   },
//   {
//     id: 2,
//     title: "TheGenius Show #1",
//     creator: "TheGenius",
//     description: "Enthält 5 Spiele. Der Schwierigkeitsgrad ist mittel.",
//     badges: [
//       { label: "Merken" },
//       { label: "Geheimwörter" },
//       { label: "Set" },
//       { label: "Flaggen" },
//       { label: "Du sagst ..." }
//     ]
//   },
//   {
//     id: 3,
//     title: "TheGenius Show #1",
//     creator: "TheGenius",
//     description: "Enthält 5 Spiele. Der Schwierigkeitsgrad ist mittel.",
//     badges: [
//       { label: "Merken" },
//       { label: "Geheimwörter" },
//       { label: "Set" },
//       { label: "Flaggen" },
//       { label: "Du sagst ..." }
//     ]
//   },
//   {
//     id: 4,
//     title: "TheGenius Show #1",
//     creator: "TheGenius",
//     description: "Enthält 5 Spiele. Der Schwierigkeitsgrad ist mittel.",
//     badges: [
//       { label: "Merken" },
//       { label: "Geheimwörter" },
//       { label: "Set" },
//       { label: "Flaggen" },
//       { label: "Du sagst ..." }
//     ]
//   },
//   {
//     id: 5,
//     title: "TheGenius Show #1",
//     creator: "TheGenius",
//     description: "Enthält 5 Spiele. Der Schwierigkeitsgrad ist mittel.",
//     badges: [
//       { label: "Merken" },
//       { label: "Geheimwörter" },
//       { label: "Set" },
//       { label: "Flaggen" },
//       { label: "Du sagst ..." }
//     ]
//   },
//   {
//     id: 6,
//     title: "TheGenius Show #1",
//     creator: "TheGenius",
//     description: "Enthält 5 Spiele. Der Schwierigkeitsgrad ist mittel.",
//     badges: [
//       { label: "Merken" },
//       { label: "Geheimwörter" },
//       { label: "Set" },
//       { label: "Flaggen" },
//       { label: "Du sagst ..." }
//     ]
//   },
//   {
//     id: 7,
//     title: "TheGenius Show #1",
//     creator: "TheGenius",
//     description: "Enthält 5 Spiele. Der Schwierigkeitsgrad ist mittel.",
//     badges: [
//       { label: "Merken" },
//       { label: "Geheimwörter" },
//       { label: "Set" },
//       { label: "Flaggen" },
//       { label: "Du sagst ..." }
//     ]
//   }
// ];

const ImportGameshow = () => {
  const { data: publicGameshows, isLoading } =
    api.gameshows.getPublicGameshows.useQuery();

  const cards = publicGameshows?.map((data) => (
    <GridCol key={data.id} span={{ base: 12, md: 6, lg: 4 }}>
      <GameshowCard
        id={data.id}
        title={data.name}
        creator={data.user.name}
        description={data.description ?? ""}
        games={data.games as Game[]}
        difficulty={data.difficulty}
      />
    </GridCol>
  ));

  return (
    <PageLayout
      showLoader={isLoading}
      loadingMessage="Spielshows werden geladen ..."
    >
      <Grid gutter="xl">{cards}</Grid>
    </PageLayout>
  );
};

export default ImportGameshow;
