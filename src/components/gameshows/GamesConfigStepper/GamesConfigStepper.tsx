import type { StepperStepProps } from "@mantine/core";
import { Box, Center, Flex, Stepper, TextInput, Title } from "@mantine/core";
import type { Game } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { createContext, useEffect, useState } from "react";
import { useImmer } from "use-immer";
import { Game, type TGame } from "~/components/room/Game/games/game.types";
import GamesPicker from "~/components/shared/GamesPicker";
import { useGameshowConfig } from "~/hooks/useGameshowConfig/useGameshowConfig";
import type { TGameshowConfig } from "~/hooks/useGameshowConfig/useGameshowConfig.types";
import useNotification from "~/hooks/useNotification";
import { TApiActions } from "~/server/api/api.types";
import { api } from "~/utils/api";
import GameConfig from "../GameConfig";
import StepperButtons from "./components/StepperButtons";
import { StepperControlsContext } from "~/context/StepperControlsContext";

const NUM_OF_DEFAULT_STEPS = 2;

const getAlreadySelectedGames = (games: TGame[], availableGames: Game[]) => {
  const alreadySelected: Game[] = [];

  games.forEach((g) => {
    const game = availableGames.find((availableGame) => availableGame.slug === g.identifier);

    if (game) {
      alreadySelected.push(game);
    }
  });

  return alreadySelected;
};

const GamesConfigStepper = () => {
  const { gameshow, updateGameshowMetadata, updateGameList, availableGames } = useGameshowConfig(
    Game.DUSAGST
  );
  const [selectedGames, setSelectedGames] = useImmer<Game[]>(
    getAlreadySelectedGames(gameshow.games, availableGames)
  );

  const [initSelectedGamesDone, setInitSelectedGamesDone] = useState(false);

  const { handleZodError } = useNotification();
  const router = useRouter();
  const searchParams = useSearchParams();

  const action: TApiActions = (searchParams.get("action") as TApiActions) ?? TApiActions.CREATE;
  const gameshowId = searchParams.get("gameshowId");

  const [activeStep, setActiveStep] = useState(0);

  const [stepperButtons, setStepperButons] = useImmer({
    leftBtnDisabled: true,
    rightBtnDisabled: true,
  });

  // api create gameshow
  const createGameshowApi = api.gameshows.create.useMutation({
    onError: (error) => handleZodError(error.data?.zodError, error.message ?? "Ein Fehler ist aufgetreten"),
  });

  // // api update gameshow
  const updateGameshowApi = api.gameshows.update.useMutation({
    onError: (error) => handleZodError(error.data?.zodError, error.message ?? "Ein Fehler ist aufgetreten"),
  });

  const isLoading = createGameshowApi.isLoading || updateGameshowApi.isLoading;

  const allowSelectStepProps: StepperStepProps = {
    allowStepClick: false,
    allowStepSelect: false,
  };

  const numOfSteps = NUM_OF_DEFAULT_STEPS + selectedGames.length;
  const isLastStep = activeStep === numOfSteps;

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

  const enableContinueButton = () => {
    setStepperButons((draft) => {
      draft.rightBtnDisabled = false;
    });
  };

  const disableContinueButton = () => {
    setStepperButons((draft) => {
      draft.rightBtnDisabled = true;
    });
  };

  const handleSaveGameshow = async () => {
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
      if (action === TApiActions.CREATE) {
        await createGameshowApi.mutateAsync(gameshowWithGameRules);
      } else if (action === TApiActions.UPDATE && gameshowId) {
        await updateGameshowApi.mutateAsync({
          gameshowId,
          updatedGameshow: gameshow,
        });
      } else {
        return;
      }

      // navigate back to gameshows
      void router.push("/gameshows");
    } catch (err) {}
  };

  useEffect(() => {
    if (gameshow.games.length > 0 && availableGames && !initSelectedGamesDone) {
      setSelectedGames(getAlreadySelectedGames(gameshow.games, availableGames));
      setInitSelectedGamesDone(true);
    }
  }, [gameshow, availableGames]);

  // Handle further button state for details gameshow step
  useEffect(() => {
    if (activeStep === STEP_MAP["detailsGameshow"]) {
      if (gameshow.name === "") {
        disableContinueButton();
      } else {
        enableContinueButton();
      }
    }
  }, [activeStep, gameshow.name]);

  // Handle further button state for select games step
  useEffect(() => {
    if (activeStep === STEP_MAP["selectGames"]) {
      if (selectedGames.length === 0) {
        disableContinueButton();
      } else {
        enableContinueButton();
      }
    }
  }, [activeStep, selectedGames.length]);

  useEffect(() => {
    updateGameList(selectedGames);
  }, [selectedGames]);

  return (
    <StepperControlsContext.Provider value={{ enableContinueButton, disableContinueButton }}>
      <Box
        pos="relative"
        h="100%"
      >
        <Stepper
          active={activeStep}
          onStepClick={setActiveStep}
          // hiddenFrom="sm"
          // size="sm"
          allowNextStepsSelect={false}
        >
          <Stepper.Step
            label="Spiele"
            description="Wähle deine Spiele aus"
            {...allowSelectStepProps}
          >
            <Center>
              <GamesPicker
                selectedGames={selectedGames}
                setSelectedGames={setSelectedGames}
              />
            </Center>
          </Stepper.Step>
          {selectedGames.map((game) => {
            return (
              <Stepper.Step
                key={game.id}
                label={game.name}
                {...allowSelectStepProps}
              >
                <Flex
                  align="center"
                  gap="xs"
                >
                  <Title order={2}>Einstellungen - {game.name}</Title>
                </Flex>
                <Box mt="xl">
                  <GameConfig gameSlug={game.slug} />
                </Box>
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
                onChange={(e) =>
                  updateGameshowMetadata((draft) => {
                    draft.name = e.target.value;
                  })
                }
                id="name"
                value={gameshow.name}
              />
            </Box>
          </Stepper.Step>
          <Stepper.Completed>
            <></>
            {/* TODO: Add summary component before gameshow will be saved */}
          </Stepper.Completed>
        </Stepper>

        <StepperButtons
          onClickRightButton={nextStep}
          onClickLeftButton={prevStep}
          onSaveClick={handleSaveGameshow}
          rightButtonProps={{
            disabled: stepperButtons.rightBtnDisabled,
          }}
          isLastStep={isLastStep}
          disabledButtons={isLoading}
        />
      </Box>
    </StepperControlsContext.Provider>
  );
};

export default GamesConfigStepper;
