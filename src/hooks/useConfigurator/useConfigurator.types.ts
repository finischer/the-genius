import { Dispatch, SetStateAction } from "react";
import { type TDefaultFlaggenState } from "~/games/flaggen/config";
import { type TGameNames } from "~/games/game.types";
import { type TDefaultMemoryState } from "~/games/memory/config";
import { TDefaultMerkenState } from "~/games/merken/config";

export type TGameSettingsMap = {
  flaggen: TDefaultFlaggenState;
  memory: TDefaultMemoryState;
  merken: TDefaultMerkenState;
};

export type TGameSettings<T extends TGameNames> = {
  state: TGameSettingsMap[T];
};

export interface IConfiguratorProvider {
  children: React.ReactNode;
}

export type TConfiguratorContext = [
  TGameSettingsMap,
  Dispatch<SetStateAction<TGameSettingsMap>>
];
