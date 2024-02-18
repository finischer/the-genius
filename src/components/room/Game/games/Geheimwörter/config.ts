import { Games, type IGameGeneralState } from "../game.types";
import type { IGeheimwörterState } from "./geheimwörter.types";

export type TGeheimwörterGameState = IGeheimwörterState & IGameGeneralState;

export const DEFAULT_GEHEIMWOERTER_STATE: TGeheimwörterGameState = {
  identifier: Games.GEHEIMWOERTER,
  name: "Geheimwörter",
  modes: ["DUELL", "TEAM"],
  maxPoints: 7,
  scorebarMode: "circle",
  answer: "",
  questions: [],
  codeList: [],
  display: {
    answer: false,
    codeList: false,
    words: false,
  },
  qIndex: 0,
  rules: `
Spiel: {{gameName}}

### Ziel des Spiels:
Das Ziel von {{gameName}} ist es, Wörter mithilfe eines Codes zu entschlüsseln und dabei so viele Punkte wie möglich zu sammeln.

### Spielablauf:
Ihr müsst gleich Wörter mithilfe eines Codes entschlüsseln. Eine Codetabelle bleibt dauerhaft eingeblendet, mit der ihr die gesuchte Antwort zuordnen könnt. Unter den Wörtern seht ihr jeweils einen Oberbegriff aus der Codetabelle. 

Zum Beispiel steht für den Buchstaben A der Oberbegriff "Automarke" in der Codetabelle, und das erste Wort unter den Wörtern lautet "Ford". Demnach beginnt die gesuchte Antwort mit einem "A".
Wenn ihr die Antwort wisst, buzzert ihr und habt dann 5 Sekunden Zeit, um sie zu geben. Das Team, das zuerst {{ maxPoints }} Punkte erreicht, gewinnt das Spiel.

  `,
};
