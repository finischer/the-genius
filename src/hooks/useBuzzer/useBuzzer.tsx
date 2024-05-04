import { useEffect, useState } from "react";
import { useRoom } from "../useRoom";
import { socket } from "../useSocket";
import { useUser } from "../useUser";
import useAudio from "../useAudio";
import useSyncedRoom from "../useSyncedRoom";
import useTimer from "../useTimer";
import { TimerType } from "~/types/gameshow.types";

const useBuzzer = () => {
  const [isActive, setIsActive] = useState(true);
  const { isPlayer, playerFunction, player } = useUser();
  const room = useSyncedRoom();
  const wasAlreadyBuzzered = Object.values(room.teams).some((team) => team.isActiveTurn);

  const team = Object.values(room.teams).find((team) => team.players.some((p) => p.id === player?.id));

  const { triggerAudioEvent } = useAudio();

  const { startTimer } = useTimer(
    team?.scorebarTimer ?? {
      id: null,
      active: false,
      currSeconds: 0,
      initSeconds: 5,
    },
    TimerType.COUNTDOWN,
    5
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

  const handleBuzzerClick = ({ withTimer }: { withTimer: boolean }) =>
    playerFunction((team, player) => {
      if (wasAlreadyBuzzered || !isActive) return;

      team.isActiveTurn = true;
      team.buzzer.isPressed = true;
      team.buzzer.playersBuzzered.push(player.id);
      if (withTimer) {
        startTimer();
      }
    });

  return { isActive, buzzer: handleBuzzerClick, activateBuzzer, deactivateBuzzer };
};

export default useBuzzer;
