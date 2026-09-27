import type {
  IAufDenKopfGestelltState,
  TSelectedCountry
} from "./aufDenKopfGestellt.types";
import { COUNTRIES } from "./aufDenKopfGestellt.data";
import { Game, type IGameGeneralState } from "../core/types";

export type TAufDenKopfGestelltGameState = IAufDenKopfGestelltState &
  IGameGeneralState;

// All 23 countries selected by default – only store lightweight metadata
const DEFAULT_SELECTED_COUNTRIES: TSelectedCountry[] = COUNTRIES.map((c) => ({
  id: c.shortName,
  name: c.name,
  shortName: c.shortName,
  durationSeconds: 15
}));

export const DEFAULT_AUF_DEN_KOPF_GESTELLT_STATE: TAufDenKopfGestelltGameState =
  {
    identifier: Game.AUF_DEN_KOPF_GESTELLT,
    name: "Auf den Kopf gestellt",
    modes: ["TEAM", "DUELL"],
    maxPoints: 7,
    scorebarMode: "circle",
    selectedCountries: DEFAULT_SELECTED_COUNTRIES,
    indexOfCountry: 0,
    animation: {
      isDone: false,
      state: ""
    },
    showCountry: false,
    showAnswer: false,
    answer: "",
    rotateCountry: false,
    fillCountry: false,
    resolving: false,
    animKey: 0,
    resolveFromDashoffset: 0,
    rules: `
Spiel: {{ gameName }}

### Ziel des Spiels:
Errate das kopfüber angezeigte Land, bevor der Umriss vollständig gezeichnet ist!

### Spielablauf:
1. Ein Länderumriss wird auf dem Kopf stehend (180° gedreht) langsam eingezeichnet.
2. Die Spieler versuchen so schnell wie möglich zu erkennen, welches Land gezeigt wird.
3. Wer das Land errät, drückt den Buzzer. Der Moderator pausiert die Animation.
4. Bei richtiger Antwort erhält das Team einen Punkt. Der Moderator kann das Land in die richtige Position drehen zur Auflösung.
5. Das Team, das zuerst {{#if maxPoints.equalOne}}einen Punkt{{else}}{{maxPoints}} Punkte{{/if}} erreicht, gewinnt.
`
  };
