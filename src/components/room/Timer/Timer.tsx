import { Flex, Text, useMantineTheme } from "@mantine/core";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import useAudio from "~/hooks/useAudio";
import { useRoom } from "~/hooks/useRoom";
import useSyncedRoom from "~/hooks/useSyncedRoom";
import useTimer from "~/hooks/useTimer";
import { animations } from "~/utils/animations";

const Timer = () => {
  const theme = useMantineTheme();
  const room = useSyncedRoom();
  const { triggerAudioEvent } = useAudio();
  const timerState = room.context.header.timer;
  const secondsColor = timerState.currSeconds <= 5 ? theme.colors.red[7] : "white";

  useEffect(() => {
    if (timerState.currSeconds === 5) {
      triggerAudioEvent("playSound", "warningBuzzer");
    }
  }, [timerState.currSeconds]);

  useEffect(() => {
    if (!timerState.active) {
      triggerAudioEvent("stopSound", "warningBuzzer");
    }
  }, [timerState.active]);

  return (
    <AnimatePresence>
      {timerState.active && (
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
              c={secondsColor}
            >
              {timerState.currSeconds}
            </Text>
          </Flex>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Timer;
