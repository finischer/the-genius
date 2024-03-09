import { useEffect } from "react";
import { TimerType, type TimerState } from "~/types/gameshow.types";

/**
 * A custom React hook for managing a timer.
 *
 * @param timer - The timer state object containing timer-related data.
 * @param type - Type of timer. Can be a COUNTDOWN or a STOPWATCH
 * @param initSeconds - Initial seconds before timer starts. Default is 0
 * @returns An object containing functions to control the timer and its current state.
 */
const useTimer = (timer: TimerState, type: TimerType = TimerType.STOPWATCH, initSeconds: number = 0) => {
  const isCountdown = type === TimerType.COUNTDOWN;

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
   * Starts the timer. Resets the timer before it starts.
   */
  const startTimer = (cb?: () => void) => {
    stopTimer();
    continueTimer(cb);
  };

  /**
   * Continues the timer after timer was stopped. It won't be reset when executes this functions. Otherwise when you execute the 'startTimer' function.
   */
  const continueTimer = (cb?: () => void) => {
    const timerId = setInterval(() => {
      if (isCountdown) {
        // check if countdown is done
        if (timer.currSeconds === 0) {
          stopTimer();

          if (cb) {
            // execute callback function
            cb();
          }

          return;
        }

        timer.currSeconds -= 1;
      } else {
        timer.currSeconds += 1;
      }
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
    timer.currSeconds = initSeconds;
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
    continueTimer,
    active: timer.active,
  };
};

export default useTimer;
