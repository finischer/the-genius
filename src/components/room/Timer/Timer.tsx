import { Flex, Text, useMantineTheme } from "@mantine/core";
import { AnimatePresence, motion } from "framer-motion";
import { useRoom } from "~/hooks/useRoom";
import { animations } from "~/utils/animations";

const Timer = () => {
  const theme = useMantineTheme();
  const { room } = useRoom();
  const timerState = room.state.display.clock;
  const secondsColor =
    timerState.currentSeconds <= 5 ? theme.colors.red[7] : "white";

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
            sx={(theme) => ({
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
