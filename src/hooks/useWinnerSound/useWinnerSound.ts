import { useEffect, useRef } from "react";
import useAudio from "~/hooks/useAudio";
import useMusic from "~/hooks/useMusic";
import useSyncedRoom from "~/hooks/useSyncedRoom";

interface IUseWinnerSoundParams {
  /**
   * Current question index. Required for "number" scorebarMode games.
   * Optional for "circle" scorebarMode games (ignored).
   */
  qIndex?: number;
  /**
   * Total number of questions / rounds (questions.length or countries.length).
   * Required for "number" scorebarMode games.
   * Optional for "circle" scorebarMode games (ignored).
   */
  totalQuestions?: number;
}

/**
 * Observes game state and fires the winner sound + confetti exactly once
 * per game when a win condition is met. Games call this hook with their
 * qIndex and totalQuestions — no manual trigger needed.
 *
 * Win conditions by scorebarMode:
 *
 * "circle" (Flaggen, Geheimwörter, Set, DuSagst, Merken):
 *   Any team's gameScore reaches maxPoints.
 *   qIndex / totalQuestions are not required and will be ignored.
 *
 * "number" (ZehnSetzen, Fragenhagel):
 *   Any team's gameScore increases while on the last question
 *   (qIndex === totalQuestions - 1).
 *   Both qIndex and totalQuestions are required — a warning is logged
 *   if either is missing.
 */
const useWinnerSound = ({
  qIndex,
  totalQuestions
}: IUseWinnerSoundParams = {}) => {
  const room = useSyncedRoom();
  const { triggerAudioEvent } = useAudio();
  const { emitPauseMusic } = useMusic();

  const currGame = room.context.currentGame;
  const scorebarMode = currGame?.scorebarMode;
  const maxPoints = currGame?.maxPoints;

  const teamScores = Object.values(room.teams).map((t) => t.gameScore);
  const totalScore = teamScores.reduce((sum, s) => sum + s, 0);

  // Prevents double-triggering within the same game session.
  const firedRef = useRef(false);

  // Reset when the active game changes so each new game can trigger once.
  const gameIdentifierRef = useRef(currGame?.identifier);
  if (currGame?.identifier !== gameIdentifierRef.current) {
    gameIdentifierRef.current = currGame?.identifier;
    firedRef.current = false;
  }

  const triggerWinner = () => {
    if (firedRef.current) return;
    firedRef.current = true;
    emitPauseMusic();
    triggerAudioEvent("playSound", "winning");
  };

  // "circle" mode: fire as soon as any team hits maxPoints
  useEffect(() => {
    if (scorebarMode !== "circle") return;
    if (!maxPoints) return;

    const won = teamScores.some((score) => score >= maxPoints);
    if (won) triggerWinner();
  }, [totalScore]);

  // "number" mode: fire when scores change on the last question
  useEffect(() => {
    if (scorebarMode !== "number") return;
    if (totalScore === 0) return;

    if (qIndex === undefined || totalQuestions === undefined) {
      console.warn(
        "[useWinnerSound] scorebarMode is 'number' but qIndex or totalQuestions " +
          "was not provided. Winner sound will not fire."
      );
      return;
    }

    const isLastQuestion = qIndex >= totalQuestions - 1;
    if (isLastQuestion) triggerWinner();
  }, [totalScore]);
};

export default useWinnerSound;
