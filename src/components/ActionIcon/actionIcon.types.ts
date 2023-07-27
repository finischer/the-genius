import { type ActionIconProps } from "@mantine/core";
import { type ReactNode } from "react";

export interface IActionIconProps extends ActionIconProps {
  children: ReactNode;
  toolTip?: string;
  onClick?: () => void;
}
