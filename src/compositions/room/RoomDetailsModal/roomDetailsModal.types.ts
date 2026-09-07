import type { Room } from "~/types/gameshow.types";

export interface IRoomDetailsModalProps {
  openedModal: boolean;
  onClose: () => void;
  room: Room;
}
