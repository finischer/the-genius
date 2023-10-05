import type { TDuSagstAnswerColors, TDuSagstAnswerSelectMapValue } from "./duSagst.types";

export const DEFAULT_ANSWER_OPTION: TDuSagstAnswerSelectMapValue = {
  label: "Keine Antwort",
  color: "transparent",
};

export const ANSWER_BACKGROUND_COLORS: { [index in TDuSagstAnswerColors]: string } = {
  pink: "#C100FF",
  blue: "#0065FF",
  green: "#28B141",
  yellow: "#FF9900",
  transparent: "transparent",
};

export const ANSWER_SELECT_MAP: { [index: number]: TDuSagstAnswerSelectMapValue } = {
  0: {
    label: "A",
    color: "blue",
  },
  1: {
    label: "B",
    color: "green",
  },
  2: {
    label: "C",
    color: "pink",
  },
  3: {
    label: "D",
    color: "yellow",
  },
};
