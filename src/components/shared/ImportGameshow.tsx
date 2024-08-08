import { Grid, GridCol } from "@mantine/core";
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
  const { data: userGameshows } = api.gameshows.getAllByCreatorId.useQuery();

  const cards = publicGameshows?.map((gameshow) => (
    <GridCol key={gameshow.id} span={{ base: 12, md: 6, lg: 6 }}>
      <GameshowCard
        id={gameshow.id}
        gameshow={gameshow}
        alreadyImported={
          userGameshows?.some((gs) => gs.originalGameshowId === gameshow.id) ??
          false
        }
      />
    </GridCol>
  ));

  if (isLoading)
    return (
      <PageLayout
        showLoader={isLoading}
        loadingMessage="Spielshows werden geladen ..."
      />
    );

  return <Grid gutter="xl">{cards}</Grid>;
};

export default ImportGameshow;
