import type { ITeam } from "~/pages/api/classes/Team/team.types";

export interface IScoreboardProps {
  team: ITeam;
  color: "red" | "green";
}
