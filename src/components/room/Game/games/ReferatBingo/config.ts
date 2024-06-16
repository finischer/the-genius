import { Game, type IGameGeneralState } from "../game.types";
import type { IReferatBingoState, TReferatBingoNotefieldState } from "./referatBingo.types";

export type TReferatBingoGameState = IReferatBingoState & IGameGeneralState;

const NUM_BINGO_FIELDS = 9;

const DEFAULT_NOTEFIELD_STATE: TReferatBingoNotefieldState = {
  answers: new Array<string>(NUM_BINGO_FIELDS).fill(""),
  selectedAnswers: [],
  submitted: false,
};

export const DEFAULT_REFERAT_BINGO_STATE: TReferatBingoGameState = {
  identifier: Game.REFERATBINGO,
  name: "Referat Bingo",
  modes: ["TEAM"],
  maxPoints: 999,
  scorebarMode: "number",
  topics: [],
  qIndex: 0,
  presenter: {
    id: "",
    name: "",
    isPresenting: false,
  },
  notefields: {
    teamOne: DEFAULT_NOTEFIELD_STATE,
    teamTwo: DEFAULT_NOTEFIELD_STATE,
  },
  display: {
    notefields: {
      teamOne: false,
      teamTwo: false,
    },
    topic: false,
  },
  rules: `
  
Spiel: {{ gameName }}

### Ziel:
Das Ziel von "{{ gameName }}" ist es, bestimmte Begriffe oder Phrasen während eines Referats zu identifizieren, um Bingo zu erreichen.

### Spielablauf:
Während eines Referats teilt sich jedes Team jeweils eine Bingo-Karte.
  
Ein Mitglied aus einem Team stellt das Referat vor, während die anderen Spieler (auch das Gegnerteam) ihre Bingo-Karten verwenden, um bestimmte Begriffe oder Phrasen zu markieren, wenn sie erwähnt werden.

Markiert ein Teammitglied einen Begriff oder eine Phrase auf seiner Bingo-Karte, wenn sie im Referat erwähnt wird, erhält das Team einen Punkt.

Das Team, das die meisten Punkte nach 4 Referaten hat, gewinnt das Spiel. 
  `,
};
