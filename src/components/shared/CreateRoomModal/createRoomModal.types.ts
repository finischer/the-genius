import { type Gameshow, type GameshowMode } from "@prisma/client";
import type { SafedGameshow } from "~/server/api/routers/gameshows";

export interface ICreateRoomModalProps {
  openedModal: boolean;
  onClose: () => void;
  gameshow: SafedGameshow;
}

export interface ICreateRoomConfig {
  name: string;
  modus: GameshowMode;
  isPrivateRoom: boolean;
  password: string;
  games: unknown[]; // TODO: Create Game Type
}
