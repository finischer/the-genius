import type { Game as PrismaGame } from "@prisma/client";
import type { Updater } from "use-immer";
import type { Game } from "~/components/room/Game/games/game.types";

export interface IGamesPickerProps {
  selectedGames: PrismaGame[];
  setSelectedGames: Updater<PrismaGame[]>;
}

export type TTransferListItem = {
  value: Game;
  label: string;
};

export type TTransferListData = [TTransferListItem[], TTransferListItem[]];
