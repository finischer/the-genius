import GamesConfigStepper from "~/components/gameshows/GamesConfigStepper";
import PageLayout from "~/components/layout/PageLayout";
import NextHead from "~/components/shared/NextHead";
import { GameConfigProvider } from "~/context/GameConfigProvider";

export const DEFAULT_GAMESHOW_CONFIG = {
  name: "",
  games: [],
};

const CreateGameshowPage = () => {
  return (
    <>
      <NextHead title="Spielshow erstellen" />
      <PageLayout
        showLoader={false}
        loadingMessage="Spielshows werden geladen ..."
      >
        <GameConfigProvider>
          <GamesConfigStepper />
        </GameConfigProvider>
      </PageLayout>
    </>
  );
};

export default CreateGameshowPage;
