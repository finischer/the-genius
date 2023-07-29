import { type Dispatch } from "react";
import { type TGameNames } from "~/games/game.types";

export interface IGamesPickerProps {
  setSelectedGames: Dispatch<TTransferListItem[]>;
}

export type TTransferListItem = {
  value: TGameNames;
  label: string;
};

export type TTransferListData = [TTransferListItem[], TTransferListItem[]];
