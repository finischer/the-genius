import { useEffect } from "react";
import type { TimerState } from "~/types/gameshow.types";

/**
 * A custom React hook for managing a timer.
 *
 * @param timer - The timer state object containing timer-related data.
 * @returns An object containing functions to control the timer and its current state.
 */
const useTimer = (timer: TimerState) => {
  useEffect(() => {
    if (!timer.active) {
      clearTimer();
    }
  }, [timer.active]);

  /**
   * Clears the interval for the timer.
   */
  const clearTimer = () => {
    if (timer.id) {
      clearInterval(timer.id);
      timer.id = null;
    }
  };

  /**
   * Starts the timer.
   */
  const startTimer = () => {
    const timerId = setInterval(() => {
      timer.currSeconds += 1;
    }, 1000);

    timer.id = timerId;
    timer.active = true;
  };

  /**
   * Stops the timer.
   */
  const stopTimer = () => {
    timer.active = false;
    clearTimer();
    resetTimer();
  };

  /**
   * Resets the timer.
   */
  const resetTimer = () => {
    timer.currSeconds = 0;
  };

  /**
   * Pauses the timer.
   */
  const pauseTimer = () => {
    timer.active = false;
  };

  // Return an object with timer control functions and the current timer state
  return {
    startTimer,
    stopTimer,
    pauseTimer,
    resetTimer,
    active: timer.active,
  };
};

export default useTimer;
