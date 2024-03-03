import { Game, type IGameGeneralState } from "../game.types";
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
  identifier: Game.DUSAGST,
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
  rules: `
  
  Spiel: {{ gameName }}
  
  ### Ziel des Spiels:
  Das Ziel von "{{ gameName }}" ist es, so viele Punkte wie möglich zu sammeln, indem die Spieler Fragen beantworten und die Antworten ihrer Teammitglieder richtig einschätzen.
  
  ### Spielablauf:
  1. Fragestellung: Die Spieler erhalten eine Frage mit vier Antwortmöglichkeiten.
  2. Antwortzeit: Jedes Team hat {{#if timeToThinkSeconds.equalOne}}eine Sekunde{{else}}{{timeToThinkSeconds}} Sekunden Zeit{{/if}}, um die Frage zu beantworten. Während dieser Zeit muss ein Teammitglied die Frage beantworten, während das andere Teammitglied einschätzt, welche Antwort sein Teampartner geben wird.
  3. Punktvergabe: Wenn die Antworten der Teammitglieder übereinstimmen, erhält das Team einen Punkt. Andernfalls gibt es keinen Punkt.
  4. Siegbedingungen: Das Team, das zuerst {{#if maxPoints.equalOne }}einen Punkt{{else}}{{maxPoints}} Punkte{{/if}} erreicht, gewinnt das Spiel.
  `,
};
