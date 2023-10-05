import { type IGameGeneralState } from "../game.types";
import type { IDuSagstState, TDuSagstAnswerBoxState, TDuSagstTeamState } from "./duSagst.types";
import { v4 as uuidv4 } from "uuid";

export type TDuSagstGameState = IDuSagstState & IGameGeneralState;

const createDefaultBoxState = (answerTheQuestion: boolean): TDuSagstAnswerBoxState => ({
  id: uuidv4(),
  answerIndex: -1,
  answerTheQuestion,
  showAnswer: false,
  submitted: true,
});

const createDefaultTeamState = (): TDuSagstTeamState => ({
  id: uuidv4(),
  boxStates: [createDefaultBoxState(true), createDefaultBoxState(false)],
});

export const DUSAGST_TIME_TO_THINK_SECONDS = 30;

export const DEFAULT_DUSAGST_STATE: TDuSagstGameState = {
  identifier: "duSagst",
  name: "Du Sagst...",
  modes: ["TEAM"],
  maxPoints: 6,
  scorebarMode: "circle",
  qIndex: 0,
  questions: [],
  timeToThinkSeconds: DUSAGST_TIME_TO_THINK_SECONDS,
  teamStates: {
    t1: createDefaultTeamState(),
    t2: createDefaultTeamState(),
  },
  display: {
    answers: [],
    question: false,
  },
  rules: "",
  getRules() {
    return `
        Die Spieler bekommen eine Frage gestellt, bei der es 4 Antwortmöglichkeiten gibt. 
        Anschließend habt ihr ${
          this.timeToThinkSeconds === 1
            ? "eine Sekunde"
            : `${
                this.timeToThinkSeconds
              } Sekunden Zeit und in dieser Zeit muss ein Teammitglied die Frage beantworten,
        während das andere Teammitglied einschätzen muss, welche Antwort der Teampartner geben wird. Stimmen die beiden Antworten überein, gibt es einen Punkt. Stimmen die Antworten nicht überein, gibt es keinen Punkt.
        Welches Team zuerst ${
          this.maxPoints === 1 ? "einen Punkt" : `${this.maxPoints} Punkte`
        } hat , gewinnt das Spiel.
        `
        }
    `;
  },
};
