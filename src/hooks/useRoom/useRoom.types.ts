import { type Dispatch } from "react";
import { type IRoom } from "~/pages/api/classes/Room/room.types";

export interface IUseRoomProvider {
  children: React.ReactNode;
}

export interface IUseRoomContext {
  room: IRoom | undefined;
  setRoom: Dispatch<IRoom>;
}
