import { Button, Group, type GroupProps, Text } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import React from "react";
import useBuzzerActions from "~/hooks/useBuzzer/useBuzzerActions";
import ModView from "../ModView";

interface GameNavControlsProps extends Omit<GroupProps, "children"> {
  currentIndex: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  /** Label shown in the counter, e.g. "Frage", "Flagge", "Set" */
  label?: string;
  disablePrev?: boolean;
  disableNext?: boolean;
}

/**
 * Unified question/item navigation for all games.
 * Renders: [← Zurück]  Label X / Y  [Weiter →]
 * Wraps itself in ModView — invisible for non-moderators.
 */
const GameNavControls: React.FC<GameNavControlsProps> = ({
  currentIndex,
  total,
  onPrev,
  onNext,
  label = "Frage",
  disablePrev,
  disableNext,
  gap = "sm",
  align = "center",
  justify = "center",
  ...rest
}) => {
  const isPrevDisabled = disablePrev ?? currentIndex <= 0;
  const isNextDisabled = disableNext ?? currentIndex >= total - 1;
  const { unlockAllBuzzers } = useBuzzerActions();

  const handlePrev = () => {
    unlockAllBuzzers();
    onPrev();
  };

  const handleNext = () => {
    unlockAllBuzzers();
    onNext();
  };

  return (
    <ModView>
      <Group gap={gap} align={align} justify={justify} {...rest}>
        <Button
          variant="default"
          size="sm"
          leftSection={<IconChevronLeft size={16} />}
          disabled={isPrevDisabled}
          onClick={handlePrev}
        >
          Zurück
        </Button>

        <Text size="sm" c="dimmed" w={150} ta="center">
          {label} {currentIndex + 1} / {total}
        </Text>

        <Button
          variant="default"
          size="sm"
          rightSection={<IconChevronRight size={16} />}
          disabled={isNextDisabled}
          onClick={handleNext}
        >
          Weiter
        </Button>
      </Group>
    </ModView>
  );
};

export default GameNavControls;
