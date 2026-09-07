import { useCallback, useEffect, useMemo, useState } from "react";
import { roomConfig } from "~/config/room.config";
import { TimerType, type TimerState } from "~/types/gameshow.types";
import useAudio from "../useAudio";
import useNotification from "../useNotification";
import useSyncedRoom from "../useSyncedRoom";
import useTimer from "../useTimer";
import { useUser } from "../useUser";

// Stable fallback so useTimer never receives a new object reference when the
// player has no team (e.g. host / spectator / initial load).
const DEFAULT_SCOREBAR_TIMER: TimerState = {
  id: null,
  active: false,
  currSeconds: 0,
  initSeconds: 5
};

const useBuzzer = () => {
  const [isActive, setIsActive] = useState(true);
  const { isPlayer, playerFunction, player } = useUser();
  const room = useSyncedRoom();

  // Memoised so Object.values().find() doesn't return a new object reference
  // on every render and cause useTimer's useEffect to re-fire endlessly.
  const team = useMemo(
    () =>
      Object.values(room.teams).find((team) =>
        team.players.some((p) => p.id === player?.id)
      ),
    [room.teams, player?.id]
  );

  const { triggerAudioEvent } = useAudio();
  const { showInfoNotification } = useNotification();

  const { startTimer } = useTimer(
    team?.scorebarTimer ?? DEFAULT_SCOREBAR_TIMER,
    TimerType.COUNTDOWN,
    roomConfig.timeAfterBuzzerPressedSeconds
  );

  useEffect(() => {
    function handleBuzzerEvent(e: KeyboardEvent, withTimer = true) {
      // only listen to space
      if (
        e.code === "Space" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        handleBuzzerClick({ withTimer });
      }
    }

    // remove listener when buzzer is not active -> important!
    if (!isActive) {
      window.removeEventListener("keydown", handleBuzzerEvent);
    } else if (isPlayer) {
      // only add listener when user is a player
      window.addEventListener("keydown", handleBuzzerEvent);
    }

    return () => {
      window.removeEventListener("keydown", handleBuzzerEvent);
    };
  }, [isPlayer, isActive]);

  const deactivateBuzzer = () => {
    setIsActive(false);
  };

  const activateBuzzer = () => {
    setIsActive(true);
  };

  const lockAllBuzzers = () => {
    const teams = Object.values(room.teams);
    teams.forEach((team) => {
      team.buzzer.isLocked = true;
      team.buzzer.isPressed = false;
      team.buzzer.playersBuzzered = [];
    });
  };

  const unlockAllBuzzers = () => {
    const teams = Object.values(room.teams);
    teams.forEach((team) => {
      team.buzzer.isLocked = false;
    });
  };

  const handleBuzzerClick = useCallback(
    ({ withTimer }: { withTimer: boolean }) =>
      playerFunction((team, player) => {
        if (team.buzzer.isLocked) {
          showInfoNotification({ message: "Buzzer ist gesperrt!" });
          return;
        }

        const wasAlreadyBuzzered = Object.values(room.teams).some(
          (team) => team.isActiveTurn
        );
        if (wasAlreadyBuzzered || !isActive) return;
        triggerAudioEvent("playSound", "buzzer");

        team.isActiveTurn = true;
        team.buzzer.isPressed = true;
        team.buzzer.playersBuzzered.push(player.id);
        if (withTimer) {
          triggerAudioEvent("playSound", "warningBuzzer");
          startTimer();
        }
      }),
    [isActive]
  );

  const areAllBuzzersLocked = Object.values(room.teams).every(
    (team) => team.buzzer.isLocked
  );

  return {
    isActive,
    buzzer: handleBuzzerClick,
    activateBuzzer,
    deactivateBuzzer,
    lockAllBuzzers,
    unlockAllBuzzers,
    areAllBuzzersLocked
  };
};

export default useBuzzer;
