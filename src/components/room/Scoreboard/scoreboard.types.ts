import type { Team } from "@prisma/client";

export interface IScoreboardProps {
  team: Team;
  color: "red" | "green";
}
