import type { ActionIconProps } from "@mantine/core";
import { ActionIcon, Button } from "@mantine/core";
import { Group, type ButtonProps } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { useSearchParams } from "next/navigation";
import React, { type FC } from "react";
import type { TApiActions } from "~/server/api/api.types";

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
  disabledButtons = false,
}) => {
  return (
    <Group
      justify="center"
      mt="xl"
    >
      <ActionIcon
        variant="default"
        onClick={onClickLeftButton}
        disabled={disabledButtons}
        {...leftButtonProps}
      >
        <IconChevronLeft />
      </ActionIcon>

      {isLastStep ? (
        <Button
          size="compact-sm"
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
        >
          <IconChevronRight />
        </ActionIcon>
      )}
    </Group>
  );
};

export default StepperButtons;
