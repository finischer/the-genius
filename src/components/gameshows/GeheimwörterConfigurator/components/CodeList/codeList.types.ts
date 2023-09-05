import type { Dispatch, SetStateAction } from "react";
import type { Updater } from "use-immer";
import type { TGameSettingsMap } from "~/hooks/useConfigurator/useConfigurator.types";

export type TCodeListItem = {
  letter: string;
  word: string;
};

export type TCodeList = TCodeListItem[];

export interface ICodeListProps {
  codeList: TCodeList;
  setCodeList?: Updater<TGameSettingsMap>;
  editable?: boolean;
}

export interface ICodeListItemProps {
  item: TCodeListItem;
  editable?: boolean;
  onWordChange?: (letter: string, newWord: string) => void;
}
