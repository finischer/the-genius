import { type GameshowMode } from "~/generated/prisma/enums";
import type { SafedGameshow } from "~/server/api/routers/gameshows";

export interface ICreateRoomModalProps {
  openedModal: boolean;
  onClose: () => void;
  gameshow: SafedGameshow;
}

export interface ICreateRoomConfig {
  name: string;
  modus: GameshowMode;
  isPrivate: boolean;
  games: unknown[]; // TODO: Create Game Type
}
