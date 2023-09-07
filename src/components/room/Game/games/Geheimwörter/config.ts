import { type IGameGeneralState } from "../game.types";
import type { IGeheimwörterState } from "./geheimwörter.types";

export type TGeheimwörterGameState = IGeheimwörterState & IGameGeneralState;

export const DEFAULT_GEHEIMWOERTER_STATE: TGeheimwörterGameState = {
  identifier: "geheimwoerter",
  name: "Geheimwörter",
  modes: ["DUELL", "TEAM"],
  maxPoints: 7,
  scorebarMode: "circle",
  rules: "",
  answer: "",
  questions: [],
  codeList: [],
  display: {
    answer: false,
    codeList: false,
    words: false,
  },
  qIndex: 0,
  getRules() {
    return `
    Ihr müsst gleich Wörter mithilfe eines Codes entschlüssseln. 
    Ihr seht die Codetabelle vor euch mit der ihr gleich eine gesuchte Antwort entschlüsseln müsst. Diese bleibt dauerhaft eingeblendet. 
    Gleich seht ihr ein paar untereinanderstehende Wörter, wobei jedes Wort immer zu einem Oberbegriff aus der Codetabelle gehört. 
    Ein Beispiel: In der Codetabelle würde für den Buchstaben A der Oberbegriff "Automarke" stehen. Bei den Wörtern steht dann als erstes Wort "Ford".
    Ford ordnet ihr also dem Oberbegriff "Automarke" zu und dementsprechend beginnt auch die gesuchte Antwort mit einem "A".
    Meint ihr also die Antwort zu wissen, könnt ihr buzzern und habt dann anschließend 5 Sekunden Zeit eine Antwort zu geben. 
    Wer zuerst ${this.maxPoints} Punkte hat, hat das Spiel gewonnen.
    `;
  },
};
