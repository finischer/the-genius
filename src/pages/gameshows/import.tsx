import { Grid, GridCol } from "@mantine/core";
import { useEffect } from "react";
import PageLayout from "~/components/layout/PageLayout";
import { GameshowCard } from "~/components/shared/GameshowCard/GameshowCard";
import useNotification from "~/hooks/useNotification";
import { api } from "~/utils/api";

const ImportGameshowPage = () => {
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

  return (
    <PageLayout
      showLoader={
        publicGameshowsFetcher.isLoading || userGameshowsFetcher.isLoading
      }
      loadingMessage="Spielshows werden geladen ..."
    >
      <Grid gutter="xl">{cards}</Grid>
    </PageLayout>
  );
};

export default ImportGameshowPage;
