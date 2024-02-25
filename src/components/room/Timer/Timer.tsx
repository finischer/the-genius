import { Flex, Text, useMantineTheme } from "@mantine/core";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import useAudio from "~/hooks/useAudio";
import { useRoom } from "~/hooks/useRoom";
import { animations } from "~/utils/animations";

const Timer = () => {
  const theme = useMantineTheme();
  const { room } = useRoom();
  const { triggerAudioEvent } = useAudio();
  const timerState = room.state.display.clock;
  const secondsColor = timerState.currentSeconds <= 5 ? theme.colors.red[7] : "white";

  useEffect(() => {
    if (timerState.currentSeconds === 5) {
      triggerAudioEvent("playSound", "warningBuzzer");
    }
  }, [timerState.currentSeconds]);

  useEffect(() => {
    if (!timerState.isActive) {
      triggerAudioEvent("stopSound", "warningBuzzer");
    }
  }, [timerState.isActive]);

  return (
    <AnimatePresence>
      {timerState.isActive && (
        <motion.div {...animations.fadeInOut}>
          <Flex
            h="5rem"
            miw="5rem"
            bg={theme.primaryColor}
            p="0 1rem"
            justify="center"
            align="center"
            style={(theme) => ({
              borderRadius: theme.radius.sm,
              boxShadow: theme.shadows.xl,
            })}
          >
            <Text
              size="2.25rem"
              color={secondsColor}
            >
              {timerState.currentSeconds}
            </Text>
          </Flex>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Timer;
