import { Grid, GridCol } from "@mantine/core";
import { api } from "~/utils/api";
import PageLayout from "../layout/PageLayout";
import { GameshowCard } from "./GameshowCard/GameshowCard";
import useNotification from "~/hooks/useNotification";
import { useEffect } from "react";

const ImportGameshow = () => {
  const { showErrorNotification } = useNotification();

  const publicGameshowsFetcher = api.gameshows.getPublicGameshows.useQuery();
  const userGameshowsFetcher = api.gameshows.getAllByCreatorId.useQuery();

  const cards = publicGameshowsFetcher.data?.map((gameshow) => (
    <GridCol key={gameshow.id} span={{ base: 12, md: 6, lg: 6 }}>
      <GameshowCard
        id={gameshow.id}
        gameshow={gameshow}
        alreadyImported={
          userGameshowsFetcher.data?.some(
            (gs) => gs.originalGameshowId === gameshow.id
          ) ?? false
        }
      />
    </GridCol>
  ));

  useEffect(() => {
    if (publicGameshowsFetcher.isError || userGameshowsFetcher.isError) {
      showErrorNotification({
        title: "Fehler beim Laden der Spielshows",
        message:
          "Es ist ein Fehler beim Laden der Spielshows aufgetreten. Bitte versuche es später erneut."
      });
    }
  }, [publicGameshowsFetcher.isError, userGameshowsFetcher.isError]);

  if (publicGameshowsFetcher.isLoading || userGameshowsFetcher.isLoading)
    return (
      <PageLayout showLoader loadingMessage="Spielshows werden geladen ..." />
    );

  return <Grid gutter="xl">{cards}</Grid>;
};

export default ImportGameshow;
