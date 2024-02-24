import type { Games } from "../game.types";

export type TPresentationTopic = {
  id: string;
  topic: string;
};

export type TReferatBingoNotefieldState = {
  answers: string[];
  selectedAnswers: number[]; // indices of answers
  submitted: boolean;
};

export type IReferatBingoState = {
  identifier: Games.REFERATBINGO;
  topics: TPresentationTopic[];
  qIndex: number;
  presenter: {
    id: string; // userId who is presenting
    name: string; // userName who is presenting
    isPresenting: boolean;
  };
  notefields: {
    teamOne: TReferatBingoNotefieldState;
    teamTwo: TReferatBingoNotefieldState;
  };
  display: {
    notefields: {
      teamOne: boolean;
      teamTwo: boolean;
    };
    topic: boolean;
  };
};

export interface IReferatBingoGameProps {
  game: IReferatBingoState;
}
