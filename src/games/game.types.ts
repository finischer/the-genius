export type TScorebarMode = "number" | "circle";

export enum Games {
  FLAGGEN = "flaggen",
  MEMORY = "memory",
}

export type TGameNames = "flaggen" | "memory" | "merken";

export interface IGameGeneralState {
  name: string;
  identifier: TGameNames;
  maxPoints: number;
  scorebarMode: TScorebarMode;
  rules: string; // just rules as string -> will generate when user clicks on 'save gameshow' button
  getRules: () => string; // function to get the current rules while config the game. Some text in rules depends on other variables in same object
}
