import { v4 as uuidv4 } from "uuid";

// ─── Flaggen ─────────────────────────────────────────────────────────────────

const ALL_COUNTRIES = [
  { id: "de", country: "Deutschland", shortCode: "de" },
  { id: "fr", country: "Frankreich", shortCode: "fr" },
  { id: "es", country: "Spanien", shortCode: "es" },
  { id: "it", country: "Italien", shortCode: "it" },
  { id: "pt", country: "Portugal", shortCode: "pt" },
  { id: "nl", country: "Niederlande", shortCode: "nl" },
  { id: "be", country: "Belgien", shortCode: "be" },
  { id: "at", country: "Österreich", shortCode: "at" },
  { id: "ch", country: "Schweiz", shortCode: "ch" },
  { id: "pl", country: "Polen", shortCode: "pl" },
  { id: "se", country: "Schweden", shortCode: "se" },
  { id: "no", country: "Norwegen", shortCode: "no" },
  { id: "dk", country: "Dänemark", shortCode: "dk" },
  { id: "fi", country: "Finnland", shortCode: "fi" },
  { id: "ie", country: "Irland", shortCode: "ie" },
  { id: "gb", country: "Vereinigtes Königreich", shortCode: "gb" },
  { id: "us", country: "USA", shortCode: "us" },
  { id: "ca", country: "Kanada", shortCode: "ca" },
  { id: "au", country: "Australien", shortCode: "au" },
  { id: "jp", country: "Japan", shortCode: "jp" },
  { id: "cn", country: "China", shortCode: "cn" },
  { id: "in", country: "Indien", shortCode: "in" },
  { id: "br", country: "Brasilien", shortCode: "br" },
  { id: "ar", country: "Argentinien", shortCode: "ar" },
  { id: "mx", country: "Mexiko", shortCode: "mx" },
  { id: "za", country: "Südafrika", shortCode: "za" },
  { id: "eg", country: "Ägypten", shortCode: "eg" },
  { id: "ng", country: "Nigeria", shortCode: "ng" },
  { id: "ke", country: "Kenia", shortCode: "ke" },
  { id: "ma", country: "Marokko", shortCode: "ma" },
  { id: "ru", country: "Russland", shortCode: "ru" },
  { id: "tr", country: "Türkei", shortCode: "tr" },
  { id: "gr", country: "Griechenland", shortCode: "gr" },
  { id: "cz", country: "Tschechien", shortCode: "cz" },
  { id: "hu", country: "Ungarn", shortCode: "hu" },
  { id: "ro", country: "Rumänien", shortCode: "ro" },
  { id: "sk", country: "Slowakei", shortCode: "sk" },
  { id: "hr", country: "Kroatien", shortCode: "hr" },
  { id: "rs", country: "Serbien", shortCode: "rs" },
  { id: "bg", country: "Bulgarien", shortCode: "bg" },
  { id: "ua", country: "Ukraine", shortCode: "ua" },
  { id: "by", country: "Weißrussland", shortCode: "by" },
  { id: "lt", country: "Litauen", shortCode: "lt" },
  { id: "lv", country: "Lettland", shortCode: "lv" },
  { id: "ee", country: "Estland", shortCode: "ee" },
  { id: "kr", country: "Südkorea", shortCode: "kr" },
  { id: "th", country: "Thailand", shortCode: "th" },
  { id: "vn", country: "Vietnam", shortCode: "vn" },
  { id: "id", country: "Indonesien", shortCode: "id" },
  { id: "my", country: "Malaysia", shortCode: "my" },
  { id: "ph", country: "Philippinen", shortCode: "ph" },
  { id: "sg", country: "Singapur", shortCode: "sg" },
  { id: "nz", country: "Neuseeland", shortCode: "nz" },
  { id: "cl", country: "Chile", shortCode: "cl" },
  { id: "co", country: "Kolumbien", shortCode: "co" },
  { id: "pe", country: "Peru", shortCode: "pe" },
  { id: "ve", country: "Venezuela", shortCode: "ve" },
  { id: "uy", country: "Uruguay", shortCode: "uy" },
  { id: "bo", country: "Bolivien", shortCode: "bo" },
  { id: "py", country: "Paraguay", shortCode: "py" },
  { id: "ec", country: "Ecuador", shortCode: "ec" },
  { id: "gt", country: "Guatemala", shortCode: "gt" },
  { id: "cu", country: "Kuba", shortCode: "cu" },
  { id: "np", country: "Nepal", shortCode: "np" },
  { id: "pk", country: "Pakistan", shortCode: "pk" },
  { id: "bd", country: "Bangladesch", shortCode: "bd" },
  { id: "lk", country: "Sri Lanka", shortCode: "lk" },
  { id: "mm", country: "Myanmar", shortCode: "mm" },
  { id: "kh", country: "Kambodscha", shortCode: "kh" },
  { id: "mn", country: "Mongolei", shortCode: "mn" },
  { id: "kz", country: "Kasachstan", shortCode: "kz" },
  { id: "uz", country: "Usbekistan", shortCode: "uz" },
  { id: "ge", country: "Georgien", shortCode: "ge" },
  { id: "am", country: "Armenien", shortCode: "am" },
  { id: "az", country: "Aserbaidschan", shortCode: "az" },
  { id: "il", country: "Israel", shortCode: "il" },
  { id: "sa", country: "Saudi-Arabien", shortCode: "sa" },
  { id: "ae", country: "Vereinigte Arabische Emirate", shortCode: "ae" },
  { id: "iq", country: "Irak", shortCode: "iq" },
  { id: "ir", country: "Iran", shortCode: "ir" },
  { id: "jo", country: "Jordanien", shortCode: "jo" },
  { id: "lb", country: "Libanon", shortCode: "lb" },
  { id: "sy", country: "Syrien", shortCode: "sy" },
  { id: "cy", country: "Zypern", shortCode: "cy" },
  { id: "is", country: "Island", shortCode: "is" },
  { id: "lu", country: "Luxemburg", shortCode: "lu" },
  { id: "mt", country: "Malta", shortCode: "mt" },
  { id: "al", country: "Albanien", shortCode: "al" },
  { id: "mk", country: "Nordmazedonien", shortCode: "mk" },
  { id: "ba", country: "Bosnien und Herzegowina", shortCode: "ba" },
  { id: "me", country: "Montenegro", shortCode: "me" },
  { id: "si", country: "Slowenien", shortCode: "si" },
  { id: "md", country: "Moldau", shortCode: "md" },
  { id: "tn", country: "Tunesien", shortCode: "tn" },
  { id: "dz", country: "Algerien", shortCode: "dz" },
  { id: "ly", country: "Libyen", shortCode: "ly" },
  { id: "sd", country: "Sudan", shortCode: "sd" },
  { id: "et", country: "Äthiopien", shortCode: "et" },
  { id: "gh", country: "Ghana", shortCode: "gh" },
  { id: "ci", country: "Elfenbeinküste", shortCode: "ci" },
  { id: "cm", country: "Kamerun", shortCode: "cm" },
  { id: "tz", country: "Tansania", shortCode: "tz" },
  { id: "ug", country: "Uganda", shortCode: "ug" },
  { id: "mz", country: "Mosambik", shortCode: "mz" },
  { id: "zm", country: "Sambia", shortCode: "zm" },
  { id: "zw", country: "Simbabwe", shortCode: "zw" },
  { id: "bw", country: "Botswana", shortCode: "bw" },
  { id: "na", country: "Namibia", shortCode: "na" },
  { id: "fj", country: "Fidschi", shortCode: "fj" },
  { id: "pg", country: "Papua-Neuguinea", shortCode: "pg" },
  { id: "bt", country: "Bhutan", shortCode: "bt" },
  { id: "mv", country: "Malediven", shortCode: "mv" },
  { id: "bh", country: "Bahrain", shortCode: "bh" },
  { id: "kw", country: "Kuwait", shortCode: "kw" },
  { id: "om", country: "Oman", shortCode: "om" },
  { id: "qa", country: "Katar", shortCode: "qa" },
  { id: "ye", country: "Jemen", shortCode: "ye" }
];

// Preset country lists for different difficulty levels
const EASY_COUNTRIES = ALL_COUNTRIES.filter((c) =>
  ["de", "fr", "es", "it", "pt", "nl", "be", "at", "ch", "pl", "se", "no", "dk", "gb", "us", "ca", "au", "jp", "br", "ar"].includes(c.id)
);

const MEDIUM_COUNTRIES = ALL_COUNTRIES.filter((c) =>
  ["fi", "ie", "cn", "in", "mx", "za", "eg", "ru", "tr", "gr", "cz", "hu", "ro", "kr", "th", "cl", "co", "pe", "ma", "ng"].includes(c.id)
);

const HARD_COUNTRIES = ALL_COUNTRIES.filter((c) =>
  ["sk", "hr", "rs", "bg", "ua", "lt", "lv", "ee", "vn", "id", "my", "ph", "sg", "nz", "uy", "bo", "py", "ec", "np", "pk"].includes(c.id)
);

const EXPERT_COUNTRIES = ALL_COUNTRIES.filter((c) =>
  ["bd", "lk", "mm", "kh", "mn", "kz", "uz", "ge", "am", "az", "il", "sa", "ae", "jo", "cy", "is", "lu", "mt", "al", "mk"].includes(c.id)
);

export function createFlaggenGame(overrides?: object) {
  return {
    identifier: "flaggen",
    name: "Flaggen",
    modes: ["DUELL", "TEAM"],
    maxPoints: 7,
    scorebarMode: "circle",
    rules: "",
    countries: EASY_COUNTRIES,
    qIndex: 0,
    display: { answer: false, country: false },
    ...overrides
  };
}

export function createFlaggenGameMedium(overrides?: object) {
  return createFlaggenGame({
    countries: [...EASY_COUNTRIES, ...MEDIUM_COUNTRIES],
    maxPoints: 10,
    ...overrides
  });
}

export function createFlaggenGameHard(overrides?: object) {
  return createFlaggenGame({
    countries: [...MEDIUM_COUNTRIES, ...HARD_COUNTRIES],
    maxPoints: 12,
    ...overrides
  });
}

export function createFlaggenGameExpert(overrides?: object) {
  return createFlaggenGame({
    countries: ALL_COUNTRIES,
    maxPoints: 15,
    ...overrides
  });
}

// ─── Merken ──────────────────────────────────────────────────────────────────

export function createMerkenGame(overrides?: object) {
  return {
    identifier: "merken",
    name: "Merken",
    modes: ["DUELL", "TEAM"],
    maxPoints: 7,
    scorebarMode: "circle",
    rules: "",
    allCardsFlipped: false,
    cards: [
      "/icons/merken/1.png",
      "/icons/merken/2.png",
      "/icons/merken/3.png",
      "/icons/merken/4.png",
      "/icons/merken/5.png",
      "/icons/merken/6.png",
      "/icons/merken/7.png",
      "/icons/merken/8.png",
      "/icons/merken/9.png",
      "/icons/merken/10.png",
      "/icons/merken/11.png",
      "/icons/merken/12.png",
      "/icons/merken/13.png",
      "/icons/merken/14.png",
      "/icons/merken/15.png",
      "/icons/merken/16.png",
      "/icons/merken/17.png",
      "/icons/merken/18.png",
      "/icons/merken/19.png",
      "/icons/merken/20.png",
      "/icons/merken/21.png",
      "/icons/merken/22.png",
      "/icons/merken/23.png",
      "/icons/merken/24.png"
    ],
    openCards: [],
    timerState: { isActive: false, timeToThinkSeconds: 60 },
    ...overrides
  };
}

// ─── Geheimwörter ────────────────────────────────────────────────────────────

const GEHEIMWOERTER_CODE_LIST = [
  { letter: "A", category: "Automarke" },
  { letter: "B", category: "Beruf" },
  { letter: "C", category: "Chemisches Element" },
  { letter: "D", category: "Deutsche Stadt" },
  { letter: "E", category: "Essensgericht" },
  { letter: "F", category: "Fluss" },
  { letter: "G", category: "Gebirge" },
  { letter: "H", category: "Haustier" },
  { letter: "I", category: "Insel" },
  { letter: "J", category: "Kleidungsstück" },
  { letter: "K", category: "Körperteil" },
  { letter: "L", category: "Land" },
  { letter: "M", category: "Meer" },
  { letter: "N", category: "Name (weiblich)" },
  { letter: "O", category: "Obst" },
  { letter: "P", category: "Planet" },
  { letter: "R", category: "Religion" },
  { letter: "S", category: "Sportart" },
  { letter: "T", category: "Tanzstil" },
  { letter: "U", category: "Uhrzeit" },
  { letter: "V", category: "Vulkan" },
  { letter: "W", category: "Werkzeug" },
  { letter: "Z", category: "Zahl" }
];

const GEHEIMWOERTER_QUESTIONS = [
  {
    id: "gw00",
    answer: "Haus",
    words: [
      { word: "Labrador", category: "Haustier" },
      { word: "Ferrari", category: "Automarke" },
      { word: "Mitternacht", category: "Uhrzeit" },
      { word: "Bogenschießen", category: "Sportart" }
    ]
  },
  {
    id: "gw01",
    answer: "Flamingo",
    words: [
      { word: "Mississippi", category: "Fluss" },
      { word: "Mongolei", category: "Land" },
      { word: "Lamborghini", category: "Automarke" },
      { word: "Karibisches Meer", category: "Meer" },
      { word: "Mallorca", category: "Insel" },
      { word: "Cleopatra", category: "Name (weiblich)" },
      { word: "Himalaya", category: "Gebirge" },
      { word: "Maracuja", category: "Obst" }
    ]
  },
  {
    id: "gw02",
    answer: "Piranha",
    words: [
      { word: "Jupiter", category: "Planet" },
      { word: "Madagaskar", category: "Insel" },
      { word: "Buddhismus", category: "Religion" },
      { word: "Bugatti", category: "Automarke" },
      { word: "Hildegard", category: "Name (weiblich)" },
      { word: "Perserkatze", category: "Haustier" },
      { word: "Maserati", category: "Automarke" }
    ]
  },
  {
    id: "gw03",
    answer: "Domino",
    words: [
      { word: "Heidelberg", category: "Deutsche Stadt" },
      { word: "Kumquat", category: "Obst" },
      { word: "Korallenmeer", category: "Meer" },
      { word: "Neuseeland", category: "Insel" },
      { word: "Brunhilde", category: "Name (weiblich)" },
      { word: "Papaya", category: "Obst" }
    ]
  },
  {
    id: "gw04",
    answer: "Bilanz",
    words: [
      { word: "Zahnarzt", category: "Beruf" },
      { word: "Sri Lanka", category: "Insel" },
      { word: "Paraguay", category: "Land" },
      { word: "Rolls-Royce", category: "Automarke" },
      { word: "Sieglinde", category: "Name (weiblich)" },
      { word: "Sieben", category: "Zahl" }
    ]
  },
  {
    id: "gw05",
    answer: "Gondel",
    words: [
      { word: "Rocky Mountains", category: "Gebirge" },
      { word: "Litschi", category: "Obst" },
      { word: "Walpurga", category: "Name (weiblich)" },
      { word: "Freiburg", category: "Deutsche Stadt" },
      { word: "Schnitzel", category: "Essensgericht" },
      { word: "Tadschikistan", category: "Land" }
    ]
  },
  {
    id: "gw06",
    answer: "Wolken",
    words: [
      { word: "Säge", category: "Werkzeug" },
      { word: "Granatapfel", category: "Obst" },
      { word: "Suriname", category: "Land" },
      { word: "Milz", category: "Körperteil" },
      { word: "Spaghetti", category: "Essensgericht" },
      { word: "Mathilda", category: "Name (weiblich)" }
    ]
  },
  {
    id: "gw07",
    answer: "Safari",
    words: [
      { word: "Curling", category: "Sportart" },
      { word: "Bentley", category: "Automarke" },
      { word: "Amazonas", category: "Fluss" },
      { word: "Hinduismus", category: "Religion" },
      { word: "Kuba", category: "Insel" }
    ]
  },
  {
    id: "gw08",
    answer: "Pinguin",
    words: [
      { word: "Saturn", category: "Planet" },
      { word: "Sizilien", category: "Insel" },
      { word: "Roswitha", category: "Name (weiblich)" },
      { word: "Anden", category: "Gebirge" },
      { word: "Mittagsstunde", category: "Uhrzeit" },
      { word: "Sardinien", category: "Insel" }
    ]
  },
  {
    id: "gw09",
    answer: "Kapsel",
    words: [
      { word: "Schienbein", category: "Körperteil" },
      { word: "Koenigsegg", category: "Automarke" },
      { word: "Neptun", category: "Planet" },
      { word: "Fechten", category: "Sportart" },
      { word: "Döner", category: "Essensgericht" },
      { word: "Bhutan", category: "Land" }
    ]
  },
  {
    id: "gw10",
    answer: "Klavier",
    words: [
      { word: "Ohrläppchen", category: "Körperteil" },
      { word: "Eritrea", category: "Land" },
      { word: "Stromboli", category: "Vulkan" },
      { word: "Bali", category: "Insel" },
      { word: "Currywurst", category: "Essensgericht" },
      { word: "Judentum", category: "Religion" }
    ]
  },
  {
    id: "gw11",
    answer: "Bolero",
    words: [
      { word: "Feuerwehrmann", category: "Beruf" },
      { word: "Sternfrucht", category: "Obst" },
      { word: "Kiribati", category: "Land" },
      { word: "Paella", category: "Essensgericht" },
      { word: "Sikhismus", category: "Religion" },
      { word: "Kaktusfeige", category: "Obst" }
    ]
  },
  {
    id: "gw12",
    answer: "Portugal",
    words: [
      { word: "Uranus", category: "Planet" },
      { word: "Jackfrucht", category: "Obst" },
      { word: "Flamenco", category: "Tanzstil" },
      { word: "Abenddämmerung", category: "Uhrzeit" },
      { word: "Alpen", category: "Gebirge" },
      { word: "Vanuatu", category: "Land" }
    ]
  },
  {
    id: "gw13",
    answer: "Karneval",
    words: [
      { word: "Schläfe", category: "Körperteil" },
      { word: "Bugatti", category: "Automarke" },
      { word: "Jainismus", category: "Religion" },
      { word: "Sushi", category: "Essensgericht" },
      { word: "Pinatubo", category: "Vulkan" }
    ]
  },
  {
    id: "gw14",
    answer: "Turnier",
    words: [
      { word: "Tuba", category: "Werkzeug" },
      { word: "Tasmanien", category: "Insel" },
      { word: "Trampolinturnen", category: "Sportart" },
      { word: "Tundra", category: "Land" },
      { word: "Tango", category: "Tanzstil" }
    ]
  },
  {
    id: "gw15",
    answer: "Labyrinth",
    words: [
      { word: "Lamas", category: "Haustier" },
      { word: "Lappland", category: "Land" },
      { word: "Lachs", category: "Essensgericht" },
      { word: "Lausanne", category: "Deutsche Stadt" },
      { word: "Leichtathletik", category: "Sportart" }
    ]
  }
];

export function createGeheimwoerterGame(overrides?: object) {
  return {
    identifier: "geheimwoerter",
    name: "Geheimwörter",
    modes: ["DUELL", "TEAM"],
    maxPoints: 7,
    scorebarMode: "circle",
    rules: "",
    answer: "",
    codeList: GEHEIMWOERTER_CODE_LIST,
    questions: GEHEIMWOERTER_QUESTIONS,
    display: { answer: false, codeList: false, words: false },
    qIndex: 0,
    ...overrides
  };
}

// ─── Du Sagst ────────────────────────────────────────────────────────────────

const DU_SAGST_QUESTIONS = [
  {
    id: "ds01",
    question: "Was hältst du lieber als Haustier?",
    answers: [
      { id: "ds01a1", text: "Hund" },
      { id: "ds01a2", text: "Katze" },
      { id: "ds01a3", text: "Hamster" },
      { id: "ds01a4", text: "Fisch" }
    ]
  },
  {
    id: "ds02",
    question: "Was trinkst du morgens am liebsten?",
    answers: [
      { id: "ds02a1", text: "Kaffee" },
      { id: "ds02a2", text: "Tee" },
      { id: "ds02a3", text: "Orangensaft" },
      { id: "ds02a4", text: "Wasser" }
    ]
  },
  {
    id: "ds03",
    question: "Was machst du als erstes nach dem Aufwachen?",
    answers: [
      { id: "ds03a1", text: "Handy checken" },
      { id: "ds03a2", text: "Aufstehen" },
      { id: "ds03a3", text: "Duschen" },
      { id: "ds03a4", text: "Frühstücken" }
    ]
  },
  {
    id: "ds04",
    question: "Welches Verkehrsmittel nutzt du am meisten?",
    answers: [
      { id: "ds04a1", text: "Auto" },
      { id: "ds04a2", text: "Fahrrad" },
      { id: "ds04a3", text: "Bus oder Bahn" },
      { id: "ds04a4", text: "Zu Fuß" }
    ]
  },
  {
    id: "ds05",
    question: "Was isst du am liebsten auf der Pizza?",
    answers: [
      { id: "ds05a1", text: "Salami" },
      { id: "ds05a2", text: "Margherita" },
      { id: "ds05a3", text: "Thunfisch" },
      { id: "ds05a4", text: "Hawaii" }
    ]
  },
  {
    id: "ds06",
    question: "Welche Jahreszeit magst du am liebsten?",
    answers: [
      { id: "ds06a1", text: "Frühling" },
      { id: "ds06a2", text: "Sommer" },
      { id: "ds06a3", text: "Herbst" },
      { id: "ds06a4", text: "Winter" }
    ]
  },
  {
    id: "ds07",
    question: "Wo verbringst du am liebsten Urlaub?",
    answers: [
      { id: "ds07a1", text: "Strand" },
      { id: "ds07a2", text: "Berge" },
      { id: "ds07a3", text: "Stadt" },
      { id: "ds07a4", text: "Zuhause bleiben" }
    ]
  },
  {
    id: "ds08",
    question: "Was machst du am Wochenende am liebsten?",
    answers: [
      { id: "ds08a1", text: "Freunde treffen" },
      { id: "ds08a2", text: "Ausschlafen" },
      { id: "ds08a3", text: "Sport machen" },
      { id: "ds08a4", text: "Netflix schauen" }
    ]
  },
  {
    id: "ds09",
    question: "Welchen Film- oder Seriengenre schaust du am liebsten?",
    answers: [
      { id: "ds09a1", text: "Action" },
      { id: "ds09a2", text: "Komödie" },
      { id: "ds09a3", text: "Horror" },
      { id: "ds09a4", text: "Dokumentation" }
    ]
  },
  {
    id: "ds10",
    question: "Was isst du am liebsten zum Frühstück?",
    answers: [
      { id: "ds10a1", text: "Müsli" },
      { id: "ds10a2", text: "Brötchen" },
      { id: "ds10a3", text: "Eier" },
      { id: "ds10a4", text: "Nichts" }
    ]
  },
  {
    id: "ds11",
    question: "Wie entspannst du dich am liebsten?",
    answers: [
      { id: "ds11a1", text: "Lesen" },
      { id: "ds11a2", text: "Musik hören" },
      { id: "ds11a3", text: "Spazieren gehen" },
      { id: "ds11a4", text: "Zocken" }
    ]
  },
  {
    id: "ds12",
    question: "Welche Sportart findest du am coolsten?",
    answers: [
      { id: "ds12a1", text: "Fußball" },
      { id: "ds12a2", text: "Basketball" },
      { id: "ds12a3", text: "Tennis" },
      { id: "ds12a4", text: "Schwimmen" }
    ]
  },
  {
    id: "ds13",
    question: "Was wäre dein Traumjob?",
    answers: [
      { id: "ds13a1", text: "Astronaut" },
      { id: "ds13a2", text: "Koch" },
      { id: "ds13a3", text: "Arzt" },
      { id: "ds13a4", text: "Musiker" }
    ]
  },
  {
    id: "ds14",
    question: "Welches Tier wärst du am liebsten?",
    answers: [
      { id: "ds14a1", text: "Adler" },
      { id: "ds14a2", text: "Delfin" },
      { id: "ds14a3", text: "Löwe" },
      { id: "ds14a4", text: "Schmetterling" }
    ]
  },
  {
    id: "ds15",
    question: "Welche Superkraft würdest du wählen?",
    answers: [
      { id: "ds15a1", text: "Fliegen" },
      { id: "ds15a2", text: "Unsichtbarkeit" },
      { id: "ds15a3", text: "Gedankenlesen" },
      { id: "ds15a4", text: "Zeitreisen" }
    ]
  }
];

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

export function createDuSagstGame(overrides?: object) {
  return {
    identifier: "duSagst",
    name: "Du Sagst...",
    modes: ["TEAM"],
    maxPoints: 6,
    scorebarMode: "circle",
    rules: "",
    qIndex: 0,
    questions: DU_SAGST_QUESTIONS,
    timeToThinkSeconds: 30,
    timer: { id: null, active: false, currSeconds: 0, initSeconds: 30 },
    teamStates: {
      t1: {
        id: "t1-default",
        boxStates: [
          { id: "t1-box1", answerIndex: -1, answerTheQuestion: true, showAnswer: false, submitted: true },
          { id: "t1-box2", answerIndex: -1, answerTheQuestion: false, showAnswer: false, submitted: true }
        ]
      },
      t2: {
        id: "t2-default",
        boxStates: [
          { id: "t2-box1", answerIndex: -1, answerTheQuestion: true, showAnswer: false, submitted: true },
          { id: "t2-box2", answerIndex: -1, answerTheQuestion: false, showAnswer: false, submitted: true }
        ]
      }
    },
    display: { question: false, answers: [] },
    ...overrides
  };
}

// ─── Zehn Setzen ─────────────────────────────────────────────────────────────

const ZEHN_SETZEN_QUESTIONS = [
  {
    id: "zs01",
    question: "Welches Land hat die längste Küstenlinie der Welt?",
    answers: [
      { id: "zs01a1", answer: "Russland" },
      { id: "zs01a2", answer: "Kanada" },
      { id: "zs01a3", answer: "Norwegen" },
      { id: "zs01a4", answer: "Australien" }
    ],
    correctAnswer: { id: "zs01a2", answer: "Kanada" }
  },
  {
    id: "zs02",
    question: "Welches chemische Element hat das Symbol Au?",
    answers: [
      { id: "zs02a1", answer: "Silber" },
      { id: "zs02a2", answer: "Aluminium" },
      { id: "zs02a3", answer: "Gold" },
      { id: "zs02a4", answer: "Kupfer" }
    ],
    correctAnswer: { id: "zs02a3", answer: "Gold" }
  },
  {
    id: "zs03",
    question: "Wer schrieb 'Also sprach Zarathustra'?",
    answers: [
      { id: "zs03a1", answer: "Arthur Schopenhauer" },
      { id: "zs03a2", answer: "Immanuel Kant" },
      { id: "zs03a3", answer: "Friedrich Nietzsche" },
      { id: "zs03a4", answer: "Georg Wilhelm Friedrich Hegel" }
    ],
    correctAnswer: { id: "zs03a3", answer: "Friedrich Nietzsche" }
  },
  {
    id: "zs04",
    question: "Welche Hauptstadt liegt am weitesten nördlich?",
    answers: [
      { id: "zs04a1", answer: "Oslo" },
      { id: "zs04a2", answer: "Helsinki" },
      { id: "zs04a3", answer: "Reykjavik" },
      { id: "zs04a4", answer: "Stockholm" }
    ],
    correctAnswer: { id: "zs04a3", answer: "Reykjavik" }
  },
  {
    id: "zs05",
    question: "In welchem Jahr wurde die Berliner Mauer errichtet?",
    answers: [
      { id: "zs05a1", answer: "1956" },
      { id: "zs05a2", answer: "1959" },
      { id: "zs05a3", answer: "1961" },
      { id: "zs05a4", answer: "1963" }
    ],
    correctAnswer: { id: "zs05a3", answer: "1961" }
  },
  {
    id: "zs06",
    question: "Welcher Künstler malte 'Die Erschaffung Adams' in der Sixtinischen Kapelle?",
    answers: [
      { id: "zs06a1", answer: "Leonardo da Vinci" },
      { id: "zs06a2", answer: "Raffael" },
      { id: "zs06a3", answer: "Michelangelo" },
      { id: "zs06a4", answer: "Caravaggio" }
    ],
    correctAnswer: { id: "zs06a3", answer: "Michelangelo" }
  },
  {
    id: "zs07",
    question: "Welcher Kontinent hat die meisten Länder?",
    answers: [
      { id: "zs07a1", answer: "Asien" },
      { id: "zs07a2", answer: "Europa" },
      { id: "zs07a3", answer: "Amerika" },
      { id: "zs07a4", answer: "Afrika" }
    ],
    correctAnswer: { id: "zs07a4", answer: "Afrika" }
  },
  {
    id: "zs08",
    question: "Wie tief ist der Mariannengraben (gerundet auf 1.000 m)?",
    answers: [
      { id: "zs08a1", answer: "7.000 m" },
      { id: "zs08a2", answer: "9.000 m" },
      { id: "zs08a3", answer: "11.000 m" },
      { id: "zs08a4", answer: "13.000 m" }
    ],
    correctAnswer: { id: "zs08a3", answer: "11.000 m" }
  },
  {
    id: "zs09",
    question: "Welches Organ produziert Gallenflüssigkeit?",
    answers: [
      { id: "zs09a1", answer: "Milz" },
      { id: "zs09a2", answer: "Bauchspeicheldrüse" },
      { id: "zs09a3", answer: "Niere" },
      { id: "zs09a4", answer: "Leber" }
    ],
    correctAnswer: { id: "zs09a4", answer: "Leber" }
  },
  {
    id: "zs10",
    question: "Welche Programmiersprache wurde von Guido van Rossum entwickelt?",
    answers: [
      { id: "zs10a1", answer: "Ruby" },
      { id: "zs10a2", answer: "Python" },
      { id: "zs10a3", answer: "Perl" },
      { id: "zs10a4", answer: "Java" }
    ],
    correctAnswer: { id: "zs10a2", answer: "Python" }
  },
  {
    id: "zs11",
    question: "Welches Land gewann die erste Fußball-WM 1930?",
    answers: [
      { id: "zs11a1", answer: "Brasilien" },
      { id: "zs11a2", answer: "Argentinien" },
      { id: "zs11a3", answer: "Uruguay" },
      { id: "zs11a4", answer: "Italien" }
    ],
    correctAnswer: { id: "zs11a3", answer: "Uruguay" }
  },
  {
    id: "zs12",
    question: "Mit wie viel km/s bewegt sich Licht im Vakuum?",
    answers: [
      { id: "zs12a1", answer: "100.000 km/s" },
      { id: "zs12a2", answer: "200.000 km/s" },
      { id: "zs12a3", answer: "300.000 km/s" },
      { id: "zs12a4", answer: "400.000 km/s" }
    ],
    correctAnswer: { id: "zs12a3", answer: "300.000 km/s" }
  },
  {
    id: "zs13",
    question: "In welchem Land liegt Machu Picchu?",
    answers: [
      { id: "zs13a1", answer: "Bolivien" },
      { id: "zs13a2", answer: "Kolumbien" },
      { id: "zs13a3", answer: "Chile" },
      { id: "zs13a4", answer: "Peru" }
    ],
    correctAnswer: { id: "zs13a4", answer: "Peru" }
  },
  {
    id: "zs14",
    question: "Welche Musikrichtung entstand in Jamaika?",
    answers: [
      { id: "zs14a1", answer: "Calypso" },
      { id: "zs14a2", answer: "Reggae" },
      { id: "zs14a3", answer: "Bossa Nova" },
      { id: "zs14a4", answer: "Samba" }
    ],
    correctAnswer: { id: "zs14a2", answer: "Reggae" }
  },
  {
    id: "zs15",
    question: "Wie viele Knochen hat ein erwachsener Mensch?",
    answers: [
      { id: "zs15a1", answer: "176" },
      { id: "zs15a2", answer: "196" },
      { id: "zs15a3", answer: "206" },
      { id: "zs15a4", answer: "226" }
    ],
    correctAnswer: { id: "zs15a3", answer: "206" }
  },
  {
    id: "zs16",
    question: "Was ist die Hauptstadt von Australien?",
    answers: [
      { id: "zs16a1", answer: "Sydney" },
      { id: "zs16a2", answer: "Melbourne" },
      { id: "zs16a3", answer: "Canberra" },
      { id: "zs16a4", answer: "Brisbane" }
    ],
    correctAnswer: { id: "zs16a3", answer: "Canberra" }
  },
  {
    id: "zs17",
    question: "Welcher Planet ist der größte in unserem Sonnensystem?",
    answers: [
      { id: "zs17a1", answer: "Saturn" },
      { id: "zs17a2", answer: "Uranus" },
      { id: "zs17a3", answer: "Neptun" },
      { id: "zs17a4", answer: "Jupiter" }
    ],
    correctAnswer: { id: "zs17a4", answer: "Jupiter" }
  },
  {
    id: "zs18",
    question: "Wer schrieb 'Die Leiden des jungen Werthers'?",
    answers: [
      { id: "zs18a1", answer: "Friedrich Schiller" },
      { id: "zs18a2", answer: "Johann Wolfgang von Goethe" },
      { id: "zs18a3", answer: "Heinrich Heine" },
      { id: "zs18a4", answer: "Bertolt Brecht" }
    ],
    correctAnswer: { id: "zs18a2", answer: "Johann Wolfgang von Goethe" }
  },
  {
    id: "zs19",
    question: "Welches ist das längste Gebirge der Welt?",
    answers: [
      { id: "zs19a1", answer: "Himalaya" },
      { id: "zs19a2", answer: "Rocky Mountains" },
      { id: "zs19a3", answer: "Anden" },
      { id: "zs19a4", answer: "Alpen" }
    ],
    correctAnswer: { id: "zs19a3", answer: "Anden" }
  },
  {
    id: "zs20",
    question: "Wann wurde die Europäische Union gegründet?",
    answers: [
      { id: "zs20a1", answer: "1989" },
      { id: "zs20a2", answer: "1992" },
      { id: "zs20a3", answer: "1995" },
      { id: "zs20a4", answer: "1998" }
    ],
    correctAnswer: { id: "zs20a2", answer: "1992" }
  }
];

export function createZehnSetzenGame(overrides?: object) {
  return {
    identifier: "zehnSetzen",
    name: "Zehn Setzen",
    modes: ["DUELL", "TEAM"],
    maxPoints: 10,
    scorebarMode: "number",
    rules: "",
    questions: ZEHN_SETZEN_QUESTIONS,
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

const FRAGENHAGEL_QUESTIONS = [
  { id: "fh01", question: "Wie heißt die Hauptstadt von Frankreich?", answer: "Paris" },
  { id: "fh02", question: "Welches ist das kleinste Land der Welt?", answer: "Vatikan" },
  { id: "fh03", question: "Wie heißt der größte Ozean der Erde?", answer: "Pazifik" },
  { id: "fh04", question: "Was ist die Hauptstadt von Deutschland?", answer: "Berlin" },
  { id: "fh05", question: "Wie viele Kontinente gibt es?", answer: "7" },
  { id: "fh06", question: "Wie heißt die Hauptstadt von Australien?", answer: "Canberra" },
  { id: "fh07", question: "In welchem Land steht der Eiffelturm?", answer: "Frankreich" },
  { id: "fh08", question: "Welches ist das schnellste Landtier?", answer: "Gepard" },
  { id: "fh09", question: "Wie viele Planeten hat unser Sonnensystem?", answer: "8" },
  { id: "fh10", question: "Was ist H₂O?", answer: "Wasser" },
  { id: "fh11", question: "Welches ist das größte Tier der Welt?", answer: "Blauwal" },
  { id: "fh12", question: "Wie viele Buchstaben hat das deutsche Alphabet?", answer: "26" },
  { id: "fh13", question: "Welche Sprache wird in Brasilien gesprochen?", answer: "Portugiesisch" },
  { id: "fh14", question: "In welchem Meer liegt Mallorca?", answer: "Mittelmeer" },
  { id: "fh15", question: "Aus welchem Material besteht eine Geige hauptsächlich?", answer: "Holz" },
  { id: "fh16", question: "Wie nennt man flüssiges Gestein aus einem Vulkan?", answer: "Lava" },
  { id: "fh17", question: "Wer schrieb Romeo und Julia?", answer: "Shakespeare" },
  { id: "fh18", question: "Wie viele Wochen hat ein Jahr?", answer: "52" },
  { id: "fh19", question: "Welcher Planet ist der größte im Sonnensystem?", answer: "Jupiter" },
  { id: "fh20", question: "Wie heißt der längste Fluss der Welt?", answer: "Nil" },
  { id: "fh21", question: "Wie viele Stunden hat ein Tag?", answer: "24" },
  { id: "fh22", question: "Welches Tier ist das Symbol der Demokratischen Partei der USA?", answer: "Esel" },
  { id: "fh23", question: "Wie heißt der höchste Berg der Welt?", answer: "Mount Everest" },
  { id: "fh24", question: "Wie viele Beine hat eine Spinne?", answer: "8" },
  { id: "fh25", question: "Welche Farbe hat eine reife Banane?", answer: "Gelb" },
  { id: "fh26", question: "Wie viele Zähne hat ein erwachsener Mensch?", answer: "32" },
  { id: "fh27", question: "Welches Tier ist das Nationaltier Australiens?", answer: "Känguru" },
  { id: "fh28", question: "Wie viele Beine hat ein Insekt?", answer: "6" },
  { id: "fh29", question: "In welchem Kontinent liegt Ägypten?", answer: "Afrika" },
  { id: "fh30", question: "Wie heißt der kleinste Planet im Sonnensystem?", answer: "Merkur" },
  { id: "fh31", question: "Wie viele Karten hat ein normales Kartenspiel?", answer: "52" },
  { id: "fh32", question: "Welches Land hat die meisten Einwohner?", answer: "China" },
  { id: "fh33", question: "Welcher Komponist war für einen Großteil seines Lebens taub?", answer: "Beethoven" },
  { id: "fh34", question: "Welche Farbe hat der Smaragd?", answer: "Grün" },
  { id: "fh35", question: "Wie viele Tage hat Februar in einem Schaltjahr?", answer: "29" },
  { id: "fh36", question: "Wie viele Töne hat eine Durtonleiter?", answer: "7" },
  { id: "fh37", question: "Welches Gas atmen wir ein?", answer: "Sauerstoff" },
  { id: "fh38", question: "In welcher Stadt steht das Kolosseum?", answer: "Rom" },
  { id: "fh39", question: "Welcher Planet hat die meisten Monde im Sonnensystem?", answer: "Saturn" },
  { id: "fh40", question: "Wie viele Knochen hat ein erwachsener Mensch?", answer: "206" },
  { id: "fh41", question: "Welche Farbe hat der Rubin?", answer: "Rot" },
  { id: "fh42", question: "Wie viele Spieler stehen in einer Fußballmannschaft auf dem Platz?", answer: "11" },
  { id: "fh43", question: "In welchem Jahr fiel die Berliner Mauer?", answer: "1989" },
  { id: "fh44", question: "Wie heißt der Zauberer aus Harry Potter?", answer: "Harry Potter" },
  { id: "fh45", question: "Welches Element hat das chemische Symbol O?", answer: "Sauerstoff" },
  { id: "fh46", question: "Wie viele Farben hat ein Regenbogen?", answer: "7" },
  { id: "fh47", question: "Wer malte die Mona Lisa?", answer: "Leonardo da Vinci" },
  { id: "fh48", question: "In welchem Jahr begann der Erste Weltkrieg?", answer: "1914" },
  { id: "fh49", question: "Wie heißt der Schöpfer der Relativitätstheorie?", answer: "Einstein" },
  { id: "fh50", question: "Wie viele Augen hat eine Biene?", answer: "5" },
  { id: "fh51", question: "Wie nennt man einen schlafenden Vulkan?", answer: "Ruhender Vulkan" },
  { id: "fh52", question: "Welches Instrument hat 88 Tasten?", answer: "Klavier" },
  { id: "fh53", question: "Wie heißt der Gegenspieler von Batman?", answer: "Joker" },
  { id: "fh54", question: "Welches Tier kann am höchsten springen (relativ zur Körpergröße)?", answer: "Floh" },
  { id: "fh55", question: "Wie viele Sterne hat die US-Flagge?", answer: "50" },
  { id: "fh56", question: "In welchem Organ wird Insulin produziert?", answer: "Bauchspeicheldrüse" },
  { id: "fh57", question: "Wie heißt der Held aus der Legende von Zelda?", answer: "Link" },
  { id: "fh58", question: "Wie heißt der Fluss, an dem Paris liegt?", answer: "Seine" },
  { id: "fh59", question: "In welchem Land wurde Pizza erfunden?", answer: "Italien" },
  { id: "fh60", question: "Wie nennt man die Angst vor Spinnen?", answer: "Arachnophobie" },
  { id: "fh61", question: "Welche Stadt ist die bevölkerungsreichste Deutschlands?", answer: "Berlin" },
  { id: "fh62", question: "Wie viele Minuten hat eine Stunde?", answer: "60" },
  { id: "fh63", question: "Welches chemische Symbol hat Eisen?", answer: "Fe" },
  { id: "fh64", question: "Wer erfand das Telefon?", answer: "Alexander Graham Bell" },
  { id: "fh65", question: "Welches Land hat die meisten Seen der Welt?", answer: "Kanada" },
  { id: "fh66", question: "In welchem Jahr landete der erste Mensch auf dem Mond?", answer: "1969" },
  { id: "fh67", question: "Wie nennt man die Hauptstadt von Japan?", answer: "Tokio" },
  { id: "fh68", question: "Wie viele Millimeter hat ein Zentimeter?", answer: "10" },
  { id: "fh69", question: "Welches Element ist das leichteste im Periodensystem?", answer: "Wasserstoff" },
  { id: "fh70", question: "Welche Farbe entsteht, wenn man Blau und Gelb mischt?", answer: "Grün" },
  { id: "fh71", question: "Wie heißt das größte Binnenmeer der Welt?", answer: "Kaspisches Meer" },
  { id: "fh72", question: "In welchem Land liegt die Pyramide von Gizeh?", answer: "Ägypten" },
  { id: "fh73", question: "Wie viele Seiten hat ein Würfel?", answer: "6" },
  { id: "fh74", question: "Welches Tier ist das Symbol für Deutschland?", answer: "Adler" },
  { id: "fh75", question: "Wie heißt der längste Fluss Europas?", answer: "Wolga" }
];

export function createFragenhagelGame(overrides?: object) {
  return {
    identifier: "fragenhagel",
    name: "Fragenhagel",
    modes: ["DUELL"],
    maxPoints: 20,
    scorebarMode: "number",
    rules: "",
    questions: FRAGENHAGEL_QUESTIONS,
    configuredIntervals: [
      { id: "fi1", label: "Intervall 1", start: 25, end: 30 },
      { id: "fi2", label: "Intervall 2", start: 32, end: 37 },
      { id: "fi3", label: "Intervall 3", start: 41, end: 46 }
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

const REFERAT_BINGO_TOPICS = [
  { id: "rb01", topic: "Klimawandel" },
  { id: "rb02", topic: "Künstliche Intelligenz" },
  { id: "rb03", topic: "Zweiter Weltkrieg" },
  { id: "rb04", topic: "Die Römer" },
  { id: "rb05", topic: "Elektroautos" },
  { id: "rb06", topic: "Das Sonnensystem" },
  { id: "rb07", topic: "Die Französische Revolution" },
  { id: "rb08", topic: "Erneuerbare Energien" },
  { id: "rb09", topic: "Die Ägypter" },
  { id: "rb10", topic: "Social Media" },
  { id: "rb11", topic: "Globalisierung" },
  { id: "rb12", topic: "Das Mittelalter" },
  { id: "rb13", topic: "Raumfahrt" },
  { id: "rb14", topic: "Demokratie" },
  { id: "rb15", topic: "Tierschutz" }
];

const makeNotefield = () => ({
  answers: new Array(9).fill(""),
  selectedAnswers: [] as string[],
  submitted: false
});

export function createReferatBingoGame(overrides?: object) {
  return {
    identifier: "referatBingo",
    name: "Referat Bingo",
    modes: ["TEAM"],
    maxPoints: 999,
    scorebarMode: "number",
    rules: "",
    topics: REFERAT_BINGO_TOPICS,
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

const SET_QUESTIONS = [
  {
    id: "set01",
    cards: [
      { id: "s01c01", form: "rectangle", color: "red", fill: "dashed", amount: 3 },
      { id: "s01c02", form: "diamond", color: "green", fill: "none", amount: 3 },
      { id: "s01c03", form: "diamond", color: "blue", fill: "dashed", amount: 1 },
      { id: "s01c04", form: "diamond", color: "red", fill: "dashed", amount: 3 },
      { id: "s01c05", form: "oval", color: "blue", fill: "filled", amount: 1 },
      { id: "s01c06", form: "diamond", color: "red", fill: "none", amount: 1 },
      { id: "s01c07", form: "oval", color: "red", fill: "filled", amount: 3 },
      { id: "s01c08", form: "diamond", color: "green", fill: "dashed", amount: 2 },
      { id: "s01c09", form: "rectangle", color: "green", fill: "filled", amount: 2 },
      { id: "s01c10", form: "oval", color: "blue", fill: "none", amount: 1 },
      { id: "s01c11", form: "diamond", color: "blue", fill: "none", amount: 1 },
      { id: "s01c12", form: "oval", color: "red", fill: "dashed", amount: 1 }
    ]
  },
  {
    id: "set02",
    cards: [
      { id: "s02c01", form: "diamond", color: "blue", fill: "dashed", amount: 2 },
      { id: "s02c02", form: "rectangle", color: "green", fill: "dashed", amount: 1 },
      { id: "s02c03", form: "diamond", color: "green", fill: "dashed", amount: 2 },
      { id: "s02c04", form: "diamond", color: "green", fill: "filled", amount: 3 },
      { id: "s02c05", form: "rectangle", color: "red", fill: "dashed", amount: 1 },
      { id: "s02c06", form: "diamond", color: "blue", fill: "dashed", amount: 1 },
      { id: "s02c07", form: "diamond", color: "blue", fill: "filled", amount: 2 },
      { id: "s02c08", form: "rectangle", color: "blue", fill: "dashed", amount: 2 },
      { id: "s02c09", form: "diamond", color: "blue", fill: "none", amount: 1 },
      { id: "s02c10", form: "diamond", color: "green", fill: "dashed", amount: 1 },
      { id: "s02c11", form: "diamond", color: "blue", fill: "none", amount: 3 },
      { id: "s02c12", form: "oval", color: "green", fill: "dashed", amount: 2 }
    ]
  },
  {
    id: "set03",
    cards: [
      { id: "s03c01", form: "oval", color: "red", fill: "none", amount: 2 },
      { id: "s03c02", form: "diamond", color: "green", fill: "dashed", amount: 1 },
      { id: "s03c03", form: "oval", color: "green", fill: "filled", amount: 3 },
      { id: "s03c04", form: "oval", color: "blue", fill: "dashed", amount: 2 },
      { id: "s03c05", form: "oval", color: "blue", fill: "dashed", amount: 3 },
      { id: "s03c06", form: "rectangle", color: "blue", fill: "dashed", amount: 2 },
      { id: "s03c07", form: "diamond", color: "red", fill: "dashed", amount: 3 },
      { id: "s03c08", form: "oval", color: "blue", fill: "none", amount: 2 },
      { id: "s03c09", form: "oval", color: "red", fill: "dashed", amount: 1 },
      { id: "s03c10", form: "rectangle", color: "green", fill: "filled", amount: 1 },
      { id: "s03c11", form: "diamond", color: "green", fill: "none", amount: 2 },
      { id: "s03c12", form: "oval", color: "blue", fill: "filled", amount: 3 }
    ]
  },
  {
    id: "set04",
    cards: [
      { id: "s04c01", form: "rectangle", color: "green", fill: "filled", amount: 2 },
      { id: "s04c02", form: "diamond", color: "green", fill: "filled", amount: 3 },
      { id: "s04c03", form: "oval", color: "blue", fill: "dashed", amount: 2 },
      { id: "s04c04", form: "oval", color: "red", fill: "filled", amount: 3 },
      { id: "s04c05", form: "rectangle", color: "blue", fill: "dashed", amount: 3 },
      { id: "s04c06", form: "diamond", color: "red", fill: "dashed", amount: 1 },
      { id: "s04c07", form: "oval", color: "green", fill: "none", amount: 1 },
      { id: "s04c08", form: "oval", color: "blue", fill: "filled", amount: 2 },
      { id: "s04c09", form: "diamond", color: "green", fill: "filled", amount: 1 },
      { id: "s04c10", form: "diamond", color: "green", fill: "none", amount: 1 },
      { id: "s04c11", form: "diamond", color: "blue", fill: "none", amount: 3 },
      { id: "s04c12", form: "diamond", color: "green", fill: "none", amount: 3 }
    ]
  },
  {
    id: "set05",
    cards: [
      { id: "s05c01", form: "rectangle", color: "green", fill: "filled", amount: 2 },
      { id: "s05c02", form: "oval", color: "red", fill: "dashed", amount: 2 },
      { id: "s05c03", form: "oval", color: "green", fill: "none", amount: 1 },
      { id: "s05c04", form: "diamond", color: "green", fill: "filled", amount: 2 },
      { id: "s05c05", form: "diamond", color: "blue", fill: "none", amount: 2 },
      { id: "s05c06", form: "oval", color: "green", fill: "dashed", amount: 1 },
      { id: "s05c07", form: "diamond", color: "red", fill: "dashed", amount: 3 },
      { id: "s05c08", form: "oval", color: "red", fill: "dashed", amount: 1 },
      { id: "s05c09", form: "oval", color: "blue", fill: "dashed", amount: 3 },
      { id: "s05c10", form: "rectangle", color: "green", fill: "none", amount: 1 },
      { id: "s05c11", form: "diamond", color: "blue", fill: "filled", amount: 2 },
      { id: "s05c12", form: "rectangle", color: "green", fill: "filled", amount: 1 }
    ]
  },
  {
    id: "set06",
    cards: [
      { id: "s06c01", form: "rectangle", color: "red", fill: "none", amount: 3 },
      { id: "s06c02", form: "rectangle", color: "blue", fill: "dashed", amount: 1 },
      { id: "s06c03", form: "rectangle", color: "red", fill: "filled", amount: 1 },
      { id: "s06c04", form: "diamond", color: "green", fill: "filled", amount: 3 },
      { id: "s06c05", form: "oval", color: "blue", fill: "none", amount: 1 },
      { id: "s06c06", form: "diamond", color: "blue", fill: "filled", amount: 2 },
      { id: "s06c07", form: "oval", color: "green", fill: "dashed", amount: 1 },
      { id: "s06c08", form: "diamond", color: "blue", fill: "dashed", amount: 2 },
      { id: "s06c09", form: "diamond", color: "red", fill: "dashed", amount: 1 },
      { id: "s06c10", form: "rectangle", color: "green", fill: "dashed", amount: 1 },
      { id: "s06c11", form: "diamond", color: "blue", fill: "none", amount: 3 },
      { id: "s06c12", form: "oval", color: "red", fill: "filled", amount: 3 }
    ]
  },
  {
    id: "set07",
    cards: [
      { id: "s07c01", form: "rectangle", color: "green", fill: "none", amount: 1 },
      { id: "s07c02", form: "diamond", color: "green", fill: "none", amount: 1 },
      { id: "s07c03", form: "rectangle", color: "blue", fill: "filled", amount: 2 },
      { id: "s07c04", form: "rectangle", color: "red", fill: "none", amount: 3 },
      { id: "s07c05", form: "rectangle", color: "blue", fill: "none", amount: 3 },
      { id: "s07c06", form: "diamond", color: "green", fill: "none", amount: 2 },
      { id: "s07c07", form: "oval", color: "blue", fill: "none", amount: 3 },
      { id: "s07c08", form: "rectangle", color: "red", fill: "dashed", amount: 2 },
      { id: "s07c09", form: "diamond", color: "red", fill: "dashed", amount: 1 },
      { id: "s07c10", form: "rectangle", color: "blue", fill: "none", amount: 2 },
      { id: "s07c11", form: "diamond", color: "red", fill: "dashed", amount: 3 },
      { id: "s07c12", form: "rectangle", color: "green", fill: "filled", amount: 3 }
    ]
  },
  {
    id: "set08",
    cards: [
      { id: "s08c01", form: "oval", color: "green", fill: "dashed", amount: 2 },
      { id: "s08c02", form: "diamond", color: "red", fill: "none", amount: 2 },
      { id: "s08c03", form: "diamond", color: "red", fill: "filled", amount: 2 },
      { id: "s08c04", form: "oval", color: "red", fill: "none", amount: 2 },
      { id: "s08c05", form: "oval", color: "green", fill: "none", amount: 3 },
      { id: "s08c06", form: "rectangle", color: "red", fill: "filled", amount: 2 },
      { id: "s08c07", form: "rectangle", color: "red", fill: "filled", amount: 1 },
      { id: "s08c08", form: "rectangle", color: "red", fill: "dashed", amount: 3 },
      { id: "s08c09", form: "diamond", color: "red", fill: "none", amount: 1 },
      { id: "s08c10", form: "oval", color: "red", fill: "dashed", amount: 1 },
      { id: "s08c11", form: "rectangle", color: "blue", fill: "dashed", amount: 2 },
      { id: "s08c12", form: "oval", color: "red", fill: "none", amount: 1 }
    ]
  },
  {
    id: "set09",
    cards: [
      { id: "s09c01", form: "rectangle", color: "red", fill: "dashed", amount: 2 },
      { id: "s09c02", form: "rectangle", color: "green", fill: "none", amount: 2 },
      { id: "s09c03", form: "oval", color: "green", fill: "dashed", amount: 1 },
      { id: "s09c04", form: "rectangle", color: "blue", fill: "none", amount: 3 },
      { id: "s09c05", form: "diamond", color: "red", fill: "none", amount: 3 },
      { id: "s09c06", form: "diamond", color: "blue", fill: "filled", amount: 3 },
      { id: "s09c07", form: "rectangle", color: "green", fill: "dashed", amount: 1 },
      { id: "s09c08", form: "oval", color: "blue", fill: "none", amount: 3 },
      { id: "s09c09", form: "rectangle", color: "blue", fill: "none", amount: 1 },
      { id: "s09c10", form: "rectangle", color: "green", fill: "dashed", amount: 2 },
      { id: "s09c11", form: "oval", color: "blue", fill: "none", amount: 1 },
      { id: "s09c12", form: "diamond", color: "red", fill: "dashed", amount: 1 }
    ]
  },
  {
    id: "set10",
    cards: [
      { id: "s10c01", form: "diamond", color: "blue", fill: "dashed", amount: 3 },
      { id: "s10c02", form: "diamond", color: "green", fill: "filled", amount: 2 },
      { id: "s10c03", form: "oval", color: "green", fill: "dashed", amount: 3 },
      { id: "s10c04", form: "oval", color: "red", fill: "dashed", amount: 3 },
      { id: "s10c05", form: "rectangle", color: "red", fill: "filled", amount: 1 },
      { id: "s10c06", form: "oval", color: "red", fill: "dashed", amount: 2 },
      { id: "s10c07", form: "diamond", color: "red", fill: "dashed", amount: 3 },
      { id: "s10c08", form: "rectangle", color: "green", fill: "dashed", amount: 2 },
      { id: "s10c09", form: "rectangle", color: "blue", fill: "dashed", amount: 1 },
      { id: "s10c10", form: "rectangle", color: "green", fill: "filled", amount: 3 },
      { id: "s10c11", form: "rectangle", color: "red", fill: "dashed", amount: 1 },
      { id: "s10c12", form: "diamond", color: "red", fill: "dashed", amount: 1 }
    ]
  },
  {
    id: "set11",
    cards: [
      { id: "s11c01", form: "oval", color: "blue", fill: "filled", amount: 3 },
      { id: "s11c02", form: "oval", color: "red", fill: "none", amount: 3 },
      { id: "s11c03", form: "diamond", color: "blue", fill: "filled", amount: 2 },
      { id: "s11c04", form: "diamond", color: "red", fill: "dashed", amount: 2 },
      { id: "s11c05", form: "diamond", color: "green", fill: "dashed", amount: 1 },
      { id: "s11c06", form: "diamond", color: "green", fill: "none", amount: 1 },
      { id: "s11c07", form: "diamond", color: "red", fill: "dashed", amount: 3 },
      { id: "s11c08", form: "oval", color: "red", fill: "none", amount: 2 },
      { id: "s11c09", form: "diamond", color: "blue", fill: "dashed", amount: 1 },
      { id: "s11c10", form: "diamond", color: "red", fill: "none", amount: 3 },
      { id: "s11c11", form: "oval", color: "red", fill: "dashed", amount: 2 },
      { id: "s11c12", form: "diamond", color: "blue", fill: "none", amount: 1 }
    ]
  },
  {
    id: "set12",
    cards: [
      { id: "s12c01", form: "rectangle", color: "blue", fill: "none", amount: 3 },
      { id: "s12c02", form: "rectangle", color: "blue", fill: "dashed", amount: 2 },
      { id: "s12c03", form: "diamond", color: "red", fill: "filled", amount: 1 },
      { id: "s12c04", form: "rectangle", color: "red", fill: "dashed", amount: 2 },
      { id: "s12c05", form: "oval", color: "blue", fill: "filled", amount: 2 },
      { id: "s12c06", form: "oval", color: "green", fill: "filled", amount: 3 },
      { id: "s12c07", form: "oval", color: "blue", fill: "dashed", amount: 3 },
      { id: "s12c08", form: "oval", color: "red", fill: "dashed", amount: 3 },
      { id: "s12c09", form: "diamond", color: "blue", fill: "dashed", amount: 2 },
      { id: "s12c10", form: "diamond", color: "blue", fill: "none", amount: 2 },
      { id: "s12c11", form: "diamond", color: "red", fill: "filled", amount: 2 },
      { id: "s12c12", form: "diamond", color: "blue", fill: "filled", amount: 2 }
    ]
  },
  {
    id: "set13",
    cards: [
      { id: "s13c01", form: "diamond", color: "green", fill: "none", amount: 1 },
      { id: "s13c02", form: "oval", color: "blue", fill: "filled", amount: 2 },
      { id: "s13c03", form: "oval", color: "red", fill: "none", amount: 3 },
      { id: "s13c04", form: "oval", color: "blue", fill: "dashed", amount: 3 },
      { id: "s13c05", form: "rectangle", color: "green", fill: "dashed", amount: 1 },
      { id: "s13c06", form: "rectangle", color: "red", fill: "dashed", amount: 1 },
      { id: "s13c07", form: "diamond", color: "blue", fill: "dashed", amount: 3 },
      { id: "s13c08", form: "oval", color: "blue", fill: "dashed", amount: 1 },
      { id: "s13c09", form: "diamond", color: "red", fill: "filled", amount: 1 },
      { id: "s13c10", form: "oval", color: "red", fill: "dashed", amount: 1 },
      { id: "s13c11", form: "rectangle", color: "red", fill: "none", amount: 2 },
      { id: "s13c12", form: "diamond", color: "green", fill: "filled", amount: 3 }
    ]
  }
];

export function createSetGame(overrides?: object) {
  return {
    identifier: "set",
    name: "Set",
    modes: ["DUELL", "TEAM"],
    maxPoints: 7,
    scorebarMode: "circle",
    rules: "",
    questions: SET_QUESTIONS,
    openedCards: [],
    markedCards: [],
    markedCardsState: "marked",
    qIndex: 0,
    display: { cards: false, markedCards: false },
    ...overrides
  };
}
