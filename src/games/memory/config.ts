import { IGameGeneralState } from "../game.types";
import { IMemoryState } from "./memory.types";

export type TMemoryGameState = IMemoryState & IGameGeneralState;

export const DEFAULT_MEMORY_STATE: TMemoryGameState = {
  identifier: "memory",
  name: "Memory",
  maxPoints: 999,
  scorebarMode: "number",
  rules: "",
  getRules() {
    return `
        Vor euch seht ihr 42 umgedrehte Karten. Auf jeder dieser Karten befindet sich ein Bild, dabei befindet sich ein Bild immer jeweils auf zwei Karten. 
        Es existieren also insgesamt 21 Kartenpaare. Ihr dreht gleich abwechselnd zwei Karten herum. 
        Zeigen diese Karten das gleiche Bild, werden diese Karten aus dem Spiel genommen. Ihr bekommt einen Punkt und ihr seid noch einmal dran. 
        Zeigen die Karten zwei verschiedene Bilder, werden diese Karten wieder umgedreht und der Gegner ist an der Reihe. 
        Wer zuerst 11 Kartenpaare gefunden hat, hat dieses Spiel gewonnen.
    `;
  },
};
