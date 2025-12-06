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
  const { team, isPlayer, isHost } = useUser();

  const isInTeam = team?.id === teamId;

  let opacity = 0;
  if (isDisplayed || isInTeam) {
    opacity = 1;
  } else if (isPlayer || !isHost) {
    opacity = 0;
  } else {
    opacity = 0.5;
  }

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
