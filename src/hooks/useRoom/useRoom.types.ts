import { type Dispatch } from "react";
import type { TGame } from "~/components/room/Game/games/game.types";
import type Room from "~/pages/api/classes/Room/Room";

export interface IUseRoomProvider {
  children: React.ReactNode;
}

export interface IUseRoomContext {
  room: Room | undefined;
  currentGame: TGame | undefined;
  setRoom: Dispatch<Room>;
}

type NonNullableExceptCurrentGame<T> = {
  [K in keyof T]: K extends "currentGame" ? T[K] : NonNullable<T[K]>;
};

export type INonNullableUseRoomContext =
  NonNullableExceptCurrentGame<IUseRoomContext>;
