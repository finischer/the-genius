/**
 * Beispiel Spiel - Konfiguration
 *
 * Hier definieren wir den Default State und die Game State Type
 */

import { Game, type IGameGeneralState } from "../../games/core/types";
import { type IExampleGameState } from "./examplegame.types";

// Kombiniere game-spezifische State mit allgemeiner State
export type TExampleGameGameState = IExampleGameState & IGameGeneralState;

// Default State für das Beispiel Spiel
export const DEFAULT_EXAMPLE_GAME_STATE: TExampleGameGameState = {
  // Allgemeine Game Properties (von IGameGeneralState)
  identifier: "exampleGame" as any, // TODO: Add Game.EXAMPLE_GAME to enum
  name: "Beispiel Quiz",
  modes: ["DUELL", "TEAM"],
  maxPoints: 15,
  scorebarMode: "number",

  // Spiel-spezifische Properties
  questions: [
    {
      id: "1",
      text: "Was ist die Hauptstadt von Deutschland?",
      answer: "Berlin",
      points: 1
    },
    {
      id: "2",
      text: "Wie viele Planeten gibt es in unserem Sonnensystem?",
      answer: "8 Planeten",
      points: 2
    },
    {
      id: "3",
      text: "Wer hat die Formel E=mc² entwickelt?",
      answer: "Albert Einstein",
      points: 3
    }
  ],

  currentQuestionIndex: 0,
  gameMode: "thinking-time",

  timeSettings: {
    thinkingTimeSeconds: 30,
    answerTimeSeconds: 5
  },

  difficulty: "medium",
  autoShowAnswer: true,
  categories: ["Geografie", "Wissenschaft", "Geschichte", "Sport", "Kultur"],

  // Handlebars Rules Template
  rules: `
Spiel: {{ gameName }}

### Ziel:
Das Ziel des Spiels "{{ gameName }}" ist es, durch Wissen und schnelles Denken die meisten Punkte zu sammeln.

### Spielablauf:
Der Spielleiter stellt Fragen aus verschiedenen Kategorien. Die Teams haben Zeit zum Nachdenken und müssen dann ihre Antworten geben.

**Punktevergabe:**
- Richtige Antwort: +1 bis +3 Punkte (je nach Schwierigkeit)
- Falsche Antwort: 0 Punkte
- Maximum: {{ maxPoints }} {{#if maxPoints.equalOne}}Punkt{{else}}Punkte{{/if}}

**Zeit-Einstellungen:**
- Denkzeit: {{ timeSettings.thinkingTimeSeconds }} Sekunden
- Antwortzeit: {{ timeSettings.answerTimeSeconds }} Sekunden

**Verfügbare Kategorien:** {{ categories }}

### Spielmodi:
1. **Rapid Fire**: Schnelle Fragen ohne Denkzeit
2. **Thinking Time**: Fragen mit Bedenkzeit
3. **Buzzer Mode**: Erster buzzert, erster antwortet

Viel Erfolg beim Quiz!
  `
};
