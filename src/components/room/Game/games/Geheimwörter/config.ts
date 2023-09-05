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
    Ihr seht die Codetabelle vor euch mit der ihr die gesuchte Antwort entschlüsseln könnt. Diese wird auch dauerhaft eingeblendet, also ihr müsst euch die nicht merken oder auswendig lernen. 
    Ihr erhaltet gleich ein paar Wörter, die stehen untereinander. 
    Und jedes Wort gehört immer zu einem der Oberbegriffe in dieser Tabelle. 
    Zum Beispiel das Wort Kotflügel gehört dann zum Begriff Autoteil. 
    Dann würde das Kotflügel für den Buchstaben A stehen. 
    Meint ihr die Antwort zu wissen, könnt ihr buzzern und habt dann anschließend 5 Sekunden Zeit eine Antwort zu geben. 
    Wer zuerst ${this.maxPoints} Punkte hat, hat das Spiel gewonnen.
    `;
  },
};
