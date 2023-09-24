import { type TGeheimWoerterQuestionsWordsItem } from "../../../../room/Game/games/Geheimwörter/geheimwörter.types";
import type { TextInputProps } from "@mantine/core";
import type { TGeheimwoerterQuestionItem } from "~/components/room/Game/games/Geheimwörter/geheimwörter.types";
import type { TCodeList } from "../CodeList/codeList.types";
import type { Updater } from "use-immer";
import type { TQuestionFormMode } from "~/components/gameshows/types";

export interface ICreateQuestionContainerProps {
  codeList: TCodeList;
  question: TGeheimwoerterQuestionItem;
  mode: TQuestionFormMode;
  setQuestion: Updater<TGeheimwoerterQuestionItem>;
  onAddQuestion: (newQuestion: TGeheimwoerterQuestionItem) => void;
  onUpdateQuestion: (newQuestion: TGeheimwoerterQuestionItem) => void;
}

export interface IWordItemProps extends TextInputProps {
  word: TGeheimWoerterQuestionsWordsItem | undefined;
}
