import type { Team } from "@prisma/client";
import { type Dispatch } from "react";
import { type TUserReduced } from "~/types/socket.types";

export interface IUseUserProvider {
  children: React.ReactNode;
}

export interface IUseUserContext {
  user: TUserReduced;
  team: Team | undefined;
  setUser: Dispatch<TUserReduced>;
  setUserAsPlayer: (team: Team) => void;
  isPlayer: boolean;
  isHost: boolean;
  updateUsername: (newUsername: string) => Promise<boolean>;
  isLoading: boolean;
  // @ts-ignore
  hostFunction: (func: (...args: any[]) => void) => (...args: any[]) => any;
}
