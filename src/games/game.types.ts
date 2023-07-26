export type TScoreBarMode = "number" | "circle";

export enum Games {
  FLAGGEN = "flaggen",
  MEMORY = "memory",
}

export type TGameNames = "flaggen" | "memory" | "merken";

export interface IGameGeneralState {
  name: string;
  identifier: TGameNames;
  maxPoints: number;
  scoreBarMode: TScoreBarMode;
}
