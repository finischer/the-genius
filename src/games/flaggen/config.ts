import { IGameGeneralState } from "../game.types";
import { IFlaggenState } from "./flaggen.types";

export type TDefaultFlaggenState = IFlaggenState & IGameGeneralState;

export const DEFAULT_FLAGGEN_STATE: TDefaultFlaggenState = {
  identifier: "flaggen",
  maxPoints: 7,
  name: "Flaggen",
  scoreBarMode: "circle",
  countries: [],
  qIndex: 0,
  display: {
    answer: false,
    country: false,
  },
};
