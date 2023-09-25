import { Button, Container, Flex, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useRef, type SyntheticEvent, useEffect } from "react";
import { useConfigurator } from "~/hooks/useConfigurator";

const DuSagstConfigurator = () => {
  const [duSagst, setDuSagst, { disableFurtherButton, enableFurtherButton }] = useConfigurator("duSagst");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const form = useForm({
    initialValues: {
      question: "",
      answers: ["", "", "", ""],
    },
  });

  const answerInputElements = Array(4)
    .fill(null)
    .map((_, index) => (
      <TextInput
        key={index}
        required
        label={`Antwort ${index + 1}`}
        placeholder="Cola"
        {...form.getInputProps(`answers.${index}`)}
      />
    ));

  const handleSubmit = form.onSubmit((values) => {
    console.log("Values: ", values);
  });

  return (
    <Flex
      direction="column"
      gap="md"
    >
      {/* Create question container */}
      <form onSubmit={handleSubmit}>
        <Flex
          direction="column"
          gap="xl"
        >
          <TextInput
            ref={inputRef}
            required
            w="100%"
            label="Frage"
            placeholder="Welches ist mein Lieblingsgetränk?"
            {...form.getInputProps("question")}
          />
          {answerInputElements}
          <Button type="submit">Frage hinzufügen</Button>
        </Flex>
      </form>

      {/* All questions container */}
      <Flex>
        <p>All Questions</p>
      </Flex>
    </Flex>
  );
};

export default DuSagstConfigurator;
