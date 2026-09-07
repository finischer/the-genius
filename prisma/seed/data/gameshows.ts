import {
  createDuSagstGame,
  createFlaggenGame,
  createFragenhagelGame,
  createGeheimwoerterGame,
  createMerkenGame,
  createReferatBingoGame,
  createSetGame,
  createZehnSetzenGame
} from "./games";

export interface SeedGameshow {
  creatorEmail: string;
  name: string;
  description: string;
  visibility: "PUBLIC" | "PRIVATE";
  difficulty: "VERY_EASY" | "EASY" | "MEDIUM" | "HARD" | "VERY_HARD";
  isFavorite: boolean;
  games: object[];
}

export function createGameshowSeed(
  overrides: Omit<SeedGameshow, "games"> & { games?: object[] }
): SeedGameshow {
  return { games: [], ...overrides };
}

// ─── Niklas (Admin / local dev user) ────────────────────────────────────────
const NIKLAS_GAMESHOWS: SeedGameshow[] = [
  createGameshowSeed({
    creatorEmail: "walter@thegenius.local",
    name: "Die ultimative Wissensshow",
    description: "Von Flaggen bis Fragenhagel – ein Mix aus allem.",
    visibility: "PUBLIC", difficulty: "MEDIUM", isFavorite: true,
    games: [createFlaggenGame(), createFragenhagelGame(), createGeheimwoerterGame(), createZehnSetzenGame()]
  }),
  createGameshowSeed({
    creatorEmail: "walter@thegenius.local",
    name: "Teamshow Abend",
    description: "Perfekt für Teamspiele am Abend.",
    visibility: "PUBLIC", difficulty: "EASY", isFavorite: false,
    games: [createDuSagstGame(), createReferatBingoGame(), createSetGame(), createMerkenGame()]
  }),
  createGameshowSeed({
    creatorEmail: "walter@thegenius.local",
    name: "Flaggen Weltmeisterschaft",
    description: "Wer kennt die meisten Flaggen der Welt?",
    visibility: "PUBLIC", difficulty: "HARD", isFavorite: true,
    games: [createFlaggenGame({ maxPoints: 15 }), createFlaggenGame({ name: "Flaggen Halbfinale", maxPoints: 12 }), createFlaggenGame({ name: "Flaggen Finale", maxPoints: 10 })]
  }),
  createGameshowSeed({
    creatorEmail: "walter@thegenius.local",
    name: "Fragenhagel Spezial",
    description: "Nur das Beste aus dem Fragenhagel.",
    visibility: "PUBLIC", difficulty: "HARD", isFavorite: false,
    games: [createFragenhagelGame({ maxPoints: 30 }), createFragenhagelGame({ name: "Fragenhagel Runde 2", maxPoints: 25 })]
  }),
  createGameshowSeed({
    creatorEmail: "walter@thegenius.local",
    name: "Weihnachtsparty 2024",
    description: "Die perfekte Show für die Firmen-Weihnachtsfeier.",
    visibility: "PRIVATE", difficulty: "EASY", isFavorite: true,
    games: [createDuSagstGame(), createMerkenGame(), createReferatBingoGame(), createZehnSetzenGame()]
  }),
  createGameshowSeed({
    creatorEmail: "walter@thegenius.local",
    name: "Geheimwörter Challenge",
    description: "Teste dein Verschlüsselungs-Wissen.",
    visibility: "PUBLIC", difficulty: "MEDIUM", isFavorite: false,
    games: [createGeheimwoerterGame(), createGeheimwoerterGame({ name: "Geheimwörter Runde 2" }), createZehnSetzenGame()]
  }),
  createGameshowSeed({
    creatorEmail: "walter@thegenius.local",
    name: "Speed Round",
    description: "Kurze, schnelle Runden für zwischendurch.",
    visibility: "PUBLIC", difficulty: "VERY_EASY", isFavorite: false,
    games: [createFlaggenGame({ maxPoints: 5 }), createFragenhagelGame({ maxPoints: 10 }), createZehnSetzenGame({ maxPoints: 5 })]
  }),
  createGameshowSeed({
    creatorEmail: "walter@thegenius.local",
    name: "Dev Test Show",
    description: "Zum Testen neuer Features.",
    visibility: "PRIVATE", difficulty: "MEDIUM", isFavorite: false,
    games: [createFlaggenGame(), createDuSagstGame(), createSetGame()]
  }),
  createGameshowSeed({
    creatorEmail: "walter@thegenius.local",
    name: "Hardcore Geographie",
    description: "Für echte Geographie-Profis.",
    visibility: "PUBLIC", difficulty: "VERY_HARD", isFavorite: true,
    games: [createFlaggenGame({ maxPoints: 20 }), createGeheimwoerterGame(), createZehnSetzenGame({ maxPoints: 15 }), createFragenhagelGame({ maxPoints: 30 })]
  }),
  createGameshowSeed({
    creatorEmail: "walter@thegenius.local",
    name: "Gedächtnisshow",
    description: "Teste dein Gedächtnis mit Merken und Set.",
    visibility: "PUBLIC", difficulty: "MEDIUM", isFavorite: false,
    games: [createMerkenGame(), createSetGame(), createMerkenGame({ name: "Merken Runde 2" })]
  }),
  createGameshowSeed({
    creatorEmail: "walter@thegenius.local",
    name: "Freunde & Familie Show",
    description: "Für alle Altersgruppen geeignet.",
    visibility: "PRIVATE", difficulty: "VERY_EASY", isFavorite: true,
    games: [createDuSagstGame({ maxPoints: 4 }), createReferatBingoGame(), createMerkenGame()]
  }),
  createGameshowSeed({
    creatorEmail: "walter@thegenius.local",
    name: "Silvester Special",
    description: "Der perfekte Jahresabschluss.",
    visibility: "PUBLIC", difficulty: "EASY", isFavorite: false,
    games: [createDuSagstGame(), createFragenhagelGame(), createFlaggenGame(), createZehnSetzenGame(), createSetGame()]
  }),
  createGameshowSeed({
    creatorEmail: "walter@thegenius.local",
    name: "Mega Wissensmarathon",
    description: "Alle 8 Spiele in einer riesigen Show.",
    visibility: "PUBLIC", difficulty: "HARD", isFavorite: true,
    games: [
      createFlaggenGame(), createMerkenGame(), createGeheimwoerterGame(),
      createSetGame(), createDuSagstGame(), createReferatBingoGame(),
      createZehnSetzenGame(), createFragenhagelGame()
    ]
  }),
  createGameshowSeed({
    creatorEmail: "walter@thegenius.local",
    name: "Backup Show",
    description: "Immer bereit für spontane Runden.",
    visibility: "PRIVATE", difficulty: "EASY", isFavorite: false,
    games: [createFlaggenGame(), createZehnSetzenGame(), createDuSagstGame()]
  }),
  createGameshowSeed({
    creatorEmail: "walter@thegenius.local",
    name: "Schulklassen Show",
    description: "Ideal für den Unterricht.",
    visibility: "PUBLIC", difficulty: "VERY_EASY", isFavorite: false,
    games: [createReferatBingoGame(), createMerkenGame(), createSetGame(), createDuSagstGame({ maxPoints: 3 })]
  })
];

// ─── Other named users ───────────────────────────────────────────────────────
const NAMED_USER_GAMESHOWS: SeedGameshow[] = [
  createGameshowSeed({
    creatorEmail: "max@thegenius.local",
    name: "Max's Hardcore Quiz",
    description: "Nichts für Anfänger.",
    visibility: "PUBLIC", difficulty: "VERY_HARD", isFavorite: true,
    games: [createZehnSetzenGame({ maxPoints: 15 }), createFragenhagelGame({ maxPoints: 30 }), createGeheimwoerterGame(), createFlaggenGame({ maxPoints: 10 })]
  }),
  createGameshowSeed({
    creatorEmail: "max@thegenius.local",
    name: "Gemütliche Runde",
    description: "Entspannter Spielabend mit Freunden.",
    visibility: "PUBLIC", difficulty: "EASY", isFavorite: false,
    games: [createDuSagstGame(), createMerkenGame(), createSetGame(), createReferatBingoGame()]
  }),
  createGameshowSeed({
    creatorEmail: "max@thegenius.local",
    name: "Mein Testlauf",
    description: "Privat zum Testen neuer Spiele.",
    visibility: "PRIVATE", difficulty: "MEDIUM", isFavorite: false,
    games: [createFragenhagelGame(), createZehnSetzenGame()]
  }),
  createGameshowSeed({
    creatorEmail: "sophie@thegenius.local",
    name: "Geographie Meisterin",
    description: "Länder, Flaggen, Hauptstädte – Sophies Spezialgebiet.",
    visibility: "PUBLIC", difficulty: "HARD", isFavorite: true,
    games: [createFlaggenGame({ maxPoints: 12 }), createGeheimwoerterGame(), createFragenhagelGame(), createZehnSetzenGame()]
  }),
  createGameshowSeed({
    creatorEmail: "sophie@thegenius.local",
    name: "Schüler-Spaß",
    description: "Für die Klasse – einfach und witzig.",
    visibility: "PUBLIC", difficulty: "VERY_EASY", isFavorite: false,
    games: [createReferatBingoGame(), createDuSagstGame({ maxPoints: 4 }), createMerkenGame()]
  }),
  createGameshowSeed({
    creatorEmail: "jonas@thegenius.local",
    name: "Jonas' Hausparty-Show",
    description: "Für den nächsten Spieleabend.",
    visibility: "PRIVATE", difficulty: "MEDIUM", isFavorite: false,
    games: [createSetGame(), createDuSagstGame(), createFragenhagelGame(), createMerkenGame()]
  }),
  createGameshowSeed({
    creatorEmail: "jonas@thegenius.local",
    name: "Klassiker-Mix",
    description: "Die besten Spiele in einer Show.",
    visibility: "PUBLIC", difficulty: "MEDIUM", isFavorite: true,
    games: [createFlaggenGame(), createGeheimwoerterGame(), createZehnSetzenGame(), createDuSagstGame(), createReferatBingoGame()]
  }),
  createGameshowSeed({
    creatorEmail: "laura@thegenius.local",
    name: "Lauras Lieblingsshow",
    description: "Kurze Runden, viel Spaß.",
    visibility: "PUBLIC", difficulty: "EASY", isFavorite: true,
    games: [createMerkenGame(), createSetGame(), createDuSagstGame()]
  }),
  createGameshowSeed({
    creatorEmail: "laura@thegenius.local",
    name: "Fragenhagel Spezial",
    description: "Nur der echte Fragenhagel zählt.",
    visibility: "PRIVATE", difficulty: "HARD", isFavorite: false,
    games: [createFragenhagelGame({ maxPoints: 25 }), createFragenhagelGame({ name: "Fragenhagel Runde 2", maxPoints: 25 })]
  }),
  createGameshowSeed({
    creatorEmail: "tim@thegenius.local",
    name: "Tim's Allround Show",
    description: "Ein bisschen von allem.",
    visibility: "PUBLIC", difficulty: "MEDIUM", isFavorite: true,
    games: [createFlaggenGame(), createDuSagstGame(), createZehnSetzenGame(), createMerkenGame()]
  }),
  createGameshowSeed({
    creatorEmail: "anna@thegenius.local",
    name: "Anna's Teamshow",
    description: "Nur Teamspiele für den großen Abend.",
    visibility: "PUBLIC", difficulty: "EASY", isFavorite: true,
    games: [createDuSagstGame(), createReferatBingoGame(), createSetGame()]
  }),
  createGameshowSeed({
    creatorEmail: "felix@thegenius.local",
    name: "Felix Herausforderung",
    description: "Für alle die sich etwas trauen.",
    visibility: "PUBLIC", difficulty: "VERY_HARD", isFavorite: false,
    games: [createFragenhagelGame({ maxPoints: 35 }), createFlaggenGame({ maxPoints: 20 }), createZehnSetzenGame({ maxPoints: 15 })]
  }),
  createGameshowSeed({
    creatorEmail: "lena@thegenius.local",
    name: "Lenas Wissensshow",
    description: "Bildung macht Spaß!",
    visibility: "PUBLIC", difficulty: "MEDIUM", isFavorite: true,
    games: [createGeheimwoerterGame(), createZehnSetzenGame(), createFragenhagelGame(), createFlaggenGame()]
  }),
  createGameshowSeed({
    creatorEmail: "david@thegenius.local",
    name: "Davids Quickfire",
    description: "Schnell, schneller, David.",
    visibility: "PUBLIC", difficulty: "HARD", isFavorite: false,
    games: [createFragenhagelGame({ maxPoints: 20 }), createZehnSetzenGame(), createFlaggenGame({ maxPoints: 8 })]
  })
];

// ─── Generated community gameshows ──────────────────────────────────────────
const COMMUNITY_TEMPLATES = [
  { name: "Meine erste Show", description: "Einfach mal ausprobiert.", difficulty: "EASY" as const, games: () => [createFlaggenGame(), createZehnSetzenGame()] },
  { name: "Quiz Nacht", description: "Für den nächsten Spieleabend.", difficulty: "MEDIUM" as const, games: () => [createFragenhagelGame(), createDuSagstGame(), createMerkenGame()] },
  { name: "Geheime Runde", description: "Nur für meine Freunde.", difficulty: "MEDIUM" as const, games: () => [createGeheimwoerterGame(), createSetGame()] },
  { name: "Favoriten Mix", description: "Meine Lieblingsspiele.", difficulty: "EASY" as const, games: () => [createDuSagstGame(), createReferatBingoGame()] },
  { name: "Hardcore Edition", description: "Nur für die Mutigen.", difficulty: "VERY_HARD" as const, games: () => [createFragenhagelGame({ maxPoints: 25 }), createFlaggenGame({ maxPoints: 15 }), createZehnSetzenGame({ maxPoints: 15 })] }
];

// Community users match the generated emails from users.ts
const FIRST_NAMES = ["lukas", "emma", "noah", "mia", "leon", "hannah", "finn", "lena", "paul", "lea", "ben", "julia", "elias", "sara", "moritz", "lara", "luis", "nina", "jan", "clara", "tom", "marie", "nico", "lisa", "simon", "katharina", "kevin", "sarah", "daniel", "leonie", "tobias", "amelie", "patrick", "charlotte", "michael", "franziska", "stefan", "johanna", "sebastian", "elena", "markus", "viktoria", "andreas", "alina", "florian", "nathalie", "christian", "isabel", "alexander", "melissa"];
const LAST_NAMES = ["müller", "schmidt", "schneider", "fischer", "weber", "meyer", "wagner", "becker", "schulz", "hoffmann", "koch", "bauer", "richter", "klein", "wolf", "schröder", "neumann", "schwarz", "zimmermann", "braun", "krüger", "hofmann", "hartmann", "lange", "schmitt", "werner", "krause", "meier", "lehmann", "schmid"];

function generateCommunityGameshows(): SeedGameshow[] {
  const shows: SeedGameshow[] = [];

  for (let i = 0; i < 100; i++) {
    const firstName = FIRST_NAMES[i % FIRST_NAMES.length]!;
    const lastName = LAST_NAMES[i % LAST_NAMES.length]!;
    const suffix = Math.floor(i / FIRST_NAMES.length);
    const username = `${firstName}${lastName}${suffix > 0 ? suffix : ""}`;
    const email = `${username}@thegenius.local`;

    const template = COMMUNITY_TEMPLATES[i % COMMUNITY_TEMPLATES.length]!;
    const visibility = i % 3 === 0 ? "PUBLIC" : "PRIVATE";

    shows.push(
      createGameshowSeed({
        creatorEmail: email,
        name: template.name,
        description: template.description,
        visibility,
        difficulty: template.difficulty,
        isFavorite: i % 4 === 0,
        games: template.games()
      })
    );
  }

  return shows;
}

export const SEED_GAMESHOWS: SeedGameshow[] = [
  ...NIKLAS_GAMESHOWS,
  ...NAMED_USER_GAMESHOWS,
  ...generateCommunityGameshows()
];
