import type { Team } from "@prisma/client";

export interface IScoreCircleProps {
  filled: boolean;
}

export interface IScorebarProps {
  team: Team;
  timerPosition?: "left" | "right";
}
