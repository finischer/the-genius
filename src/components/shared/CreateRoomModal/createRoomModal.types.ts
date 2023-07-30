import { type Gameshow, type GameshowMode } from "@prisma/client";

export interface ICreateRoomModalProps {
  openedModal: boolean;
  onClose: () => void;
  gameshow: Gameshow;
}

export interface ICreateRoomConfig {
  name: string;
  modus: GameshowMode;
  isPrivateRoom: boolean;
  password: string;
  games: unknown[]; // TODO: Create Game Type
}
