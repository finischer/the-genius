import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import useSyncedRoom from "~/hooks/useSyncedRoom";

/**
 * Confetti Component
 *
 * Renders a confetti animation when triggered by the ModPanel.
 * Watches the room context display.confetti flag and triggers
 * the canvas-confetti animation when it changes to true.
 *
 * Uses animation idempotency to prevent multiple simultaneous animations.
 */
const Confetti: React.FC = () => {
  const room = useSyncedRoom();
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    // Guard: Only trigger animation when flag changes from false to true
    // and when no animation is currently running (idempotency check)
    if (room.context?.display.confetti === true && !isAnimatingRef.current) {
      // Mark animation as running to prevent re-triggering
      isAnimatingRef.current = true;

      const duration = 10000; // 10 seconds party animation
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      // Randomize confetti parameters for variety
      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      // Create continuous confetti bursts from multiple positions
      const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        const particleCount = 50 * (timeLeft / duration);

        // Confetti from left side
        void confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });

        // Confetti from right side
        void confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });

        // Confetti from center
        void confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.4, 0.6), y: Math.random() - 0.2 }
        });
      }, 250); // Burst every 250ms

      // Reset flag after animation completes (10 seconds)
      const timeoutId = setTimeout(() => {
        clearInterval(interval);
        if (room.context?.display) {
          room.context.display.confetti = false;
        }
        // Mark animation as complete
        isAnimatingRef.current = false;
      }, duration);

      // Cleanup function to clear timeout and interval if component unmounts
      return () => {
        clearInterval(interval);
        clearTimeout(timeoutId);
        isAnimatingRef.current = false;
      };
    }

    // If flag is set to false while animation is running, stop immediately
    if (room.context?.display.confetti === false && isAnimatingRef.current) {
      // Reset the animation state
      isAnimatingRef.current = false;
      // Note: cleanup functions from the previous effect will handle clearing intervals/timeouts
    }
  }, [room.context?.display.confetti]);

  return null;
};

export default Confetti;
