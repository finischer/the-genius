import { Button, Group, Text } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import React from "react";
import ModView from "../ModView";

interface GameNavControlsProps {
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
  disableNext
}) => {
  const isPrevDisabled = disablePrev ?? currentIndex <= 0;
  const isNextDisabled = disableNext ?? currentIndex >= total - 1;

  return (
    <ModView>
      <Group gap="sm" align="center" justify="center">
        <Button
          variant="default"
          size="sm"
          leftSection={<IconChevronLeft size={16} />}
          disabled={isPrevDisabled}
          onClick={onPrev}
        >
          Zurück
        </Button>

        <Text size="sm" c="dimmed" w={90} ta="center">
          {label} {currentIndex + 1} / {total}
        </Text>

        <Button
          variant="default"
          size="sm"
          rightSection={<IconChevronRight size={16} />}
          disabled={isNextDisabled}
          onClick={onNext}
        >
          Weiter
        </Button>
      </Group>
    </ModView>
  );
};

export default GameNavControls;
