import { useEffect } from "react";
import useAudio from "~/hooks/useAudio";
import useBuzzer from "~/hooks/useBuzzer";
import { useUser } from "~/hooks/useUser";
import type { TFragenhagelGameState } from "./config";

/**
 * Handles the Fragenhagel-specific buzzer behaviour:
 * - Deactivates the standard useBuzzer spacebar listener for the lifetime
 *   of this hook (re-activates on unmount)
 * - Only the active player (isActiveTurn) may buzz
 * - First press starts the timer, second press stops it
 * - Plays the buzzer sound on every press
 * - Also listens for the "fragenhagel-buzz" custom event fired by RoomHeader
 *   when the player clicks the game title
 */
const useFragenhagelBuzzer = (game: TFragenhagelGameState) => {
  const { isPlayer, team } = useUser();
  const { triggerAudioEvent } = useAudio();
  const { deactivateBuzzer, activateBuzzer } = useBuzzer();

  const isActiveTurn = team?.isActiveTurn ?? false;
  const isLocked = game.buzzerCount >= 2;

  // Disable the standard buzzer for the entire lifetime of this game
  useEffect(() => {
    deactivateBuzzer();
    return () => activateBuzzer();
  }, []);

  const handleBuzz = () => {
    if (!isPlayer || !isActiveTurn || isLocked) return;

    triggerAudioEvent("playSound", "buzzer");
    game.timerState.isActive = !game.timerState.isActive;
    game.buzzerCount += 1;
  };

  // Spacebar
  useEffect(() => {
    if (!isPlayer) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.code === "Space" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        handleBuzz();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isPlayer, isActiveTurn, isLocked, game.timerState.isActive]);

  // Game-title click dispatched by RoomHeader
  useEffect(() => {
    if (!isPlayer) return;

    const onTitleClick = () => handleBuzz();
    window.addEventListener("fragenhagel-buzz", onTitleClick);
    return () => window.removeEventListener("fragenhagel-buzz", onTitleClick);
  }, [isPlayer, isActiveTurn, isLocked, game.timerState.isActive]);
};

export default useFragenhagelBuzzer;
