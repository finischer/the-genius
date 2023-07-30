import { type Dispatch } from "react";
import { type IRoom } from "~/pages/api/classes/Room/room.types";
import { type TGame } from "~/pages/room/_components/Game/games/game.types";

export interface IUseRoomProvider {
  children: React.ReactNode;
}

export interface IUseRoomContext {
  room: IRoom | undefined;
  currentGame: TGame | undefined;
  setRoom: Dispatch<IRoom>;
}

type NonNullableExceptCurrentGame<T> = {
  [K in keyof T]: K extends "currentGame" ? T[K] : NonNullable<T[K]>;
};

export type INonNullableUseRoomContext =
  NonNullableExceptCurrentGame<IUseRoomContext>;
