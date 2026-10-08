import useSyncedRoom from "../useSyncedRoom";

/**
 * Lightweight alternative to useBuzzer for components that only need to
 * mutate buzzer state (lock / unlock) without setting up timers or intervals.
 *
 * Use this instead of useBuzzer() when you don't need the full buzzer flow —
 * e.g. in GameNavControls. Calling useBuzzer() from components that don't
 * need its timer wires up useTimer against the team's scorebarTimer, which
 * causes an infinite re-render loop when useSyncedRoom re-renders.
 */
const useBuzzerActions = () => {
  const room = useSyncedRoom();

  const lockAllBuzzers = () => {
    Object.values(room.teams).forEach((team) => {
      team.buzzer.isLocked = true;
      team.buzzer.isPressed = false;
      team.buzzer.playersBuzzered = [];
    });
  };

  const unlockAllBuzzers = () => {
    Object.values(room.teams).forEach((team) => {
      team.buzzer.isLocked = false;
    });
  };

  return { lockAllBuzzers, unlockAllBuzzers };
};

export default useBuzzerActions;
