import GamesConfigStepper from "~/components/gameshows/GamesConfigStepper";
import PageLayout from "~/components/layout/PageLayout";
import NextHead from "~/components/shared/NextHead";
import { GameConfigProvider } from "~/context/GameConfigProvider";

export const DEFAULT_GAMESHOW_CONFIG = {
  name: "",
  games: [],
};

const CreateGameshowPage = () => {
  // const searchParams = useSearchParams();
  // const { handleZodError } = useNotification();
  // const forceUpdate = useForceUpdate();

  // const gameshowId = searchParams.get("gameshowId");
  // const action: TApiActions = (searchParams.get("action") as TApiActions) ?? "create";

  // // api
  // const { refetch: fetchAvailableGames, isLoading: isLoadingAllAvailableGames } = api.games.getAll.useQuery(
  //   undefined,
  //   { enabled: false, onError: (error) => handleZodError(error.data?.zodError, error.message) }
  // );

  // const { refetch: fetchGameshow, isFetching: isFetchingGameshow } = api.gameshows.getById.useQuery(
  //   { gameshowId: gameshowId ?? "" },
  //   { enabled: !!gameshowId }
  // );

  // const isLoading = isFetchingGameshow || isLoadingAllAvailableGames;

  // const [gameshow, setGameshow] = useImmer<TGameshowConfig>(DEFAULT_GAMESHOW_CONFIG);

  // const [selectedGames, setSelectedGames] = useImmer<Game[]>([]);
  // const selectedGamesReduced: TGameNames[] = selectedGames.map((g) => g.slug as TGameNames);

  // const [continueButtonDisabled, setContinueButtonDisabled] = useState(false);

  // const enableContinueButton = () => {
  //   setContinueButtonDisabled(false);
  // };

  // const disableContinueButton = () => {
  //   setContinueButtonDisabled(true);
  // };

  // function getSelectedGamesFromGameshow(availableGames: Game[], gameshowGames: TGame[]) {
  //   const selectedGames: Game[] = [];

  //   gameshowGames.forEach((game) => {
  //     const selectedGame = availableGames.find((g) => g.slug === game.identifier);
  //     if (selectedGame) {
  //       selectedGames.push(selectedGame);
  //     }
  //   });

  //   return selectedGames;
  // }

  // async function setupGameshowConfig() {
  //   const { data: availableGames } = await fetchAvailableGames();

  //   if (!availableGames) return;

  //   if (gameshowId && action === "update") {
  //     const { data: gameshow } = await fetchGameshow();

  //     if (!gameshow) return;

  //     console.log("Set gameshow: ", gameshow);
  //     setGameshow(gameshow);

  //     const selectedGames = getSelectedGamesFromGameshow(availableGames, gameshow.games as TGame[]);

  //     console.log("Set selected games");
  //     setSelectedGames(selectedGames);
  //   } else {
  //     console.log("Set default config");
  //     setGameshow(DEFAULT_GAMESHOW_CONFIG);
  //   }
  // }

  // useEffect(() => {
  //   void setupGameshowConfig();
  // }, []);

  // useEffect(() => {
  //   // change order of games in gameshow

  //   const newGamesOrder: TGame[] = [];

  //   console.log("Selected Games: ", selectedGamesReduced);
  //   console.log("Gameshow games: ", gameshow.games);
  //   selectedGamesReduced.forEach((gameName) => {
  //     const gameInConfig = gameshow.games.find((game) => game.identifier === gameName);

  //     if (gameInConfig) {
  //       newGamesOrder.push(gameInConfig);
  //     }
  //   });

  //   console.log("New games order: ", newGamesOrder);

  //   setGameshow((draft) => {
  //     draft.games = newGamesOrder;
  //   });
  // }, [selectedGamesReduced]);

  //   return (
  //     <>
  //       <NextHead title="Spielshow erstellen" />
  //       <PageLayout
  //         showLoader={isLoading}
  //         loadingMessage="Spielshows werden geladen ..."
  //       >
  //         <GameConfiguratorProvider
  //           enableFurtherButton={enableContinueButton}
  //           disableFurtherButton={disableContinueButton}
  //           updateGameshow={setGameshow}
  //           gameshow={gameshow}
  //           selectedGames={selectedGamesReduced}
  //         >
  //           <Flex
  //             gap="xl"
  //             direction="column"
  //             justify="space-between"
  //           >
  //             {action === "create" && <Title>Erstelle deine Spielshow</Title>}
  //             {action === "update" && (
  //               <Title>
  //                 Spielshow <i>{gameshow.name}</i> bearbeiten
  //               </Title>
  //             )}

  //             <GamesConfigStepper
  //               gameshow={gameshow}
  //               enableContinueButton={enableContinueButton}
  //               disableContinueButton={disableContinueButton}
  //               continueButtonDisabled={continueButtonDisabled}
  //               selectedGames={selectedGames}
  //               setSelectedGames={setSelectedGames}
  //             />
  //           </Flex>
  //         </GameConfiguratorProvider>
  //       </PageLayout>
  //     </>
  //   );
  // };

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
