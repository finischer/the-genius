import { type IGameGeneralState } from "../game.types";
import type { IReferatBingoState } from "./referatBingo.types";

export type TReferatBingoGameState = IReferatBingoState & IGameGeneralState;

export const DEFAULT_REFERAT_BINGO_STATE: TReferatBingoGameState = {
  identifier: "referatBingo",
  name: "Referat Bingo",
  modes: ["TEAM"],
  maxPoints: 999,
  scorebarMode: "number",
  rules: "",
  getRules() {
    return `
        
    `;
  },
};
