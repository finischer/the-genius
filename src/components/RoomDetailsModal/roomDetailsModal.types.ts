import { type IRoom } from "~/pages/api/classes/Room/room.types";

export interface IRoomDetailsModalProps {
  openedModal: boolean;
  onClose: () => void;
  room: IRoom;
}
