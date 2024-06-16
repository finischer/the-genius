import { Game, type IGameGeneralState } from "../game.types";
import { type IMerkenState } from "./merken.types";

export type TMerkenGameState = IMerkenState & IGameGeneralState;

export const DEFAULT_MERKEN_STATE: TMerkenGameState = {
  identifier: Game.MERKEN,
  name: "Merken",
  modes: ["DUELL", "TEAM"],
  maxPoints: 7,
  scorebarMode: "circle",
  allCardsFlipped: false,
  cards: [],
  openCards: [],
  timerState: {
    isActive: false,
    timeToThinkSeconds: 60,
  },
  rules: `
Spiel: {{ gameName }}

### Ziel:
Das Ziel des Spiels "{{ gameName }}" ist es, durch Erinnerung und Geschicklichkeit die meisten Punkte zu sammeln.

### Spielablauf:
Vor euch liegt ein Feld mit verdeckten Karten. Hinter jeder Karte verbirgt sich eine Abbildung.

Ihr habt {{ timeToThinkSeconds }} {{#if timeToThinkSeconds.equalOne }}Sekunde{{else}}Sekunden{{/if}}, um euch die Abbildung und die dazugehörige Nummer einzuprägen. Nach Ablauf dieser Zeit werden alle Karten wieder verdeckt.

Dann seid ihr abwechselnd an der Reihe, euren Gegnerteam zu fragen, welche Abbildung sich hinter einer von euch ausgewählten verdeckten Karte verbirgt.

Bei einer richtigen Antwort bekommt das Gegnerteam einen Punkt, und die Karte bleibt offen. Bei einer falschen Antwort wird die Karte wieder verdeckt, und keiner bekommt einen Punkt.

Das erste Team, das {{ maxPoints }} Punkte erreicht, gewinnt das Spiel.
  `,
};
