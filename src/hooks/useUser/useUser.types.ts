import { type Dispatch } from "react";
import type { Player, Team } from "~/types/gameshow.types";
import { type TUserReduced } from "~/types/socket.types";
import type { FunctionToWrap } from "~/types/types";

export interface IUseUserProvider {
  children: React.ReactNode;
}

export interface IUseUserContext {
  user: TUserReduced;
  team: Team | undefined;
  setUser: Dispatch<TUserReduced>;
  isPlayer: boolean;
  isInTeam: boolean;
  isHost: boolean;
  isAdmin: boolean;
  player: Player | undefined;
  updateUsername: (newUsername: string) => Promise<boolean>;
  isLoading: boolean;
  hostFunction: <T extends any[]>(func: FunctionToWrap<T>) => FunctionToWrap<T>;
  playerFunction: (func: (team: Team, player: Player) => void) => () => void;
}
