import { type Dispatch } from "react";
import { ITeam } from "~/pages/api/classes/Team/team.types";
import { type TUserReduced } from "~/types/socket.types";

export interface IUseUserProvider {
  children: React.ReactNode;
}

export interface IUseUserContext {
  user: TUserReduced | undefined;
  setUser: Dispatch<TUserReduced>;
  setUserAsPlayer: (team: ITeam) => void;
  isPlayer: boolean;
}
