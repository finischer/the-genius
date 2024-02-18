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

export const DEFAULT_GAMESHOW_CONFIG = {
  name: "",
  games: [],
};

// const CreateGameshowPage = () => {
//   +++ api calls +++
//   1. get all available games from database
//   2. when a gameshowID is in search params -> fetch this gameshow from database

//   variables
//   const [availableGames, setAvailableGames] = useState([])
//   const [gameshow, setGameshow] = useState(undefined)

//   +++ type structure +++
//   type GameNames;
//   type GameConfigurations = {
//    [GameNames as Key]: GameConfiguration of specific game
//   }

//   +++ components structure +++
//   <GameConfigProvider>

//   return (
//     <GameConfiguratorProvider
//       gameshow={gameshow}
//       setGameshow={setGameshow}
//     >
//       <GamesPicker />

//       <GamesConfigStepper />
//     </GameConfiguratorProvider>
//   );
// };

const CreateGameshowPage = () => {
  const searchParams = useSearchParams();

  const gameshowId = searchParams.get("gameshowId");
  const action: TApiActions = (searchParams.get("action") as TApiActions) ?? "create";

  // api
  const { data: availableGames, isLoading: isLoadingAllAvailableGames } = api.games.getAll.useQuery();
  const { refetch: fetchGameshow, isFetching: isFetchingGameshow } = api.gameshows.getById.useQuery(
    { gameshowId: gameshowId ?? "" },
    { enabled: !!gameshowId }
  );

  const isLoading = isFetchingGameshow || isLoadingAllAvailableGames;

  // gameshow
  const [cachedGameshow, setCachedGameshow] = useLocalStorage<TGameshowConfig>({
    key: "cachedGameshow",
    defaultValue: DEFAULT_GAMESHOW_CONFIG,
    getInitialValueInEffect: false,
  });

  const [gameshow, setGameshow] = useImmer<TGameshowConfig>(cachedGameshow);

  const [selectedGames, setSelectedGames] = useImmer<Game[]>([]);
  const selectedGamesReduced: TGameNames[] = selectedGames.map((g) => g.slug as TGameNames);

  const [continuteButtonDisabled, setContinueButtonDisabled] = useState(false);

  const enableContinueButton = () => {
    setContinueButtonDisabled(false);
  };

  const disableContinueButton = () => {
    setContinueButtonDisabled(true);
  };

  useEffect(() => {
    const handleFetchGameshow = async () => {
      const { data: gameshow } = await fetchGameshow();

      if (!gameshow) return;

      const gameshowConfig: TGameshowConfig = {
        name: gameshow.name,
        games: gameshow.games as unknown as TGame[],
      };

      // load to cache
      setCachedGameshow(gameshowConfig);

      // save to local state
      setGameshow(gameshowConfig);

      // get all games from fetched gameshow
      const selectedGames =
        availableGames?.map((game) => {
          if (gameshowConfig.games.find((g) => g.identifier === game.slug)) {
            return game;
          }
        }) ?? [];

      const selectedGamesFiltered = selectedGames.filter((game): game is Game => game !== undefined);

      setSelectedGames(selectedGamesFiltered);
    };

    if (gameshowId) {
      void handleFetchGameshow();
    } else {
      // set default state
      setGameshow(DEFAULT_GAMESHOW_CONFIG);
    }
  }, [isLoadingAllAvailableGames]);

  useEffect(() => {
    setCachedGameshow(gameshow); // save to localStorage
  }, [gameshow]);

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
              continuteButtonDisabled={continuteButtonDisabled}
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
