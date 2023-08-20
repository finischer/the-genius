import type Room from "~/pages/api/classes/Room/Room";

export interface IRoomDetailsModalProps {
  openedModal: boolean;
  onClose: () => void;
  room: Room;
}
