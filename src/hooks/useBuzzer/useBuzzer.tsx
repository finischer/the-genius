import { useEffect, useState } from "react";
import { useRoom } from "../useRoom";
import { socket } from "../useSocket";
import { useUser } from "../useUser";
import useAudio from "../useAudio";
import useSyncedRoom from "../useSyncedRoom";

const useBuzzer = () => {
  const [isActive, setIsActive] = useState(true);
  const { isPlayer, playerFunction, player } = useUser();
  const room = useSyncedRoom();
  const wasAlreadyBuzzered = Object.values(room.teams).some((team) => team.isActiveTurn);

  const { triggerAudioEvent } = useAudio();

  useEffect(() => {
    function handleBuzzerEvent(e: KeyboardEvent) {
      // only listen to space
      if (e.code === "Space" && document.activeElement?.tagName !== "TEXTAREA") {
        handleBuzzerClick();
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

  const handleBuzzerClick = playerFunction((team, player) => {
    if (!isPlayer || wasAlreadyBuzzered || !isActive) return;
    // socket.emit("buzzer", { teamId: team.id, withTimer: true });
    // triggerAudioEvent("playSound", "buzzer");
    // triggerAudioEvent("playSound", "warningBuzzer");
    team.isActiveTurn = true;
    team.buzzer.isPressed = true;
    team.buzzer.playersBuzzered.push(player.id);
  });

  return { isActive, buzzer: handleBuzzerClick, activateBuzzer, deactivateBuzzer };
};

export default useBuzzer;
