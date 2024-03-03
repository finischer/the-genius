import { TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import QuestionFormLayout from "~/components/layout/QuestionFormLayout";
import type { TPresentationTopic } from "~/components/room/Game/games/ReferatBingo/referatBingo.types";
import { Game } from "~/components/room/Game/games/game.types";
import { useGameshowConfig } from "~/hooks/useGameshowConfig/useGameshowConfig";

const ReferatBingoConfigurator = () => {
  const { updateGame, referatBingo } = useGameshowConfig(Game.REFERATBINGO);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [presentationTopics, setPresentationTopics] = useState<TPresentationTopic[]>(referatBingo.topics);

  const form = useForm<TPresentationTopic>({
    initialValues: {
      id: uuidv4(),
      topic: "",
    },
  });

  const handleSubmit = form.onSubmit((newTopic) => {
    const topicIds = presentationTopics.map((t) => t.id);

    if (topicIds.includes(newTopic.id)) {
      // update existing question
      setPresentationTopics((oldTopics) =>
        oldTopics.map((topic) => {
          if (topic.id === newTopic.id) {
            return newTopic;
          }

          return topic;
        })
      );
    } else {
      setPresentationTopics((oldTopics) => [...oldTopics, newTopic]);
    }

    form.reset();
    form.setFieldValue("id", uuidv4());
    inputRef.current?.focus();
  });

  const handleSelectTopic = (topic: TPresentationTopic) => {
    form.setValues(topic);
  };

  useEffect(() => {
    updateGame((draft) => {
      draft.topics = presentationTopics;
    });
  }, [presentationTopics]);

  return (
    <QuestionFormLayout
      questions={presentationTopics}
      setQuestions={setPresentationTopics}
      onFormSubmit={handleSubmit}
      renderValueByKey="topic"
      onSelectQuestion={handleSelectTopic}
      selectedQuestionId={form.getInputProps("id").value as string}
      buttonText="Thema"
      listTitle="Themen"
    >
      <TextInput
        required
        ref={inputRef}
        placeholder="PietSmiet"
        label="Thema für das Referat"
        {...form.getInputProps("topic")}
      />
    </QuestionFormLayout>
  );
};

export default ReferatBingoConfigurator;
