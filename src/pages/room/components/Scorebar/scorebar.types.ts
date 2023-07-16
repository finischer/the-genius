import { ITeam } from "~/pages/api/classes/Team/team.types";

export interface IScoreCircleProps {
  filled: boolean;
}

export interface IScorebarProps {
  team: ITeam;
}
