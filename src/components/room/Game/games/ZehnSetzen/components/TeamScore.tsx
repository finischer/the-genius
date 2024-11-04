import { Flex } from "@mantine/core";
import { useUser } from "~/hooks/useUser";

const TeamScore = ({
  teamId,
  isDisplayed,
  score
}: {
  teamId: string;
  isDisplayed: boolean;
  score: number;
}) => {
  const { team, isPlayer } = useUser();

  const isInTeam = team?.id === teamId;

  const opacity = isDisplayed || isInTeam ? 1 : isPlayer ? 0 : 0.5;
  //   const display = isDisplayed || !isPlayer || isInTeam ? "block" : "none";

  const textStyle = {
    opacity,
    transition: "opacity 0.5s"
  };

  return (
    <Flex w={30} justify="center">
      <span style={textStyle}>{score}</span>
    </Flex>
  );
};

export default TeamScore;
