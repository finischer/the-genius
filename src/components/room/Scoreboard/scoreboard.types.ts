import type { Team } from "~/types/gameshow.types";

export enum ScoreboardColor {
  RED = "red",
  GREEN = "green",
}

export interface IScoreboardProps {
  team: Team;
  color: ScoreboardColor;
}
