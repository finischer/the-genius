import type { Game } from "@prisma/client";
import { type Dispatch } from "react";
import type { Updater } from "use-immer";
import type { Game } from "~/components/room/Game/games/game.types";

export interface IGamesPickerProps {
  selectedGames: Game[];
  setSelectedGames: Updater<Game[]>;
}

export type TTransferListItem = {
  value: Game;
  label: string;
};

export type TTransferListData = [TTransferListItem[], TTransferListItem[]];
