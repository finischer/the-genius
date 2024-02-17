import type { StepperStepProps } from "@mantine/core";
import { Loader } from "@mantine/core";
import { Box, Group, TextInput } from "@mantine/core";
import { ActionIcon } from "@mantine/core";
import { Button } from "@mantine/core";
import { Center, Flex, Stepper, Title } from "@mantine/core";
import type { Game } from "@prisma/client";
import { IconChevronRight } from "@tabler/icons-react";
import { IconChevronLeft } from "@tabler/icons-react";
import React, { useState, type FC, useEffect } from "react";
import { useImmer } from "use-immer";
import GamesPicker from "~/components/shared/GamesPicker";
import StepperButtons from "./components/StepperButtons";
import { useRouter } from "next/router";
import GameConfig from "../GameConfig";
import type { TGameNames } from "~/components/room/Game/games/game.types";

interface IGamesConfigStepperProps {
  disableContinueButton: () => void;
  enableContinueButton: () => void;
  continuteButtonDisabled: boolean;
}

const NUM_OF_DEFAULT_STEPS = 2;

const GamesConfigStepper: FC<IGamesConfigStepperProps> = ({
  enableContinueButton,
  disableContinueButton,
  continuteButtonDisabled,
}) => {
  const router = useRouter();

  const [activeStep, setActiveStep] = useState(0);

  const [selectedGames, setSelectedGames] = useImmer<Game[]>([]);

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

  // Handle further button state for details gameshow step
  //   useEffect(() => {
  //     if (activeStep === STEP_MAP["detailsGameshow"]) {
  //       if (gameshow.name === "") {
  //         disableFurtherButton();
  //       } else {
  //         enableFurtherButton();
  //       }
  //     }
  //   }, [activeStep, gameshow.name]);

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

  return (
    <>
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
          // const tmpGame = GAME_STATE_MAP[game.slug];
          // const gameRules = tmpGame.getRules().trim();

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
                {/* {gameRules && (
          <ActionIcon
          color="dimmed"
          toolTip="Regeln anzeigen"
          onClick={openGameRules}
          >
          <IconQuestionMark />
          </ActionIcon>
        )} */}
              </Flex>
              <Box mt="xl">
                <GameConfig gameSlug={game.slug as TGameNames} />
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
            {/* <TextInput
        label="Name der Spielshow"
        withAsterisk
        onChange={updateGameshowConfig}
        id="name"
        value={gameshow.name}
        /> */}
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
        rightButtonProps={{
          disabled: continuteButtonDisabled,
        }}
        isLastStep={isLastStep}
      />
    </>
  );
};

export default GamesConfigStepper;
