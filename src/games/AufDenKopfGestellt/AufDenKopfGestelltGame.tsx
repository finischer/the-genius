import { Box, Flex } from "@mantine/core";
import {
  IconPlayerPause,
  IconPlayerPlay,
  IconPlayerSkipForward,
  IconRotate
} from "@tabler/icons-react";
import React, { useEffect, useRef, useState } from "react";
import ActionIcon from "~/components/ActionIcon";
import RevealButton from "~/components/RevealButton";
import GameNavControls from "~/compositions/GameNavControls";
import ModControlBar from "~/compositions/ModControlBar";
import useAudio from "~/hooks/useAudio";
import useSyncedRoom from "~/hooks/useSyncedRoom";
import { useUser } from "~/hooks/useUser";
import { COUNTRIES } from "./aufDenKopfGestellt.data";
import type {
  IAufDenKopfGestelltGameProps,
  TDrawAnimState
} from "./aufDenKopfGestellt.types";
import { CountrySvg } from "./components/CountrySvg";
import classes from "./AufDenKopfGestelltGame.module.css";

// Must match the CSS transition duration in CountrySvg.module.css
const ROTATION_DURATION_MS = 1500;
const RESOLVE_DURATION_S = 5;

function toDrawAnimState(state: string, isDone: boolean): TDrawAnimState {
  if (isDone) return "done";
  if (state === "running") return "running";
  if (state === "paused") return "paused";
  return "idle";
}

const AufDenKopfGestelltGame: React.FC<IAufDenKopfGestelltGameProps> = ({
  game
}) => {
  const room = useSyncedRoom();
  const { hostFunction } = useUser();
  const { triggerAudioEvent } = useAudio();
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);

  const currentMeta = game.selectedCountries[game.indexOfCountry];
  const currentCountry = COUNTRIES.find(
    (c) => c.shortName === currentMeta?.shortName
  );

  // Measure once the SVG is mounted (showCountry = true) or country changes
  useEffect(() => {
    if (!game.showCountry) return;
    setPathLength(0);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (pathRef.current) {
          setPathLength(pathRef.current.getTotalLength());
        }
      });
    });
  }, [game.indexOfCountry, game.showCountry, game.animKey]);

  // Auto-pause when any buzzer fires
  const t1Pressed = room.teams.teamOne.buzzer.isPressed;
  const t2Pressed = room.teams.teamTwo.buzzer.isPressed;
  useEffect(() => {
    if ((t1Pressed || t2Pressed) && game.animation.state === "running") {
      game.animation.state = "paused";
    }
  }, [t1Pressed, t2Pressed]);

  // When animation finishes: rotate → fill → (if resolving) reveal answer
  useEffect(() => {
    if (!game.animation.isDone || !game.showCountry) return;

    game.rotateCountry = true;

    const timer = setTimeout(() => {
      game.fillCountry = true;

      if (game.resolving && currentCountry) {
        triggerAudioEvent("playSound", "bell");
        game.showAnswer = true;
        game.answer = currentCountry.name;
        room.context.answerState.answer = currentCountry.name;
        room.context.answerState.isAnswerDisplayed = true;
      }
    }, ROTATION_DURATION_MS + 100);

    return () => clearTimeout(timer);
  }, [game.animation.isDone]);

  const resetCountryState = () => {
    game.showCountry = false;
    game.showAnswer = false;
    game.answer = "";
    game.rotateCountry = false;
    game.fillCountry = false;
    game.resolving = false;
    game.animKey = 0;
    game.resolveFromDashoffset = 0;
    game.animation = { isDone: false, state: "" };
    room.context.answerState.answer = "";
    room.context.answerState.isAnswerDisplayed = false;
  };

  const handleStart = hostFunction(() => {
    game.showCountry = true;
    game.animation = { isDone: false, state: "running" };
  });

  const handleToggleAnimation = hostFunction(() => {
    game.animation.state =
      game.animation.state === "running" ? "paused" : "running";
  });

  const handleRotate = hostFunction(() => {
    game.rotateCountry = true;
  });

  const handleRevealAnswer = hostFunction(() => {
    if (!currentCountry) return;
    triggerAudioEvent("playSound", "bell");
    game.showAnswer = true;
    game.answer = currentCountry.name;
    room.context.answerState.answer = currentCountry.name;
    room.context.answerState.isAnswerDisplayed = true;
  });

  // Restart animation at fast speed → auto-rotate → auto-fill → auto-reveal
  const handleResolve = hostFunction(() => {
    // Read the current stroke-dashoffset from the paused animation so the
    // fast-forward animation continues from exactly that point.
    const currentOffset = pathRef.current
      ? parseFloat(getComputedStyle(pathRef.current).strokeDashoffset)
      : 0;
    game.resolveFromDashoffset = isNaN(currentOffset) ? 0 : currentOffset;
    game.resolving = true;
    game.animation = { isDone: false, state: "running" };
    game.rotateCountry = false;
    game.fillCountry = false;
    // Increment animKey so all clients remount the path with the new keyframe
    game.animKey += 1;
  });

  const handlePrev = hostFunction(() => {
    const prevIndex =
      (game.indexOfCountry - 1 + game.selectedCountries.length) %
      game.selectedCountries.length;
    resetCountryState();
    game.indexOfCountry = prevIndex;
  });

  const handleNext = hostFunction(() => {
    const nextIndex = (game.indexOfCountry + 1) % game.selectedCountries.length;
    resetCountryState();
    game.indexOfCountry = nextIndex;
  });

  if (!currentCountry) return null;

  const drawAnimState = toDrawAnimState(
    game.animation.state,
    game.animation.isDone
  );
  const buzzerActive = t1Pressed || t2Pressed;
  const showResolveButton =
    game.showCountry &&
    game.animation.state === "paused" &&
    !game.animation.isDone &&
    buzzerActive;

  return (
    <Flex direction="column" gap="md" align="center">
      {game.showCountry && (
        <Box className={classes.svgWrapper}>
          <CountrySvg
            country={currentCountry}
            isRotated={game.rotateCountry}
            animState={drawAnimState}
            pathLength={pathLength}
            durationSeconds={
              game.resolving
                ? RESOLVE_DURATION_S
                : (currentMeta?.durationSeconds ?? 15)
            }
            animKey={game.animKey}
            showFill={game.fillCountry}
            resolveFromDashoffset={
              game.resolving ? game.resolveFromDashoffset : undefined
            }
            pathRef={pathRef}
            onAnimationEnd={() => {
              game.animation.isDone = true;
            }}
            svgClassName={classes.countrySvg}
          />
        </Box>
      )}

      <ModControlBar>
        {/* Start */}
        {!game.showCountry && (
          <ActionIcon
            toolTip="Land starten"
            size="xl"
            variant="filled"
            color="green"
            onClick={handleStart}
          >
            <IconPlayerPlay />
          </ActionIcon>
        )}

        {/* Play / Pause */}
        {game.showCountry && !game.animation.isDone && (
          <ActionIcon
            toolTip={
              game.animation.state === "running"
                ? "Animation pausieren"
                : "Animation fortfahren"
            }
            size="xl"
            variant="filled"
            color={game.animation.state === "running" ? "yellow" : "green"}
            onClick={handleToggleAnimation}
          >
            {game.animation.state === "running" ? (
              <IconPlayerPause />
            ) : (
              <IconPlayerPlay />
            )}
          </ActionIcon>
        )}

        {/* Auflösen – visible when buzzed + paused */}
        {showResolveButton && (
          <ActionIcon
            toolTip="Auflösen – Land fertig zeichnen und Antwort einblenden"
            size="xl"
            variant="filled"
            color="orange"
            onClick={handleResolve}
          >
            <IconPlayerSkipForward />
          </ActionIcon>
        )}

        {/* Manual rotate – before auto-rotate kicks in */}
        {game.showCountry && !game.rotateCountry && !game.animation.isDone && (
          <ActionIcon
            toolTip="Land drehen"
            size="xl"
            variant="filled"
            color="blue"
            onClick={handleRotate}
          >
            <IconRotate />
          </ActionIcon>
        )}

        {/* Reveal answer manually */}
        {game.showCountry && (
          <RevealButton
            onReveal={handleRevealAnswer}
            revealed={game.showAnswer}
            label="Antwort"
            size="md"
          />
        )}
      </ModControlBar>

      <GameNavControls
        currentIndex={game.indexOfCountry}
        total={game.selectedCountries.length}
        onPrev={handlePrev}
        onNext={handleNext}
        label="Land"
        disablePrev={game.indexOfCountry === 0}
        disableNext={game.indexOfCountry === game.selectedCountries.length - 1}
      />
    </Flex>
  );
};

export default AufDenKopfGestelltGame;
