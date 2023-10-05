import { Box, Button, Flex, Group, type StepProps, Stepper, TextInput, Title } from "@mantine/core";
import { useDisclosure, useLocalStorage } from "@mantine/hooks";
import { IconQuestionMark } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useImmer } from "use-immer";
import ActionIcon from "~/components/shared/ActionIcon";
import GameRulesModal from "~/components/shared/GameRulesModal";
import GamesPicker from "~/components/shared/GamesPicker";
import { type TTransferListItem } from "~/components/shared/GamesPicker/gamesPicker.types";
import Loader from "~/components/shared/Loader";
import PageLayout from "~/components/layout";
import { ConfiguratorProvider } from "~/hooks/useConfigurator";
import { GAME_STATE_MAP } from "~/hooks/useConfigurator/useConfigurator";
import { type TGameshowConfig } from "~/hooks/useConfigurator/useConfigurator.types";
import useNotification from "~/hooks/useNotification";
import { api } from "~/utils/api";
import type { TGameNames } from "~/components/room/Game/games/game.types";
import { GAME_CONFIGURATORS } from "~/components/gameshows/_game_configurator_map";

const NUM_OF_DEFAULT_STEPS = 2;

type TGameshowConfigKeys = Omit<TGameshowConfig, "games">; // config of gameshow that can be adjust by the user at details screen

const DEFAULT_GAMESHOW_CONFIG = {
  name: "",
  games: [],
};

const CreateGameshowPage = () => {
  const { showErrorNotification } = useNotification();
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [cachedGameshow, setCashedGameshow] = useLocalStorage<TGameshowConfig>({
    key: "cachedGameshow",
    defaultValue: DEFAULT_GAMESHOW_CONFIG,
  });
  const [gameshow, setGameshow] = useImmer<TGameshowConfig>(cachedGameshow);
  const [furtherButtonDisabled, setFurtherButtonDisabled] = useState(false);
  const [openedGameRules, { open: openGameRules, close: closeGameRules }] = useDisclosure();

  const [selectedGames, setSelectedGames] = useState<TTransferListItem[]>([]);

  const activeGame = gameshow.games[activeStep - 1]; // -1 because Game configurators starts at step 1 and not 0

  const {
    mutateAsync: createGameshow,
    isLoading,
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

  const selectedGamesReduced: TGameNames[] = selectedGames.map((g) => g.value);
  const numOfSteps = NUM_OF_DEFAULT_STEPS + selectedGames.length;
  const isLastStep = activeStep === numOfSteps;
  const allowSelectStepProps: StepProps = { allowStepClick: !isLoading, allowStepSelect: !isLoading };

  const STEP_MAP = {
    selectGames: 0,
    detailsGameshow: numOfSteps - 1,
    summary: numOfSteps,
  };

  const nextStep = () => setActiveStep((current) => (current < numOfSteps ? current + 1 : current));
  const prevStep = () => {
    if (activeStep === 0) {
      return router.push("/gameshows");
    }

    setActiveStep((current) => (current > 0 ? current - 1 : current));
  };
  const saveGameshow = async () => {
    // generate rules as string
    const gamesWithRules = gameshow.games.map((g) => ({
      ...g,
      rules: g.getRules(),
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

  const enableFurtherButton = () => {
    setFurtherButtonDisabled(false);
  };

  const disableFurtherButton = () => {
    setFurtherButtonDisabled(true);
  };

  useEffect(() => {
    setCashedGameshow(gameshow); // save to localStorage
  }, [gameshow]);

  // Handle further button state for details gameshow step
  useEffect(() => {
    if (activeStep === STEP_MAP["detailsGameshow"]) {
      if (gameshow.name === "") {
        disableFurtherButton();
      } else {
        enableFurtherButton();
      }
    }
  }, [activeStep, gameshow.name]);

  // Handle further button state for select games step
  useEffect(() => {
    if (activeStep === STEP_MAP["selectGames"]) {
      if (selectedGames.length === 0) {
        disableFurtherButton();
      } else {
        enableFurtherButton();
      }
    }
  }, [activeStep, selectedGames.length]);

  return (
    <PageLayout
      showLoader={isSuccess}
      loadingMessage="Spielshows werden geladen ..."
    >
      {activeGame && (
        <GameRulesModal
          centered
          rules={activeGame.getRules()}
          gameName={activeGame.name}
          onClose={closeGameRules}
          opened={openedGameRules}
        />
      )}
      <ConfiguratorProvider
        enableFurtherButton={enableFurtherButton}
        disableFurtherButton={disableFurtherButton}
        updateGameshowConfig={setGameshow}
        gameshowConfig={gameshow}
        selectedGames={selectedGamesReduced}
      >
        <Flex
          gap="xl"
          direction="column"
        >
          <Title>Erstelle deine Spielshow</Title>
          <Stepper
            active={activeStep}
            onStepClick={setActiveStep}
            breakpoint="sm"
            size="sm"
            allowNextStepsSelect={false}
          >
            <Stepper.Step
              label="Spiele"
              description="Wähle deine Spiele aus"
              {...allowSelectStepProps}
            >
              <GamesPicker setSelectedGames={setSelectedGames} />
            </Stepper.Step>
            {selectedGames.map((g) => {
              const game = GAME_STATE_MAP[g.value];
              const gameRules = game.getRules().trim();

              return (
                <Stepper.Step
                  key={g.value}
                  label={g.label}
                  {...allowSelectStepProps}
                >
                  <Flex
                    align="center"
                    gap="xs"
                  >
                    <Title order={2}>Einstellungen - {g.label}</Title>
                    {gameRules && (
                      <ActionIcon
                        color="dimmed"
                        toolTip="Regeln anzeigen"
                        onClick={openGameRules}
                      >
                        <IconQuestionMark />
                      </ActionIcon>
                    )}
                  </Flex>
                  <Box mt="xl">{GAME_CONFIGURATORS[g.value]}</Box>
                </Stepper.Step>
              );
            })}
            <Stepper.Step
              label="Details Spielshow"
              description=""
              {...allowSelectStepProps}
            >
              <Title order={2}>Details Spielshow</Title>
              <Box mt="xl">
                <TextInput
                  label="Name der Spielshow"
                  withAsterisk
                  onChange={updateGameshowConfig}
                  id="name"
                  value={gameshow.name}
                />
              </Box>
            </Stepper.Step>
            <Stepper.Completed>
              {/* TODO: Add summary component before gameshow will be saved */}
            </Stepper.Completed>
          </Stepper>

          <Group
            position="center"
            mt="xl"
          >
            {isLoading ? (
              <Loader message="Spielshow wird erstellt ..." />
            ) : (
              <>
                <Button
                  variant="default"
                  onClick={() => !isLoading && prevStep()}
                >
                  Zurück
                </Button>
                <Button
                  onClick={() => (isLastStep && !isLoading ? saveGameshow() : nextStep())}
                  loading={isLoading}
                  disabled={furtherButtonDisabled}
                >
                  {isLastStep ? "Spielshow speichern" : "Weiter"}
                </Button>
              </>
            )}
          </Group>
        </Flex>
      </ConfiguratorProvider>
    </PageLayout>
  );
};

export default CreateGameshowPage;
