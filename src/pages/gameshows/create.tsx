import { Button, type ActionIconProps, type StepperStepProps } from "@mantine/core";
import { Text } from "@mantine/core";
import { Box, Center, Flex, Group, Stepper, TextInput, Title } from "@mantine/core";
import { useDisclosure, useLocalStorage } from "@mantine/hooks";
import type { Game } from "@prisma/client";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useImmer, useImmerReducer } from "use-immer";
import { GAME_CONFIGURATORS } from "~/components/gameshows/GameConfig";
import PageLayout from "~/components/layout/PageLayout";
import type { TGame, TGameNames } from "~/components/room/Game/games/game.types";
import ActionIcon from "~/components/shared/ActionIcon";
import GameRulesModal from "~/components/shared/GameRulesModal";
import GamesPicker from "~/components/shared/GamesPicker";
import Loader from "~/components/shared/Loader";
import NextHead from "~/components/shared/NextHead";
import { type TGameshowConfig } from "~/hooks/useGameConfigurator/useGameConfigurator.types";
import useNotification from "~/hooks/useNotification";
import { api } from "~/utils/api";
import type { TApiActions } from "../../server/api/api.types";
import { GameConfiguratorProvider } from "~/hooks/useGameConfigurator/useGameConfigurator";
import GamesConfigStepper from "~/components/gameshows/GamesConfigStepper";
import { LOCAL_STORAGE_KEYS } from "~/config/localStorage";

export const DEFAULT_GAMESHOW_CONFIG = {
  name: "",
  games: [],
};

function getSelectedGamesFromGameshow(availableGames: Game[], gameshowGames: TGame[]) {
  console.log("Available games: ", availableGames);
  console.log("Gameshow games: ", gameshowGames);

  const selectedGames: Game[] = [];

  gameshowGames.forEach((game) => {
    const selectedGame = availableGames.find((g) => g.slug === game.identifier);
    if (selectedGame) {
      selectedGames.push(selectedGame);
    }
  });

  return selectedGames;
}

const CreateGameshowPage = () => {
  const searchParams = useSearchParams();
  const { handleZodError } = useNotification();

  const gameshowId = searchParams.get("gameshowId");
  const action: TApiActions = (searchParams.get("action") as TApiActions) ?? "create";

  // api
  const { refetch: fetchAvailableGames, isLoading: isLoadingAllAvailableGames } = api.games.getAll.useQuery(
    undefined,
    { enabled: false, onError: (error) => handleZodError(error.data?.zodError, error.message) }
  );

  const { refetch: fetchGameshow, isFetching: isFetchingGameshow } = api.gameshows.getById.useQuery(
    { gameshowId: gameshowId ?? "" },
    { enabled: !!gameshowId }
  );

  const isLoading = isFetchingGameshow || isLoadingAllAvailableGames;

  const [gameshow, setGameshow] = useImmer<TGameshowConfig>(DEFAULT_GAMESHOW_CONFIG);

  const [selectedGames, setSelectedGames] = useImmer<Game[]>([]);
  const selectedGamesReduced: TGameNames[] = selectedGames.map((g) => g.slug as TGameNames);

  const [continueButtonDisabled, setContinueButtonDisabled] = useState(false);

  const enableContinueButton = () => {
    setContinueButtonDisabled(false);
  };

  const disableContinueButton = () => {
    setContinueButtonDisabled(true);
  };

  async function handleFetchGameshowAndGames() {
    const { data: availableGames } = await fetchAvailableGames();

    if (!availableGames) return;

    if (gameshowId && action === "update") {
      const { data: gameshow } = await fetchGameshow();

      if (!gameshow) return;

      setGameshow(gameshow);

      const selectedGames = getSelectedGamesFromGameshow(availableGames, gameshow.games);

      setSelectedGames(selectedGames);
    } else {
      setGameshow(DEFAULT_GAMESHOW_CONFIG);
    }
  }

  useEffect(() => {
    handleFetchGameshowAndGames();
  }, []);

  return (
    <>
      <NextHead title="Spielshow erstellen" />
      <PageLayout
        showLoader={isLoading}
        loadingMessage="Spielshows werden geladen ..."
      >
        <GameConfiguratorProvider
          enableFurtherButton={enableContinueButton}
          disableFurtherButton={disableContinueButton}
          updateGameshow={setGameshow}
          gameshow={gameshow}
          selectedGames={selectedGamesReduced}
        >
          <Flex
            gap="xl"
            direction="column"
            justify="space-between"
          >
            {action === "create" && <Title>Erstelle deine Spielshow</Title>}
            {action === "update" && (
              <Title>
                Spielshow <i>{gameshow.name}</i> bearbeiten
              </Title>
            )}

            <GamesConfigStepper
              gameshow={gameshow}
              enableContinueButton={enableContinueButton}
              disableContinueButton={disableContinueButton}
              continueButtonDisabled={continueButtonDisabled}
              selectedGames={selectedGames}
              setSelectedGames={setSelectedGames}
            />
          </Flex>
        </GameConfiguratorProvider>
      </PageLayout>
    </>
  );
};

export default CreateGameshowPage;
