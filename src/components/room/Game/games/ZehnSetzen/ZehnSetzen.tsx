import { Flex, Group, Stack } from "@mantine/core";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { type FC } from "react";
import ActionIcon from "~/components/shared/ActionIcon";
import QuestionBox from "~/components/shared/QuestionBox";
import { useUser } from "~/hooks/useUser";
import type { TZehnSetzenGameState } from "./config";
import type { IZehnSetzenGameProps } from "./zehnSetzen.types";

const ZehnSetzen: FC<IZehnSetzenGameProps> = ({ game }) => {
  const currQuestion = game.questions.at(0);
  const teamState = game.teamStates;
  const { isPlayer, team, playerFunction } = useUser();
  const TeamScore = ({
    isDisplayed,
    score
  }: {
    isDisplayed: boolean;
    score: number;
  }) => {
    const opacity = isDisplayed ? 1 : isPlayer ? 0 : 0.5;
    const display = isDisplayed || !isPlayer ? "block" : "none";

    const textStyle = {
      opacity,
      display,
      transition: "opacity 0.5s"
    };

    return (
      <Flex w={30} justify="center">
        <span style={textStyle}>{score}</span>
      </Flex>
    );
  };

  const answerElements = currQuestion?.answers.map((answer, index) => {
    const teamKey = team?.shortName ?? null;

    const incrementScore = (
      teamKey: keyof TZehnSetzenGameState["teamStates"] | null
    ) => {
      if (!teamKey) return;

      playerFunction(() => {
        const currScore = teamState[teamKey].answerScores.at(index) ?? 0;
        const newScore = currScore + 1;
        teamState[teamKey].answerScores.splice(index, 1, newScore);
      });
    };

    const decrementScore = (
      teamKey: keyof TZehnSetzenGameState["teamStates"] | null
    ) => {
      if (!teamKey) return;

      playerFunction(() => {
        const currScore = teamState[teamKey].answerScores.at(index) ?? 0;
        const newScore = currScore - 1;
        teamState[teamKey].answerScores.splice(index, 1, newScore);
      });
    };

    return (
      <Group key={answer.id}>
        <ActionIcon onClick={() => decrementScore(teamKey)}>
          <IconMinus size={16} />
        </ActionIcon>
        <QuestionBox py="xs" px="md" contentCentered={false}>
          <Group justify="space-between" w="100%">
            <TeamScore
              isDisplayed={true}
              score={teamState.t1.answerScores.at(index) ?? 0}
            />
            {answer.answer}
            <TeamScore
              isDisplayed={true}
              score={teamState.t2.answerScores.at(index) ?? 0}
            />
          </Group>
        </QuestionBox>
        <ActionIcon onClick={() => incrementScore(teamKey)}>
          <IconPlus size={16} />
        </ActionIcon>
      </Group>
    );
  });

  return (
    <div>
      <Stack align="center">
        <QuestionBox>{game.questions.at(0)?.question}</QuestionBox>
        {answerElements}
      </Stack>
    </div>
  );
};

export default ZehnSetzen;
