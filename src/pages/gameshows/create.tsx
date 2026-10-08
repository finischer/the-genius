import GamesConfigStepper from "~/compositions/gameshows/GamesConfigStepper";
import PageLayout from "~/compositions/layout/PageLayout";
import NextHead from "~/compositions/NextHead";
import { GameConfigProvider } from "~/context/GameConfigProvider";

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
