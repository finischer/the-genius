import { type Dispatch } from "react";
import { type Games } from "../configurators/_game_configurator_map";

export interface IGamesPickerProps {
  setSelectedGames: Dispatch<ITransferListItem[]>;
}

export interface ITransferListItem {
  value: string;
  label: string;
}
