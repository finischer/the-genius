import { type Dispatch } from "react";
import { type TGame } from "~/games/game.types";
import { type IRoom } from "~/pages/api/classes/Room/room.types";

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
