import type { ActionIconProps } from "@mantine/core";
import { ActionIcon, Button, Group, type ButtonProps } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { type FC } from "react";

interface IStepperButtonsProps {
  onClickLeftButton?: () => void;
  onClickRightButton?: () => void;
  onSaveClick?: () => void;
  rightButtonProps?: ActionIconProps;
  leftButtonProps?: ActionIconProps;
  saveButtonProps?: ButtonProps;
  disabledButtons?: boolean;
  isLastStep?: boolean;
}

const StepperButtons: FC<IStepperButtonsProps> = ({
  onClickLeftButton,
  onClickRightButton,
  onSaveClick,
  leftButtonProps,
  rightButtonProps,
  saveButtonProps,
  isLastStep,
  disabledButtons = false
}) => {
  return (
    <Group mt="xl" pos="fixed" bottom={20} right={20}>
      <ActionIcon
        variant="default"
        onClick={onClickLeftButton}
        disabled={disabledButtons}
        {...leftButtonProps}
        size="xl"
      >
        <IconChevronLeft />
      </ActionIcon>

      {isLastStep ? (
        <Button
          size="md"
          px="xl"
          disabled={disabledButtons}
          onClick={onSaveClick}
          {...saveButtonProps}
        >
          Speichern
        </Button>
      ) : (
        <ActionIcon
          onClick={onClickRightButton}
          disabled={disabledButtons}
          {...rightButtonProps}
          size="xl"
        >
          <IconChevronRight />
        </ActionIcon>
      )}
    </Group>
  );
};

export default StepperButtons;
