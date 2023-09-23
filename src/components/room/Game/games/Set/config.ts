import { type IGameGeneralState } from "../game.types";
import { SET_COLORS, type ISetGameState } from "./set.types";

export type TSetGameState = ISetGameState & IGameGeneralState;

export const DEFAULT_SET_STATE: TSetGameState = {
  identifier: "set",
  name: "Set",
  modes: ["DUELL", "TEAM"],
  maxPoints: 7,
  scorebarMode: "circle",
  rules: "",
  questions: [],
  markedCards: [],
  qIndex: 0,
  display: {
    cards: false,
    markedCards: false,
  },

  getRules() {
    return `
    Vor euch seht ihr 12 Spielkarten. Auf diesen Karten seht ihr drei verschiedene Symbole: Raute, Rechteck und Oval. Diese Symbole sind entweder gefüllt, leer oder gestreift. 
    Auf jeder Karte ist eines dieser Symbole bis zu 3 mal vertreten und das in einer von drei Farben: Rot, Grün und Blau.
    Eure Aufgabe ist es nun unter diesen 12 Karten ein Set zu finden. Ein Set besteht immer aus exakt 3 Karten. 
    Diese Karten müssen so gewählt sein, dass die Ausprägungen in den eben genannten Eigenschaften Form, Füllung, Farbe und Anzahl jeweils entweder auf allen Karten exakt gleich oder auf allen Karten komplett unterschiedlich sind. 
    `;
  },
};

export const SET_COLORS_MAP = {
  red: SET_COLORS.RED,
  blue: SET_COLORS.BLUE,
  green: SET_COLORS.GREEN,
};
