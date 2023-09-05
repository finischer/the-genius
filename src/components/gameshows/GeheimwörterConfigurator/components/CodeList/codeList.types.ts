export type TCodeListItem = {
  letter: string;
  word: string;
};

export type TCodeList = TCodeListItem[];

export interface ICodeListProps {
  codeList: TCodeList;
  editable?: boolean;
}

export interface ICodeListItemProps {
  item: TCodeListItem;
  editable?: boolean;
}
