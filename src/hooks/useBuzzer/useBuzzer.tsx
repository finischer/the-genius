import { useEffect, useState } from "react";
import { useRoom } from "../useRoom";
import { socket } from "../useSocket";
import { useUser } from "../useUser";
import useAudio from "../useAudio";

const useBuzzer = () => {
  const [isActive, setIsActive] = useState(true);
  const { isPlayer, team } = useUser();
  const { room } = useRoom();
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

  const handleBuzzerClick = () => {
    if (!isPlayer || room.state.teamWithTurn || !team || !isActive) return;
    socket.emit("buzzer", { teamId: team.id, withTimer: true });
    triggerAudioEvent("playSound", "buzzer");
    triggerAudioEvent("playSound", "warningBuzzer");
  };

  return { isActive, buzzer: handleBuzzerClick, activateBuzzer, deactivateBuzzer };
};

export default useBuzzer;
