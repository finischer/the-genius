import { Game, type IGameGeneralState } from "../core/types";
import type {
  IFragenhagelState,
  TFragenhagelInterval
} from "./fragenhagel.types";

export type TFragenhagelGameState = IFragenhagelState & IGameGeneralState;

export const FRAGENHAGEL_BAR_COUNT = 52;

export const DEFAULT_FRAGENHAGEL_INTERVALS: TFragenhagelInterval[] = [
  { id: "1", label: "Intervall 1", start: 25, end: 30 },
  { id: "2", label: "Intervall 2", start: 32, end: 37 },
  { id: "3", label: "Intervall 3", start: 41, end: 46 }
];

export const DEFAULT_FRAGENHAGEL_STATE: TFragenhagelGameState = {
  identifier: Game.FRAGENHAGEL,
  name: "Fragenhagel",
  modes: ["DUELL"],
  maxPoints: 20,
  scorebarMode: "number",
  questions: [],
  configuredIntervals: DEFAULT_FRAGENHAGEL_INTERVALS,
  qIndex: 0,
  currentScore: 0,
  buzzerCount: 0,
  timerState: {
    isActive: false,
    seconds: 0
  },
  intervalState: {
    start: -1,
    end: -1
  },
  rules: `
Spiel: Fragenhagel

### Ziel:
In diesem Spiel beantwortet ein Spieler so viele Fragen wie möglich innerhalb eines bestimmten Zeitintervalls.

### Spielablauf:
1. **Vorbereitung:** Der Moderator wählt ein Zeitintervall (z. B. 25–30 Sekunden) und legt fest, welcher Spieler beginnt.
2. **Fragen stellen:** Der Moderator liest die Fragen laut vor. Der aktive Spieler antwortet mündlich.
3. **Timer:** Der aktive Spieler startet und stoppt den Timer per Buzzer (Leertaste). Das Ziel ist, den Timer innerhalb des markierten Intervalls zu stoppen.
4. **Wertung:** Der Moderator markiert jede Antwort als richtig oder falsch. Richtige Antworten bringen jeweils einen Punkt.
5. **Nächster Spieler:** Nach dem Ende eines Durchgangs wechselt der aktive Spieler.

### Tipps:
- Versuche, den Timer genau im markierten Intervall zu stoppen, um den maximalen Bonus zu erhalten.
- Je mehr Fragen du richtig beantwortest, desto mehr Punkte erhältst du!
  `
};
