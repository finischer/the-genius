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

type TGameshowConfigKeys = Omit<TGameshowConfig, "games">; // config of gameshow that can be adjust by the user at details screen

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
  const router = useRouter();
  const searchParams = useSearchParams();

  const gameshowId = searchParams.get("gameshowId");
  const action: TApiActions = (searchParams.get("action") as TApiActions) ?? "create";

  // api
  const { data: availableGames, isLoading: isLoadingAllAvailableGames } = api.games.getAll.useQuery();
  const {
    mutateAsync: createGameshow,
    isLoading: isLoadingCreateGameshow,
    isSuccess,
  } = api.gameshows.create.useMutation({
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors;
      const errorMessagesArray = errorMessage ? Object.values(errorMessage) : [];

      if (errorMessagesArray.length > 0) {
        errorMessagesArray.forEach((messages) => {
          if (messages && messages[0]) {
            showErrorNotification({
              title: "Ein Fehler ist aufgetreten",
              message: messages[0],
            });
          }
        });
      } else {
        showErrorNotification({
          title: "Ein Fehler ist aufgetreten",
          message: e.message ?? "Probiere es später nochmal",
        });
      }
    },
  });

  const { refetch: fetchGameshow, isFetching: isFetchingGameshow } = api.gameshows.getById.useQuery(
    { gameshowId: gameshowId ?? "" },
    { enabled: !!gameshowId }
  );

  const isLoading = isFetchingGameshow || isLoadingCreateGameshow || isLoadingAllAvailableGames;

  // gameshow
  const [cachedGameshow, setCachedGameshow] = useLocalStorage<TGameshowConfig>({
    key: "cachedGameshow",
    defaultValue: DEFAULT_GAMESHOW_CONFIG,
    getInitialValueInEffect: false,
  });

  const [gameshow, setGameshow] = useImmer<TGameshowConfig>(cachedGameshow);
  const [selectedGames, setSelectedGames] = useImmer<Game[]>([]);
  const [continuteButtonDisabled, setContinueButtonDisabled] = useState(false);

  const enableContinueButton = () => {
    setContinueButtonDisabled(false);
  };

  const disableContinueButton = () => {
    setContinueButtonDisabled(true);
  };

  const { showErrorNotification } = useNotification();

  const [activeStep, setActiveStep] = useState(0);
  const [openedGameRules, { open: openGameRules, close: closeGameRules }] = useDisclosure();

  const activeGame = gameshow.games[activeStep - 1]; // -1 because Game configurators starts at step 1 and not 0

  const selectedGamesReduced: TGameNames[] = selectedGames.map((g) => g.slug as TGameNames);

  const saveGameshow = async () => {
    // generate rules as string
    const gamesWithRules = gameshow.games.map((g) => ({
      ...g,
      rules: g.rules,
    }));

    const gameshowWithGameRules: TGameshowConfig = {
      ...gameshow,
      games: gamesWithRules,
    };

    try {
      await createGameshow(gameshowWithGameRules);
      // navigate back to gameshows
      void router.push("/gameshows");
    } catch (err) {}
  };

  const updateGameshowConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key: keyof TGameshowConfigKeys = e.target.id as keyof TGameshowConfigKeys;

    setGameshow((draft) => {
      draft[key] = e.target.value;
    });
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

    console.log("GameshowID: ", gameshowId);
    if (gameshowId) {
      console.log("Fetch gameshow!");
      void handleFetchGameshow();
    } else {
      console.log("Set gameshow to default state!");
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
        {activeGame && (
          <GameRulesModal
            centered
            rules={activeGame.rules}
            gameName={activeGame.name}
            onClose={closeGameRules}
            opened={openedGameRules}
          />
        )}

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
            <Title>Erstelle deine Spielshow</Title>

            <GamesConfigStepper
              enableContinueButton={enableContinueButton}
              disableContinueButton={disableContinueButton}
              continuteButtonDisabled={continuteButtonDisabled}
            />
          </Flex>
        </GameConfiguratorProvider>
      </PageLayout>
    </>
  );
};

export default CreateGameshowPage;
