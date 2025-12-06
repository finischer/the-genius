import { Game, type IGameGeneralState } from "../core/types";
import type { IZehnSetzenGameState } from "./zehnSetzen.types";

export type TZehnSetzenGameState = IZehnSetzenGameState & IGameGeneralState;

export const MAX_SCORE = 10;

export const DEFAULT_ZEHN_SETZEN_STATE: TZehnSetzenGameState = {
  identifier: Game.ZEHN_SETZEN,
  name: "Zehn Setzen",
  modes: ["DUELL", "TEAM"],
  maxPoints: 10,
  scorebarMode: "number",
  questions: [],
  qIndex: 0,
  teamStates: {
    t1: {
      id: "t1",
      answerScores: [0, 0, 0, 0],
      submitted: false
    },
    t2: {
      id: "t2",
      answerScores: [0, 0, 0, 0],
      submitted: false
    }
  },
  display: {
    question: false,
    answers: [],
    correctAnswer: false,
    teamScores: {
      t1: false,
      t2: false
    }
  },
  rules: `
Spiel: Zehn Setzen

### Ziel:
Das Ziel von "Zehn Setzen" ist es, durch geschicktes Setzen von Punkten auf mögliche Antworten die meisten Punkte zu erzielen.

### Spielablauf:
1. **Rundenverlauf:**
  - Jede Runde besteht aus einer Frage mit vier Antwortmöglichkeiten (A, B, C, D).
  - Eine Frage wird gestellt, und die vier Antwortmöglichkeiten werden präsentiert.
  - Jedes Team hat insgesamt **10 Punkte** pro Runde, die es frei auf die vier Antwortmöglichkeiten verteilen kann.
  - Die Punkteverteilung erfgolgt geheim, damit andere Teams sie nicht sehen können.

2. **Punktevergabe:**
  - Nachdem alle Teams ihre Punkte verteilt haben, wird die richtige Antwort bekanntgegeben.
  - Teams erhalten **nur die Punkte, die sie auf die richtige Antwort gesetzt haben.**
  - Punkte auf falsche Antworten verfallen.

3. **Spielende:**
  - Das Spiel endet nach einer vorher festgelegten Anzahl von Fragen.
  - Das Team mit den meisten Gesamtpunkten gewinnt.

### Tipps:
- Taktik ist entscheidend! Eine hohe Punktzahl auf eine sichere Antwort zu setzen, kann riskant sein, wenn ihr euch nicht sicher seid.
- Streut eure Punkte strategisch, um eure Chancen zu maximieren.
  `
};
