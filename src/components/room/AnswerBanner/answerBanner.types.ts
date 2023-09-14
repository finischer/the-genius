import type { SystemProp } from "@mantine/core";
import type { CSSProperties } from "react";

export interface IAnswerBannerProps {
  answer: string;
  size?: "s" | "m" | "l";
  miw?: SystemProp<CSSProperties["minWidth"]>;
  showAnswer?: boolean;
}
