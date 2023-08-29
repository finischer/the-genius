import { type IGameGeneralState } from "../game.types";
import { type IMerkenState } from "./merken.types";

export type TMerkenGameState = IMerkenState & IGameGeneralState;

export const DEFAULT_MERKEN_STATE: TMerkenGameState = {
  identifier: "merken",
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
  rules: "",
  getRules() {
    return `
        Vor euch seht ihr ein Feld mit verdeckten Feldern. Hinter diesen Feldern verbirgt sich eine Abbildung. 
        Ihr habt gleich ${this.timerState.timeToThinkSeconds} ${
      Math.abs(this.timerState.timeToThinkSeconds) === 1
        ? "Sekunde"
        : "Sekunden"
    } Zeit, um euch die Abbildung und die dazugehörige Nummer einzuprägen. Nach ${
      Math.abs(this.timerState.timeToThinkSeconds) === 1
        ? "der einen Sekunde"
        : `${this.timerState.timeToThinkSeconds} Sekunden`
    } werden alle Felder wieder verdeckt. 
        Danach fragt ihr abwechselnd euren Gegner, welche Abbildung sich hinter einem Feld eurer Wahl verbirgt. 
        Gebt ihr eine richtige Antwort, bekommt ihr einen Punkt und das Feld bleibt offen.
        Gebt ihr eine falsche Antwort, wird das Feld wieder verdeckt und keiner bekommt einen Punkt.
        Wer zuerst ${this.maxPoints} Punkte hat, der gewinnt das Spiel.
    `;
  },
};
