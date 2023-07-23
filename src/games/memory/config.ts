import { IGameGeneralState } from "../game.types";
import { IMemoryState } from "./memory.types";

export type TDefaultMemoryState = IMemoryState & IGameGeneralState;

export const DEFAULT_MEMORY_STATE: TDefaultMemoryState = {
  identifier: "memory",
  name: "Memory",
  maxPoints: 999,
  scoreBarMode: "number",
};
