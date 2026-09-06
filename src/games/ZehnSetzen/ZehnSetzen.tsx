import { Button, Stack } from "@mantine/core";
import { AnimatePresence, motion } from "framer-motion";
import { type FC } from "react";
import GameNavControls from "~/components/shared/GameNavControls";
import ModControlBar from "~/components/shared/ModControlBar";
import ModToggle from "~/components/shared/ModToggle";
import ModView from "~/components/shared/ModView";
import QuestionBox from "~/components/shared/QuestionBox";
import useSyncedRoom from "~/hooks/useSyncedRoom";
import { useUser } from "~/hooks/useUser";
import type { TeamShortNames } from "~/types/gameshow.types";
import { animations } from "~/utils/animations";
import {
  getTeamByShortName,
  goToNextQuestion,
  goToPreviousQuestion,
  sleep
} from "~/utils/helpers";
import type { IZehnSetzenGameProps } from "./zehnSetzen.types";
import AnswerGroup from "./components/AnswerGroup";

const ZehnSetzen: FC<IZehnSetzenGameProps> = ({ game }) => {
  const currQuestion = game.questions.at(game.qIndex);
  const teamState = game.teamStates;
  const room = useSyncedRoom();

  const { team, isHost, hostFunction } = useUser();
  const hasSubmittedAnswer = team?.shortName
    ? teamState[team.shortName].submitted
    : false;

  const submittedTeams = Object.entries(teamState)
    .map(([teamName, teamState]) => {
      return {
        teamName: teamName as TeamShortNames,
        ...teamState
      };
    })
    .filter((team) => team.submitted);

  const handleToggleCorrectAnswer = hostFunction(async () => {
    game.display.correctAnswer = !game.display.correctAnswer;

    await sleep(1000);

    applyPointsToTeamScores();
  });

  const allTeamsSubbmitted = Object.values(teamState).every(
    (team) => team.submitted
  );

  const prepareQuestion = async () => {
    const sleepTimeout =
      game.display.question || game.display.answers.length > 0 ? 300 : 0;

    game.display.answers = [];
    game.display.correctAnswer = false;
    game.display.question = false;
    game.display.teamScores.t1 = false;
    game.display.teamScores.t2 = false;
    teamState.t1.answerScores = new Array<number>(4).fill(0);
    teamState.t1.submitted = false;

    teamState.t2.answerScores = new Array<number>(4).fill(0);
    teamState.t2.submitted = false;

    await sleep(sleepTimeout);
  };

  const handlePrevQuestion = async () => {
    await prepareQuestion();
    goToPreviousQuestion(game.qIndex, () => {
      game.qIndex -= 1;
    });
  };

  const handleNextQuestion = async () => {
    await prepareQuestion();
    goToNextQuestion(game.questions, game.qIndex, () => {
      game.qIndex += 1;
    });
  };

  const applyPointsToTeamScores = hostFunction(() => {
    const correctAnswerIndex = currQuestion?.answers.findIndex(
      (answer) => answer.id === currQuestion?.correctAnswer?.id
    );

    if (correctAnswerIndex === undefined) return;

    const pointsTeamOne = teamState.t1.answerScores.at(correctAnswerIndex);
    const pointsTeamTwo = teamState.t2.answerScores.at(correctAnswerIndex);

    if (pointsTeamOne) {
      room.teams.teamOne.gameScore += pointsTeamOne;
    }

    if (pointsTeamTwo) {
      room.teams.teamTwo.gameScore += pointsTeamTwo;
    }
  });

  return (
    <AnimatePresence>
      <Stack align="center">
        <motion.div layout>
          <Stack align="center">
            <ModToggle id="zehnsetzen-question" label="Frage">
              <QuestionBox cursor={isHost ? "pointer" : "default"}>
                {currQuestion?.question}
              </QuestionBox>
            </ModToggle>
            <AnswerGroup
              game={game}
              question={currQuestion}
              hasSubmittedAnswer={hasSubmittedAnswer}
            />
          </Stack>
        </motion.div>

        <ModView>
          {submittedTeams.map((team) => {
            const roomTeam = getTeamByShortName(room.teams, team.teamName);

            return (
              <motion.span
                key={team.id}
                {...animations.fadeInOut}
                transition={{ delay: 0.2 }}
              >
                {roomTeam.name} hat eingeloggt
              </motion.span>
            );
          })}
        </ModView>

        <ModControlBar>
          <Button
            disabled={!allTeamsSubbmitted}
            variant="default"
            onClick={handleToggleCorrectAnswer}
          >
            Lösung {game.display.correctAnswer ? "ausblenden" : "anzeigen"}
          </Button>
        </ModControlBar>

        <GameNavControls
          currentIndex={game.qIndex}
          total={game.questions.length}
          onPrev={handlePrevQuestion}
          onNext={handleNextQuestion}
        />
      </Stack>
    </AnimatePresence>
  );
};

export default ZehnSetzen;
