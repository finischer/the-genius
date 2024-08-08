import { Button, Stack, useMantineTheme } from "@mantine/core";
import { useRouter } from "next/router";
import { useState } from "react";
import GamesConfigStepper from "~/components/gameshows/GamesConfigStepper";
import PageLayout from "~/components/layout/PageLayout";
import ContainerBox from "~/components/shared/ContainerBox";
import ImportGameshow from "~/components/shared/ImportGameshow";
import NextHead from "~/components/shared/NextHead";
import { GameConfigProvider } from "~/context/GameConfigProvider";
import { TApiActions } from "~/server/api/api.types";

enum CreateGameshowViews {
  "SELECT_OPTION",
  "CREATE",
  "IMPORT",
  "EDIT"
}

const CreateGameshowPage = () => {
  const router = useRouter();

  const action = router.query.action as TApiActions;
  const defaultView =
    action === TApiActions.UPDATE
      ? CreateGameshowViews.EDIT
      : CreateGameshowViews.SELECT_OPTION;

  const [view, setView] = useState<CreateGameshowViews>(defaultView);

  const SelectOptionView = () => {
    const theme = useMantineTheme();

    return (
      <ContainerBox h="100%" contentCentered>
        <Stack
          p="xl"
          style={{
            border: "1px dashed",
            borderRadius: theme.radius.sm,
            borderColor: theme.colors.textDimmed[3]
          }}
        >
          <Button
            variant="default"
            onClick={() => setView(CreateGameshowViews.CREATE)}
          >
            Eigene Show erstellen
          </Button>
          <Button
            variant="default"
            onClick={() => setView(CreateGameshowViews.IMPORT)}
          >
            Show importieren
          </Button>
        </Stack>
      </ContainerBox>
    );
  };

  return (
    <>
      <NextHead title="Spielshow erstellen" />

      <PageLayout
        showLoader={false}
        loadingMessage="Spielshows werden geladen ..."
      >
        <GameConfigProvider>
          {view === CreateGameshowViews.SELECT_OPTION && <SelectOptionView />}
          {view === CreateGameshowViews.IMPORT && <ImportGameshow />}
          {(view === CreateGameshowViews.CREATE ||
            view === CreateGameshowViews.EDIT) && <GamesConfigStepper />}
        </GameConfigProvider>
      </PageLayout>
    </>
  );
};

export default CreateGameshowPage;
