import { Flex, SimpleGrid, useMantineTheme } from "@mantine/core";
import { AnimatePresence, motion } from "framer-motion";
import React, { Fragment } from "react";
import CodeList from "~/components/gameshows/GeheimwörterConfigurator/components/CodeList";
import AnswerBanner from "~/components/room/AnswerBanner";
import GameNavControls from "~/components/shared/GameNavControls";
import ModToggle from "~/components/shared/ModToggle";
import RevealButton from "~/components/shared/RevealButton";
import useComponentVisibility from "~/hooks/useComponentVisibility";
import useAudio from "~/hooks/useAudio";
import { useUser } from "~/hooks/useUser";
import { animations } from "~/utils/animations";
import { slug } from "~/utils/strings";
import { goToNextQuestion, goToPreviousQuestion, sleep } from "~/utils/helpers";
import type { IGeheimwörterGameProps } from "./geheimwörter.types";
import ModView from "~/components/shared/ModView";

const GeheimwörterGame: React.FC<IGeheimwörterGameProps> = ({ game }) => {
  const theme = useMantineTheme();
  const question = game.questions[game.qIndex];
  const showAnswer = game.display.answer;
  const { isHost, hostFunction } = useUser();
  const { triggerAudioEvent } = useAudio();

  // Visibility state managed via the generic componentVisibility system
  const { visible: showWords } = useComponentVisibility(
    "geheimwoerter-wordlist"
  );
  const { visible: showCodeList } = useComponentVisibility(
    "geheimwoerter-codelist"
  );

  const handleShowAnswer = hostFunction(() => {
    triggerAudioEvent("playSound", "bell");
    game.display.answer = true;
  });

  const prepareQuestion = async () => {
    if (showAnswer) {
      await sleep(200);
    }
    game.display.answer = false;
  };

  const handleNextQuestion = hostFunction(async () => {
    await prepareQuestion();
    goToNextQuestion(game.questions, game.qIndex, (newIndex) => {
      game.qIndex = newIndex;
    });
  });

  const handlePrevQuestion = hostFunction(async () => {
    await prepareQuestion();
    goToPreviousQuestion(game.qIndex, (newIndex) => {
      game.qIndex = newIndex;
    });
  });

  if (!question) return <></>;

  const WordList = () => (
    <Flex
      direction="column"
      bg={theme.primaryColor}
      p="md"
      style={{ borderRadius: theme.radius.md }}
    >
      <SimpleGrid cols={showAnswer ? 2 : 1} verticalSpacing={0} spacing="md">
        {question.words.map((word, index) => (
          <Fragment key={slug([word.word, index])}>
            <span style={{ fontWeight: "bold" }}>{word.word}</span>
            {showAnswer && (
              <span>
                <span style={{ fontWeight: "bold" }}>{word.category[0]}</span>
                <span>{word.category.slice(1)}</span>
              </span>
            )}
          </Fragment>
        ))}
      </SimpleGrid>
    </Flex>
  );

  return (
    <Flex align="center" gap="5rem" justify="center">
      <SimpleGrid
        cols={2}
        style={{ display: "flex", alignItems: "center" }}
        w={900}
        spacing="5rem"
      >
        <AnimatePresence>
          {(showCodeList || isHost) && (
            <Flex direction="column" gap="sm" w="50%">
              <ModToggle id="geheimwoerter-codelist" label="Codelist">
                <CodeList codeList={game.codeList} showTitle={false} />
              </ModToggle>
            </Flex>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {(showWords || isHost) && (
            <Flex direction="column" w="auto">
              <motion.div
                {...animations.fadeInOut}
                style={{
                  display: "flex",
                  gap: "1rem",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <ModToggle id="geheimwoerter-wordlist" label="Wörter">
                  <WordList />
                </ModToggle>

                {!showAnswer ? (
                  <ModView>
                    <RevealButton
                      onReveal={handleShowAnswer}
                      revealed={showAnswer}
                      label="Antwort"
                      disabled={!showWords}
                    />
                  </ModView>
                ) : (
                  <AnswerBanner
                    answer={question.answer}
                    showAnswer={showWords && showAnswer}
                    miw={0}
                  />
                )}

                <GameNavControls
                  currentIndex={game.qIndex}
                  total={game.questions.length}
                  onPrev={handlePrevQuestion}
                  onNext={handleNextQuestion}
                />
              </motion.div>
            </Flex>
          )}
        </AnimatePresence>
      </SimpleGrid>
    </Flex>
  );
};

export default GeheimwörterGame;
