import { Box, Text } from "@mantine/core";
import type { FC } from "react";
import classes from "./ScoreBox.module.css";

interface ScoreBoxProps {
  score: number;
}

const ScoreBox: FC<ScoreBoxProps> = ({ score }) => {
  return (
    <Box className={classes.wrapper}>
      <Text className={classes.scoreText} fw={600}>
        {score}
      </Text>
    </Box>
  );
};

export default ScoreBox;
