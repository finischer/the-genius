import { ActionIcon as MantineActionIcon } from "@mantine/core";
import React, { type SyntheticEvent } from "react";
import { type IActionIconProps } from "./actionIcon.types";
import Tooltip from "../Tooltip/Tooltip";

const ActionIcon: React.FC<IActionIconProps> = ({
  toolTip,
  children,
  onClick,
  disabled = false,
  ...props
}) => {
  const handleClick = (e: SyntheticEvent) => {
    e.stopPropagation();
    if (!onClick) return;
    onClick(e);
  };

  return (
    <Tooltip
      label={toolTip}
      disabled={!toolTip || disabled}
      openDelay={500}
    >
      <MantineActionIcon
        onClick={handleClick}
        disabled={disabled}
        {...props}
      >
        {children}
      </MantineActionIcon>
    </Tooltip>
  );
};

export default ActionIcon;
