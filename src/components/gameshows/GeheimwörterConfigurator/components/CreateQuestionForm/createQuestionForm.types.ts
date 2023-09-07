import { type TGeheimWoerterQuestionsWordsItem } from "../../../../room/Game/games/Geheimwörter/geheimwörter.types";
import type { TextInputProps } from "@mantine/core";
import type { TGeheimwoerterQuestionItem } from "~/components/room/Game/games/Geheimwörter/geheimwörter.types";
import type { TCodeList } from "../CodeList/codeList.types";

export interface ICreateQuestionContainerProps {
  codeList: TCodeList;
  onAddQuestion: (newQuestion: TGeheimwoerterQuestionItem) => void;
}

export interface IWordItemProps extends TextInputProps {
  word: TGeheimWoerterQuestionsWordsItem | undefined;
}
