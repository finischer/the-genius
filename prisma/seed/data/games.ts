import { v4 as uuidv4 } from "uuid";

// ─── Flaggen ────────────────────────────────────────────────────────────────
export function createFlaggenGame(overrides?: object) {
  return {
    identifier: "flaggen",
    name: "Flaggen",
    modes: ["DUELL", "TEAM"],
    maxPoints: 7,
    scorebarMode: "circle",
    rules: "",
    countries: ["de", "fr", "es", "it", "pt", "nl", "be", "at", "ch", "pl"],
    qIndex: 0,
    display: { answer: false, country: false },
    ...overrides
  };
}

// ─── Merken ──────────────────────────────────────────────────────────────────
export function createMerkenGame(overrides?: object) {
  const makeCard = (id: string, front: string) => ({
    id,
    front,
    isFlipped: false,
    isMatched: false
  });
  return {
    identifier: "merken",
    name: "Merken",
    modes: ["DUELL", "TEAM"],
    maxPoints: 7,
    scorebarMode: "circle",
    rules: "",
    allCardsFlipped: false,
    cards: [
      makeCard(uuidv4(), "Hund"),
      makeCard(uuidv4(), "Katze"),
      makeCard(uuidv4(), "Haus"),
      makeCard(uuidv4(), "Auto"),
      makeCard(uuidv4(), "Baum"),
      makeCard(uuidv4(), "Blume")
    ],
    openCards: [],
    timerState: { isActive: false, timeToThinkSeconds: 60 },
    ...overrides
  };
}

// ─── Geheimwörter ────────────────────────────────────────────────────────────
export function createGeheimwoerterGame(overrides?: object) {
  const makeQuestion = (q: string, answer: string) => ({
    id: uuidv4(),
    question: q,
    answer
  });
  return {
    identifier: "geheimwoerter",
    name: "Geheimwörter",
    modes: ["DUELL", "TEAM"],
    maxPoints: 7,
    scorebarMode: "circle",
    rules: "",
    answer: "",
    questions: [
      makeQuestion("Automarke aus Deutschland", "BMW"),
      makeQuestion("Hauptstadt von Frankreich", "Paris"),
      makeQuestion("Fluss durch Wien", "Donau"),
      makeQuestion("Planet neben der Erde", "Mars"),
      makeQuestion("Tier mit Rüssel", "Elefant"),
      makeQuestion("Farbe des Himmels", "Blau"),
      makeQuestion("Instrument mit Tasten", "Klavier")
    ],
    codeList: [],
    display: { answer: false, codeList: false, words: false },
    qIndex: 0,
    ...overrides
  };
}

// ─── Du Sagst ────────────────────────────────────────────────────────────────
export function createDuSagstGame(overrides?: object) {
  const makeBoxState = (answerTheQuestion: boolean) => ({
    id: uuidv4(),
    answerIndex: -1,
    answerTheQuestion,
    showAnswer: false,
    submitted: true
  });
  const makeTeamState = () => ({
    id: uuidv4(),
    boxStates: [makeBoxState(true), makeBoxState(false)]
  });
  const makeQuestion = (q: string, answers: string[]) => ({
    id: uuidv4(),
    question: q,
    answers
  });
  return {
    identifier: "duSagst",
    name: "Du Sagst...",
    modes: ["TEAM"],
    maxPoints: 6,
    scorebarMode: "circle",
    rules: "",
    qIndex: 0,
    questions: [
      makeQuestion("Etwas das fliegt", ["Vogel", "Flugzeug", "Schmetterling", "Hubschrauber", "Rakete", "Drachen"]),
      makeQuestion("Sportarten mit Ball", ["Fußball", "Basketball", "Tennis", "Volleyball", "Rugby", "Handball"]),
      makeQuestion("Dinge in der Küche", ["Messer", "Pfanne", "Löffel", "Herd", "Kühlschrank", "Teller"]),
      makeQuestion("Länder in Europa", ["Deutschland", "Frankreich", "Spanien", "Italien", "Polen", "Portugal"]),
      makeQuestion("Dinge im Büro", ["Stift", "Drucker", "Tastatur", "Bildschirm", "Maus", "Ordner"]),
      makeQuestion("Tiere im Wald", ["Fuchs", "Reh", "Wolf", "Wildschwein", "Dachs", "Eichhörnchen"])
    ],
    timeToThinkSeconds: 30,
    timer: { id: null, active: false, currSeconds: 0 },
    teamStates: { teamOne: makeTeamState(), teamTwo: makeTeamState() },
    ...overrides
  };
}

// ─── Zehn Setzen ─────────────────────────────────────────────────────────────
export function createZehnSetzenGame(overrides?: object) {
  const makeQuestion = (q: string, answers: [string, string, string, string], correct: number) => ({
    id: uuidv4(),
    question: q,
    answers,
    correctAnswerIndex: correct
  });
  return {
    identifier: "zehnSetzen",
    name: "Zehn Setzen",
    modes: ["DUELL", "TEAM"],
    maxPoints: 10,
    scorebarMode: "number",
    rules: "",
    questions: [
      makeQuestion("Was ist die Hauptstadt von Australien?", ["Sydney", "Melbourne", "Canberra", "Brisbane"], 2),
      makeQuestion("Welches Element hat das Symbol 'Au'?", ["Silber", "Gold", "Kupfer", "Eisen"], 1),
      makeQuestion("Wie viele Planeten hat unser Sonnensystem?", ["7", "8", "9", "10"], 1),
      makeQuestion("Wer schrieb 'Faust'?", ["Schiller", "Brecht", "Goethe", "Kafka"], 2),
      makeQuestion("Was ist die längste Fluss der Welt?", ["Amazonas", "Nil", "Jangtse", "Mississippi"], 1),
      makeQuestion("In welchem Jahr fiel die Berliner Mauer?", ["1987", "1988", "1989", "1990"], 2)
    ],
    qIndex: 0,
    teamStates: {
      t1: { id: "t1", answerScores: [0, 0, 0, 0], submitted: false },
      t2: { id: "t2", answerScores: [0, 0, 0, 0], submitted: false }
    },
    display: {
      question: false,
      answers: [],
      correctAnswer: false,
      teamScores: { t1: false, t2: false }
    },
    ...overrides
  };
}

// ─── Fragenhagel ─────────────────────────────────────────────────────────────
export function createFragenhagelGame(overrides?: object) {
  const makeQuestion = (q: string, a: string) => ({ id: uuidv4(), question: q, answer: a });
  return {
    identifier: "fragenhagel",
    name: "Fragenhagel",
    modes: ["DUELL"],
    maxPoints: 20,
    scorebarMode: "number",
    rules: "",
    questions: [
      makeQuestion("Wie heißt die Hauptstadt von Japan?", "Tokio"),
      makeQuestion("Welches Tier ist das größte Landtier?", "Elefant"),
      makeQuestion("Wie viel Seiten hat ein Würfel?", "6"),
      makeQuestion("Was ist H2O?", "Wasser"),
      makeQuestion("Welche Farbe hat eine Banane?", "Gelb"),
      makeQuestion("Wer war der erste Mensch auf dem Mond?", "Neil Armstrong"),
      makeQuestion("Wie viele Kontinente gibt es?", "7"),
      makeQuestion("Was ist die schnellste Katze der Welt?", "Gepard"),
      makeQuestion("Welches Land hat die meisten Einwohner?", "China"),
      makeQuestion("Was ist die kleinste Primzahl?", "2"),
      makeQuestion("Aus wie vielen Buchstaben besteht das deutsche Alphabet?", "26"),
      makeQuestion("Wie heißt der höchste Berg der Welt?", "Mount Everest")
    ],
    configuredIntervals: [
      { id: "1", label: "Intervall 1", start: 25, end: 30 },
      { id: "2", label: "Intervall 2", start: 32, end: 37 },
      { id: "3", label: "Intervall 3", start: 41, end: 46 }
    ],
    qIndex: 0,
    currentScore: 0,
    activePlayerId: null,
    buzzerCount: 0,
    timerState: { isActive: false, seconds: 0 },
    intervalState: { start: -1, end: -1 },
    ...overrides
  };
}

// ─── Referat Bingo ───────────────────────────────────────────────────────────
export function createReferatBingoGame(overrides?: object) {
  const makeNotefield = () => ({
    answers: new Array(9).fill(""),
    selectedAnswers: [],
    submitted: false
  });
  const makeTopic = (t: string) => ({ id: uuidv4(), topic: t });
  return {
    identifier: "referatBingo",
    name: "Referat Bingo",
    modes: ["TEAM"],
    maxPoints: 999,
    scorebarMode: "number",
    rules: "",
    topics: [
      makeTopic("Klimawandel"),
      makeTopic("Künstliche Intelligenz"),
      makeTopic("Zweiter Weltkrieg"),
      makeTopic("Die Römer"),
      makeTopic("Elektroautos"),
      makeTopic("Das Sonnensystem")
    ],
    qIndex: 0,
    presenter: { id: "", name: "", isPresenting: false },
    notefields: { teamOne: makeNotefield(), teamTwo: makeNotefield() },
    display: {
      notefields: { teamOne: false, teamTwo: false },
      topic: false
    },
    ...overrides
  };
}

// ─── Set ─────────────────────────────────────────────────────────────────────
export function createSetGame(overrides?: object) {
  return {
    identifier: "set",
    name: "Set",
    modes: ["DUELL", "TEAM"],
    maxPoints: 7,
    scorebarMode: "circle",
    rules: "",
    questions: [],
    openedCards: [],
    markedCards: [],
    markedCardsState: "marked",
    qIndex: 0,
    display: { cards: false, markedCards: false },
    ...overrides
  };
}
