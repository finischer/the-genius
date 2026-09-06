import { Box, Flex, Text } from "@mantine/core";
import type { FC } from "react";
import { FRAGENHAGEL_BAR_COUNT } from "../../config";
import type { TFragenhagelIntervalState } from "../../fragenhagel.types";
import classes from "./TimerBar.module.css";

interface TimerBarProps {
  seconds: number;
  intervalState: TFragenhagelIntervalState;
}

const TimerBar: FC<TimerBarProps> = ({ seconds, intervalState }) => {
  return (
    <Box className={classes.wrapper}>
      <Text className={classes.timerText} fw={700}>
        {seconds}
      </Text>
      <Flex className={classes.barsContainer}>
        {Array.from({ length: FRAGENHAGEL_BAR_COUNT }, (_, i) => {
          const barIndex = i + 1;
          const isInInterval =
            intervalState.start !== -1 &&
            barIndex >= intervalState.start &&
            barIndex <= intervalState.end;
          const isFilled = i < seconds;

          let colorClass = classes.barDefault;
          if (isFilled && isInInterval) colorClass = classes.barSuccess;
          else if (isFilled && !isInInterval) colorClass = classes.barError;

          const isVisible = isInInterval || isFilled;

          return (
            <Box
              key={i}
              className={`${classes.bar} ${colorClass}`}
              style={{ opacity: isVisible ? 1 : 0.3 }}
            />
          );
        })}
      </Flex>
    </Box>
  );
};

export default TimerBar;
