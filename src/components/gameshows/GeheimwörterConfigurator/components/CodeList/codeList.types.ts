import type { TGameConfigUpdateFn } from "~/hooks/useGameConfigurator/useGameConfigurator.types";

export type TCodeListItem = {
  letter: string;
  category: string;
};

export type TCodeList = TCodeListItem[];

export interface ICodeListProps {
  codeList: TCodeList;
  setCodeList?: TGameConfigUpdateFn<"geheimwoerter">;
  editable?: boolean;
  showTitle?: boolean;
}

export interface ICodeListItemProps {
  item: TCodeListItem;
  editable?: boolean;
  onWordChange?: (letter: string, newWord: string) => void;
}
