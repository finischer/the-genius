import type { BoxProps, SystemProp } from "@mantine/core";
import type { CSSProperties } from "react";

export interface IAnswerBannerProps extends BoxProps {
  answer: string;
  size?: "s" | "m" | "l";
  miw?: SystemProp<CSSProperties["minWidth"]>;
  showAnswer?: boolean;
}
