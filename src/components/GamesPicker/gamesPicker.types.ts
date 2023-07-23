import { type Dispatch } from "react";
import { TGameNames } from "~/games/game.types";

export interface IGamesPickerProps {
  setSelectedGames: Dispatch<ITransferListItem[]>;
}

export interface ITransferListItem {
  value: string;
  label: string;
}
