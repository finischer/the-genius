import { Game, type IGameGeneralState } from "../game.types";
import { SET_COLORS, type ISetGameState } from "./set.types";

export type TSetGameState = ISetGameState & IGameGeneralState;

export const SET_COLORS_MAP = {
  red: SET_COLORS.RED,
  blue: SET_COLORS.BLUE,
  green: SET_COLORS.GREEN,
};

export const DEFAULT_SET_STATE: TSetGameState = {
  identifier: Game.SET,
  name: "Set",
  modes: ["DUELL", "TEAM"],
  maxPoints: 7,
  scorebarMode: "circle",
  questions: [],
  openedCards: [],
  markedCards: [],
  markedCardsState: "marked",
  qIndex: 0,
  display: {
    cards: false,
    markedCards: false,
  },

  rules: `
Spiel: {{ gameName }}

### Ziel:
Das Ziel des Speils "{{ gameName }}" ist es, unter den 12 Spielkarten ein Set zu finden. Ein Set besteht aus genau 3 Karten, die in den Eigenschaften Form, Füllung, Farbe und Anzahl entweder komplett gleich oder komplett unterschiedlich sein müssen.

### Spielablauf:
Vor euch seht ihr 12 Spielkarten. Jede Karte zeigt eines von drei verschiedenen Symbolen (Raute, Rechteck, Oval), die entweder gefüllt, leer oder gestreift sind. Zudem sind sie in einer von drei Farben (Rot, Grün, Blau) dargestellt. Jede dieser Ausprägungen kann bis zu 3-mal auf einer Karte vorkommen.

Eure Aufgabe ist es, unter diesen Karten ein Set zu finden. Dies bedeutet, dass die Ausprägungen von Form, Füllung, Farbe und Anzahl auf den drei ausgewählten Karten entweder auf allen Karten exakt gleich oder auf allen Karten komplett unterschiedlich sein müssen.

Wenn ihr glaubt, ein Set gefunden zu haben, buzzert ihr und habt dann 5 Sekunden Zeit, um eure Antwort zu nennen. Ist die Antwort korrekt, bekommt ihr einen Punkt. Sollte die Antwort falsch sein, bekommt der Gegner einen Punkt, und das Spiel geht mit dem nächsten Kartenstapel weiter.

Das Team, das zuerst {{ maxPoints }} Punkte erreicht, gewinnt das Spiel.
  `,
};
