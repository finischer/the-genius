import { useEffect, useState } from "react";
import { useRoom } from "../useRoom";
import { socket } from "../useSocket";
import { useUser } from "../useUser";
import useAudio from "../useAudio";
import useSyncedRoom from "../useSyncedRoom";
import useTimer from "../useTimer";
import { TimerType } from "~/types/gameshow.types";
import { roomConfig } from "~/config/room.config";
import useNotification from "../useNotification";

const useBuzzer = () => {
  const [isActive, setIsActive] = useState(true);
  const { isPlayer, playerFunction, player } = useUser();
  const room = useSyncedRoom();
  const wasAlreadyBuzzered = Object.values(room.teams).some((team) => team.isActiveTurn);

  const team = Object.values(room.teams).find((team) => team.players.some((p) => p.id === player?.id));

  const { triggerAudioEvent } = useAudio();
  const { showInfoNotification } = useNotification();

  const { startTimer } = useTimer(
    team?.scorebarTimer ?? {
      id: null,
      active: false,
      currSeconds: 0,
      initSeconds: 5,
    },
    TimerType.COUNTDOWN,
    roomConfig.timeAfterBuzzerPressedSeconds
  );

  useEffect(() => {
    function handleBuzzerEvent(e: KeyboardEvent, withTimer: boolean = true) {
      // only listen to space
      if (e.code === "Space" && document.activeElement?.tagName !== "TEXTAREA") {
        handleBuzzerClick({ withTimer: true });
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

  const handleBuzzerClick = ({ withTimer }: { withTimer: boolean }) =>
    playerFunction((team, player) => {
      if (team.buzzer.isLocked) {
        showInfoNotification({ message: "Buzzer ist gesperrt!" });
        return;
      }

      if (wasAlreadyBuzzered || !isActive) return;

      team.isActiveTurn = true;
      team.buzzer.isPressed = true;
      team.buzzer.playersBuzzered.push(player.id);
      if (withTimer) {
        startTimer();
      }
    });

  const areAllBuzzersLocked = Object.values(room.teams).every((team) => team.buzzer.isLocked);

  return {
    isActive,
    buzzer: handleBuzzerClick,
    activateBuzzer,
    deactivateBuzzer,
    lockAllBuzzers,
    unlockAllBuzzers,
    areAllBuzzersLocked,
  };
};

export default useBuzzer;
