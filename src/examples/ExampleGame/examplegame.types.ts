/**
 * Beispiel Spiel - Types Definition
 *
 * Hier definieren wir alle spiel-spezifischen Interfaces und Types
 */

export interface IExampleGameQuestion {
  id: string;
  text: string;
  answer: string;
  points: number;
}

export interface IExampleGameState {
  // Fragen für das Spiel
  questions: IExampleGameQuestion[];

  // Aktuelle Frage Index
  currentQuestionIndex: number;

  // Spielmodus
  gameMode: "rapid-fire" | "thinking-time" | "buzzer";

  // Zeit-Einstellungen
  timeSettings: {
    thinkingTimeSeconds: number;
    answerTimeSeconds: number;
  };

  // Schwierigkeitsgrad
  difficulty: "easy" | "medium" | "hard";

  // Zeige Antwort automatisch nach Zeit
  autoShowAnswer: boolean;

  // Kategorien
  categories: string[];
}
