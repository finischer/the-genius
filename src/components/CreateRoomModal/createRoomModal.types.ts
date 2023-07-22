import { type GameshowMode, type Gameshow } from "@prisma/client";

export interface ICreateRoomModalProps {
  openedModal: boolean;
  onClose: () => void;
  gameshow: Gameshow | undefined;
}

export interface ICreateRoomConfig {
  name: string;
  modus: GameshowMode;
  isPrivateRoom: boolean;
  password: string;
  games: unknown[]; // TODO: Create Game Type
}
