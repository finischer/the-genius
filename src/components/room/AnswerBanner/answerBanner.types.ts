import type { BoxProps, StyleProp } from "@mantine/core";
import type { CSSProperties } from "react";

export interface IAnswerBannerProps extends BoxProps {
  answer: string;
  size?: "s" | "m" | "l";
  miw?: StyleProp<CSSProperties["minWidth"]>;
  showAnswer?: boolean;
}
