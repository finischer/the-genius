import { useEffect } from "react";
import useAudio from "~/hooks/useAudio";
import useSyncedRoom from "~/hooks/useSyncedRoom";
import { useUser } from "~/hooks/useUser";
import type { TFragenhagelGameState } from "./config";

/**
 * Handles the Fragenhagel-specific buzzer behaviour:
 * - Locks the standard room buzzer for all teams on mount (unlocks on unmount)
 *   so that the default useBuzzer flow in RoomHeader never fires
 * - Only the active player (isActiveTurn on their team) may buzz
 * - First press: buzzer sound + timer starts
 * - Second press: buzzer sound + timer stops → further presses blocked
 *   until the host ends the round (buzzerCount reset)
 * - Triggered by Spacebar or by the "fragenhagel-buzz" custom event that
 *   RoomHeader dispatches when the player clicks the game title
 */
const useFragenhagelBuzzer = (game: TFragenhagelGameState) => {
  const { isPlayer, team, player } = useUser();
  const { triggerAudioEvent } = useAudio();
  const room = useSyncedRoom();

  const isActiveTurn = team?.isActiveTurn ?? false;
  // Only the specifically selected player may buzz, not just anyone on the active team
  const isActivePlayer = isActiveTurn && player?.userId === game.activePlayerId;
  const isLocked = game.buzzerCount >= 2;

  // Lock the shared room buzzer state so the default useBuzzer flow
  // (spacebar → isActiveTurn + scorebarTimer) can never fire while this
  // game is active. Unlock everything when the component unmounts.
  useEffect(() => {
    Object.values(room.teams).forEach((t) => {
      t.buzzer.isLocked = true;
    });
    return () => {
      Object.values(room.teams).forEach((t) => {
        t.buzzer.isLocked = false;
      });
    };
  }, []);

  const handleBuzz = () => {
    if (!isPlayer || !isActivePlayer || isLocked) return;

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
  }, [isPlayer, isActivePlayer, isLocked, game.timerState.isActive]);

  // Game-title click dispatched by RoomHeader
  useEffect(() => {
    if (!isPlayer) return;

    const onTitleClick = () => handleBuzz();
    window.addEventListener("fragenhagel-buzz", onTitleClick);
    return () => window.removeEventListener("fragenhagel-buzz", onTitleClick);
  }, [isPlayer, isActivePlayer, isLocked, game.timerState.isActive]);
};

export default useFragenhagelBuzzer;
