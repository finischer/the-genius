import { type IGameGeneralState } from "../game.types";
import type { IDuSagstState } from "./duSagst.types";

export type TDuSagstGameState = IDuSagstState & IGameGeneralState;

export const DEFAULT_DUSAGST_STATE: TDuSagstGameState = {
  identifier: "duSagst",
  name: "Du Sagst...",
  modes: ["TEAM"],
  maxPoints: 6,
  scorebarMode: "circle",
  rules: "",
  getRules() {
    return `
        
    `;
  },
};
