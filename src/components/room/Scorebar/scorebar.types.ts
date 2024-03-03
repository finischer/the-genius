import type { Team } from "~/types/gameshow.types";

export interface IScoreCircleProps {
  filled: boolean;
}

export interface IScorebarProps {
  team: Team;
  timerPosition?: "left" | "right";
}
