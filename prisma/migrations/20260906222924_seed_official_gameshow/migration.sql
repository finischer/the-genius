-- Seed: Offizielle Gameshow "Allgemeinwissen Deluxe"
-- creatorId = NULL (offizielle Gameshow), isOfficial = true
-- games enthält exakt das, was ein Konfigurator in die DB schreibt:
-- Nur die User-konfigurierbaren Felder werden auf echte Werte gesetzt,
-- alle Laufzeit-Felder (display, timer, qIndex, teamStates...) bleiben
-- auf ihren Default-Werten – genau wie nach dem Speichern einer echten Gameshow.

INSERT INTO "gameshows" (
  "id", "name", "description", "games",
  "creatorId", "isOfficial", "visibility", "difficulty",
  "isFavorite", "importedGameshow", "isModified",
  "originalCreatorId", "originalGameshowId",
  "createdAt", "updatedAt"
) VALUES (
  'official-gameshow-allgemeinwissen-deluxe',
  'Allgemeinwissen Deluxe',
  'Die offizielle TheGenius-Spielshow – alle 8 Spiele, jede Menge Spaß. Für Einsteiger und Profis.',
  $games$[
    {
      "identifier": "flaggen",
      "name": "Flaggen",
      "modes": ["DUELL", "TEAM"],
      "maxPoints": 7,
      "scorebarMode": "circle",
      "qIndex": 0,
      "display": { "answer": false, "country": false },
      "rules": "Spiel: Flaggen",
      "countries": [
        { "id": "br", "country": "Brasilien",            "shortCode": "br" },
        { "id": "np", "country": "Nepal",                "shortCode": "np" },
        { "id": "fr", "country": "Frankreich",           "shortCode": "fr" },
        { "id": "bt", "country": "Bhutan",               "shortCode": "bt" },
        { "id": "no", "country": "Norwegen",             "shortCode": "no" },
        { "id": "cy", "country": "Zypern",               "shortCode": "cy" },
        { "id": "mx", "country": "Mexiko",               "shortCode": "mx" },
        { "id": "pg", "country": "Papua-Neuguinea",      "shortCode": "pg" },
        { "id": "ca", "country": "Kanada",               "shortCode": "ca" },
        { "id": "bh", "country": "Bahrain",              "shortCode": "bh" },
        { "id": "ch", "country": "Schweiz",              "shortCode": "ch" },
        { "id": "ls", "country": "Lesotho",              "shortCode": "ls" },
        { "id": "au", "country": "Australien",           "shortCode": "au" },
        { "id": "ge", "country": "Georgien",             "shortCode": "ge" },
        { "id": "se", "country": "Schweden",             "shortCode": "se" },
        { "id": "md", "country": "Moldau",               "shortCode": "md" },
        { "id": "za", "country": "Südafrika",            "shortCode": "za" },
        { "id": "bj", "country": "Benin",                "shortCode": "bj" },
        { "id": "is", "country": "Island",               "shortCode": "is" },
        { "id": "kz", "country": "Kasachstan",           "shortCode": "kz" },
        { "id": "tr", "country": "Türkei",               "shortCode": "tr" },
        { "id": "mv", "country": "Malediven",            "shortCode": "mv" },
        { "id": "ar", "country": "Argentinien",          "shortCode": "ar" },
        { "id": "sz", "country": "Eswatini",             "shortCode": "sz" },
        { "id": "kr", "country": "Südkorea",             "shortCode": "kr" },
        { "id": "fj", "country": "Fidschi",              "shortCode": "fj" },
        { "id": "in", "country": "Indien",               "shortCode": "in" },
        { "id": "tn", "country": "Tunesien",             "shortCode": "tn" },
        { "id": "kg", "country": "Kirgisistan",          "shortCode": "kg" },
        { "id": "jp", "country": "Japan",                "shortCode": "jp" }
      ]
    },
    {
      "identifier": "geheimwoerter",
      "name": "Geheimwörter",
      "modes": ["DUELL", "TEAM"],
      "maxPoints": 7,
      "scorebarMode": "circle",
      "qIndex": 0,
      "answer": "",
      "display": { "answer": false, "codeList": false, "words": false },
      "rules": "Spiel: Geheimwörter",
      "codeList": [
        { "letter": "A", "category": "Automarke" },
        { "letter": "B", "category": "Beruf" },
        { "letter": "C", "category": "Chemisches Element" },
        { "letter": "D", "category": "Deutsche Stadt" },
        { "letter": "E", "category": "Essensgericht" },
        { "letter": "F", "category": "Fluss" },
        { "letter": "G", "category": "Gebirge" },
        { "letter": "H", "category": "Haustier" },
        { "letter": "I", "category": "Insel" },
        { "letter": "J", "category": "Kleidungsstück" },
        { "letter": "K", "category": "Körperteil" },
        { "letter": "L", "category": "Land" },
        { "letter": "M", "category": "Meer" },
        { "letter": "N", "category": "Name (weiblich)" },
        { "letter": "O", "category": "Obst" },
        { "letter": "P", "category": "Planet" },
        { "letter": "R", "category": "Religion" },
        { "letter": "S", "category": "Sportart" },
        { "letter": "T", "category": "Tanzstil" },
        { "letter": "U", "category": "Uhrzeit" },
        { "letter": "V", "category": "Vulkan" },
        { "letter": "W", "category": "Werkzeug" },
        { "letter": "Z", "category": "Zahl" }
      ],
      "questions": [
        {
          "id": "gw00",
          "answer": "Haus",
          "words": [
            { "word": "Labrador", "category": "Haustier" },
            { "word": "Ferrari", "category": "Automarke" },
            { "word": "Mitternacht", "category": "Uhrzeit" },
            { "word": "Bogenschießen", "category": "Sportart" }
          ]
        },
        {
          "id": "gw01",
          "answer": "Flamingo",
          "words": [
            { "word": "Mississippi", "category": "Fluss" },
            { "word": "Mongolei", "category": "Land" },
            { "word": "Lamborghini", "category": "Automarke" },
            { "word": "Karibisches Meer", "category": "Meer" },
            { "word": "Mallorca", "category": "Insel" },
            { "word": "Cleopatra", "category": "Name (weiblich)" },
            { "word": "Himalaya", "category": "Gebirge" },
            { "word": "Maracuja", "category": "Obst" }
          ]
        },
        {
          "id": "gw02",
          "answer": "Piranha",
          "words": [
            { "word": "Jupiter", "category": "Planet" },
            { "word": "Madagaskar", "category": "Insel" },
            { "word": "Buddhismus", "category": "Religion" },
            { "word": "Bugatti", "category": "Automarke" },
            { "word": "Hildegard", "category": "Name (weiblich)" },
            { "word": "Perserkatze", "category": "Haustier" },
            { "word": "Maserati", "category": "Automarke" }
          ]
        },
        {
          "id": "gw03",
          "answer": "Domino",
          "words": [
            { "word": "Heidelberg", "category": "Deutsche Stadt" },
            { "word": "Kumquat", "category": "Obst" },
            { "word": "Korallenmeer", "category": "Meer" },
            { "word": "Neuseeland", "category": "Insel" },
            { "word": "Brunhilde", "category": "Name (weiblich)" },
            { "word": "Papaya", "category": "Obst" }
          ]
        },
        {
          "id": "gw04",
          "answer": "Bilanz",
          "words": [
            { "word": "Zahnarzt", "category": "Beruf" },
            { "word": "Sri Lanka", "category": "Insel" },
            { "word": "Paraguay", "category": "Land" },
            { "word": "Rolls-Royce", "category": "Automarke" },
            { "word": "Sieglinde", "category": "Name (weiblich)" },
            { "word": "Sieben", "category": "Zahl" }
          ]
        },
        {
          "id": "gw05",
          "answer": "Gondel",
          "words": [
            { "word": "Rocky Mountains", "category": "Gebirge" },
            { "word": "Litschi", "category": "Obst" },
            { "word": "Walpurga", "category": "Name (weiblich)" },
            { "word": "Freiburg", "category": "Deutsche Stadt" },
            { "word": "Schnitzel", "category": "Essensgericht" },
            { "word": "Tadschikistan", "category": "Land" }
          ]
        },
        {
          "id": "gw06",
          "answer": "Wolken",
          "words": [
            { "word": "Säge", "category": "Werkzeug" },
            { "word": "Granatapfel", "category": "Obst" },
            { "word": "Suriname", "category": "Land" },
            { "word": "Milz", "category": "Körperteil" },
            { "word": "Spaghetti", "category": "Essensgericht" },
            { "word": "Mathilda", "category": "Name (weiblich)" }
          ]
        },
        {
          "id": "gw07",
          "answer": "Safari",
          "words": [
            { "word": "Curling", "category": "Sportart" },
            { "word": "Bentley", "category": "Automarke" },
            { "word": "Amazonas", "category": "Fluss" },
            { "word": "Pagani", "category": "Automarke" },
            { "word": "Hinduismus", "category": "Religion" },
            { "word": "Kuba", "category": "Insel" }
          ]
        },
        {
          "id": "gw08",
          "answer": "Pinguin",
          "words": [
            { "word": "Saturn", "category": "Planet" },
            { "word": "Sizilien", "category": "Insel" },
            { "word": "Roswitha", "category": "Name (weiblich)" },
            { "word": "Anden", "category": "Gebirge" },
            { "word": "Mittagsstunde", "category": "Uhrzeit" },
            { "word": "Sardinien", "category": "Insel" },
            { "word": "Kunigunde", "category": "Name (weiblich)" }
          ]
        },
        {
          "id": "gw09",
          "answer": "Kapsel",
          "words": [
            { "word": "Schienbein", "category": "Körperteil" },
            { "word": "Koenigsegg", "category": "Automarke" },
            { "word": "Neptun", "category": "Planet" },
            { "word": "Fechten", "category": "Sportart" },
            { "word": "Döner", "category": "Essensgericht" },
            { "word": "Bhutan", "category": "Land" }
          ]
        },
        {
          "id": "gw10",
          "answer": "Klavier",
          "words": [
            { "word": "Ohrläppchen", "category": "Körperteil" },
            { "word": "Eritrea", "category": "Land" },
            { "word": "Ferrari", "category": "Automarke" },
            { "word": "Stromboli", "category": "Vulkan" },
            { "word": "Bali", "category": "Insel" },
            { "word": "Currywurst", "category": "Essensgericht" },
            { "word": "Judentum", "category": "Religion" }
          ]
        },
        {
          "id": "gw11",
          "answer": "Bolero",
          "words": [
            { "word": "Feuerwehrmann", "category": "Beruf" },
            { "word": "Sternfrucht", "category": "Obst" },
            { "word": "Kiribati", "category": "Land" },
            { "word": "Paella", "category": "Essensgericht" },
            { "word": "Sikhismus", "category": "Religion" },
            { "word": "Kaktusfeige", "category": "Obst" }
          ]
        },
        {
          "id": "gw12",
          "answer": "Portugal",
          "words": [
            { "word": "Uranus", "category": "Planet" },
            { "word": "Jackfrucht", "category": "Obst" },
            { "word": "Zoroastrismus", "category": "Religion" },
            { "word": "Flamenco", "category": "Tanzstil" },
            { "word": "Abenddämmerung", "category": "Uhrzeit" },
            { "word": "Alpen", "category": "Gebirge" },
            { "word": "Lamborghini", "category": "Automarke" },
            { "word": "Vanuatu", "category": "Land" }
          ]
        },
        {
          "id": "gw13",
          "answer": "Karneval",
          "words": [
            { "word": "Schläfe", "category": "Körperteil" },
            { "word": "Bugatti", "category": "Automarke" },
            { "word": "Jainismus", "category": "Religion" },
            { "word": "Cleopatra", "category": "Name (weiblich)" },
            { "word": "Sushi", "category": "Essensgericht" },
            { "word": "Pinatubo", "category": "Vulkan" },
            { "word": "Maserati", "category": "Automarke" },
            { "word": "Mongolei", "category": "Land" }
          ]
        }
      ]
    },
    {
      "identifier": "merken",
      "name": "Merken",
      "modes": ["DUELL", "TEAM"],
      "maxPoints": 7,
      "scorebarMode": "circle",
      "allCardsFlipped": false,
      "openCards": [],
      "timerState": { "isActive": false, "timeToThinkSeconds": 60 },
      "rules": "Spiel: Merken",
      "cards": [
        "/icons/merken/1.png",  "/icons/merken/2.png",  "/icons/merken/3.png",
        "/icons/merken/4.png",  "/icons/merken/5.png",  "/icons/merken/6.png",
        "/icons/merken/7.png",  "/icons/merken/8.png",  "/icons/merken/9.png",
        "/icons/merken/10.png", "/icons/merken/11.png", "/icons/merken/12.png",
        "/icons/merken/13.png", "/icons/merken/14.png", "/icons/merken/15.png",
        "/icons/merken/16.png", "/icons/merken/17.png", "/icons/merken/18.png",
        "/icons/merken/19.png", "/icons/merken/20.png", "/icons/merken/21.png",
        "/icons/merken/22.png", "/icons/merken/23.png", "/icons/merken/24.png"
      ]
    },
    {
      "identifier": "set",
      "name": "Set",
      "modes": ["DUELL", "TEAM"],
      "maxPoints": 7,
      "scorebarMode": "circle",
      "qIndex": 0,
      "openedCards": [],
      "markedCards": [],
      "markedCardsState": "marked",
      "display": { "cards": false, "markedCards": false },
      "rules": "Spiel: Set",
      "questions": [
        {
          "id": "set1",
          "cards": [
            { "id": "s1c1",  "form": "rectangle", "color": "red",   "fill": "dashed", "amount": 3 },
            { "id": "s1c2",  "form": "diamond",   "color": "green", "fill": "none",   "amount": 3 },
            { "id": "s1c3",  "form": "diamond",   "color": "blue",  "fill": "dashed", "amount": 1 },
            { "id": "s1c4",  "form": "diamond",   "color": "red",   "fill": "dashed", "amount": 3 },
            { "id": "s1c5",  "form": "oval",      "color": "blue",  "fill": "filled", "amount": 1 },
            { "id": "s1c6",  "form": "diamond",   "color": "red",   "fill": "none",   "amount": 1 },
            { "id": "s1c7",  "form": "oval",      "color": "red",   "fill": "filled", "amount": 3 },
            { "id": "s1c8",  "form": "diamond",   "color": "green", "fill": "dashed", "amount": 2 },
            { "id": "s1c9",  "form": "rectangle", "color": "green", "fill": "filled", "amount": 2 },
            { "id": "s1c10", "form": "oval",      "color": "blue",  "fill": "none",   "amount": 1 },
            { "id": "s1c11", "form": "diamond",   "color": "blue",  "fill": "none",   "amount": 1 },
            { "id": "s1c12", "form": "oval",      "color": "red",   "fill": "dashed", "amount": 1 }
          ]
        },
        {
          "id": "set2",
          "cards": [
            { "id": "s2c1",  "form": "diamond",   "color": "blue",  "fill": "dashed", "amount": 2 },
            { "id": "s2c2",  "form": "rectangle", "color": "green", "fill": "dashed", "amount": 1 },
            { "id": "s2c3",  "form": "diamond",   "color": "green", "fill": "dashed", "amount": 2 },
            { "id": "s2c4",  "form": "diamond",   "color": "green", "fill": "filled", "amount": 3 },
            { "id": "s2c5",  "form": "rectangle", "color": "red",   "fill": "dashed", "amount": 1 },
            { "id": "s2c6",  "form": "diamond",   "color": "blue",  "fill": "dashed", "amount": 1 },
            { "id": "s2c7",  "form": "diamond",   "color": "blue",  "fill": "filled", "amount": 2 },
            { "id": "s2c8",  "form": "rectangle", "color": "blue",  "fill": "dashed", "amount": 2 },
            { "id": "s2c9",  "form": "diamond",   "color": "blue",  "fill": "none",   "amount": 1 },
            { "id": "s2c10", "form": "diamond",   "color": "green", "fill": "dashed", "amount": 1 },
            { "id": "s2c11", "form": "diamond",   "color": "blue",  "fill": "none",   "amount": 3 },
            { "id": "s2c12", "form": "oval",      "color": "green", "fill": "dashed", "amount": 2 }
          ]
        },
        {
          "id": "set3",
          "cards": [
            { "id": "s3c1",  "form": "oval",      "color": "red",   "fill": "none",   "amount": 2 },
            { "id": "s3c2",  "form": "diamond",   "color": "green", "fill": "dashed", "amount": 1 },
            { "id": "s3c3",  "form": "oval",      "color": "green", "fill": "filled", "amount": 3 },
            { "id": "s3c4",  "form": "oval",      "color": "blue",  "fill": "dashed", "amount": 2 },
            { "id": "s3c5",  "form": "oval",      "color": "blue",  "fill": "dashed", "amount": 3 },
            { "id": "s3c6",  "form": "rectangle", "color": "blue",  "fill": "dashed", "amount": 2 },
            { "id": "s3c7",  "form": "diamond",   "color": "red",   "fill": "dashed", "amount": 3 },
            { "id": "s3c8",  "form": "oval",      "color": "blue",  "fill": "none",   "amount": 2 },
            { "id": "s3c9",  "form": "oval",      "color": "red",   "fill": "dashed", "amount": 1 },
            { "id": "s3c10", "form": "rectangle", "color": "green", "fill": "filled", "amount": 1 },
            { "id": "s3c11", "form": "diamond",   "color": "green", "fill": "none",   "amount": 2 },
            { "id": "s3c12", "form": "oval",      "color": "blue",  "fill": "filled", "amount": 3 }
          ]
        },
        {
          "id": "set4",
          "cards": [
            { "id": "s4c1",  "form": "rectangle", "color": "green", "fill": "filled", "amount": 2 },
            { "id": "s4c2",  "form": "diamond",   "color": "green", "fill": "filled", "amount": 3 },
            { "id": "s4c3",  "form": "oval",      "color": "blue",  "fill": "dashed", "amount": 2 },
            { "id": "s4c4",  "form": "oval",      "color": "red",   "fill": "filled", "amount": 3 },
            { "id": "s4c5",  "form": "rectangle", "color": "blue",  "fill": "dashed", "amount": 3 },
            { "id": "s4c6",  "form": "diamond",   "color": "red",   "fill": "dashed", "amount": 1 },
            { "id": "s4c7",  "form": "oval",      "color": "green", "fill": "none",   "amount": 1 },
            { "id": "s4c8",  "form": "oval",      "color": "blue",  "fill": "filled", "amount": 2 },
            { "id": "s4c9",  "form": "diamond",   "color": "green", "fill": "filled", "amount": 1 },
            { "id": "s4c10", "form": "diamond",   "color": "green", "fill": "none",   "amount": 1 },
            { "id": "s4c11", "form": "diamond",   "color": "blue",  "fill": "none",   "amount": 3 },
            { "id": "s4c12", "form": "diamond",   "color": "green", "fill": "none",   "amount": 3 }
          ]
        },
        {
          "id": "set5",
          "cards": [
            { "id": "s5c1",  "form": "rectangle", "color": "green", "fill": "filled", "amount": 2 },
            { "id": "s5c2",  "form": "oval",      "color": "red",   "fill": "dashed", "amount": 2 },
            { "id": "s5c3",  "form": "oval",      "color": "green", "fill": "none",   "amount": 1 },
            { "id": "s5c4",  "form": "diamond",   "color": "green", "fill": "filled", "amount": 2 },
            { "id": "s5c5",  "form": "diamond",   "color": "blue",  "fill": "none",   "amount": 2 },
            { "id": "s5c6",  "form": "oval",      "color": "green", "fill": "dashed", "amount": 1 },
            { "id": "s5c7",  "form": "diamond",   "color": "red",   "fill": "dashed", "amount": 3 },
            { "id": "s5c8",  "form": "oval",      "color": "red",   "fill": "dashed", "amount": 1 },
            { "id": "s5c9",  "form": "oval",      "color": "blue",  "fill": "dashed", "amount": 3 },
            { "id": "s5c10", "form": "rectangle", "color": "green", "fill": "none",   "amount": 1 },
            { "id": "s5c11", "form": "diamond",   "color": "blue",  "fill": "filled", "amount": 2 },
            { "id": "s5c12", "form": "rectangle", "color": "green", "fill": "filled", "amount": 1 }
          ]
        },
        {
          "id": "set6",
          "cards": [
            { "id": "s6c1",  "form": "rectangle", "color": "red",   "fill": "none",   "amount": 3 },
            { "id": "s6c2",  "form": "rectangle", "color": "blue",  "fill": "dashed", "amount": 1 },
            { "id": "s6c3",  "form": "rectangle", "color": "red",   "fill": "filled", "amount": 1 },
            { "id": "s6c4",  "form": "diamond",   "color": "green", "fill": "filled", "amount": 3 },
            { "id": "s6c5",  "form": "oval",      "color": "blue",  "fill": "none",   "amount": 1 },
            { "id": "s6c6",  "form": "diamond",   "color": "blue",  "fill": "filled", "amount": 2 },
            { "id": "s6c7",  "form": "oval",      "color": "green", "fill": "dashed", "amount": 1 },
            { "id": "s6c8",  "form": "diamond",   "color": "blue",  "fill": "dashed", "amount": 2 },
            { "id": "s6c9",  "form": "diamond",   "color": "red",   "fill": "dashed", "amount": 1 },
            { "id": "s6c10", "form": "rectangle", "color": "green", "fill": "dashed", "amount": 1 },
            { "id": "s6c11", "form": "diamond",   "color": "blue",  "fill": "none",   "amount": 3 },
            { "id": "s6c12", "form": "oval",      "color": "red",   "fill": "filled", "amount": 3 }
          ]
        },
        {
          "id": "set7",
          "cards": [
            { "id": "s7c1",  "form": "rectangle", "color": "green", "fill": "none",   "amount": 1 },
            { "id": "s7c2",  "form": "diamond",   "color": "green", "fill": "none",   "amount": 1 },
            { "id": "s7c3",  "form": "rectangle", "color": "blue",  "fill": "filled", "amount": 2 },
            { "id": "s7c4",  "form": "rectangle", "color": "red",   "fill": "none",   "amount": 3 },
            { "id": "s7c5",  "form": "rectangle", "color": "blue",  "fill": "none",   "amount": 3 },
            { "id": "s7c6",  "form": "diamond",   "color": "green", "fill": "none",   "amount": 2 },
            { "id": "s7c7",  "form": "oval",      "color": "blue",  "fill": "none",   "amount": 3 },
            { "id": "s7c8",  "form": "rectangle", "color": "red",   "fill": "dashed", "amount": 2 },
            { "id": "s7c9",  "form": "diamond",   "color": "red",   "fill": "dashed", "amount": 1 },
            { "id": "s7c10", "form": "rectangle", "color": "blue",  "fill": "none",   "amount": 2 },
            { "id": "s7c11", "form": "diamond",   "color": "red",   "fill": "dashed", "amount": 3 },
            { "id": "s7c12", "form": "rectangle", "color": "green", "fill": "filled", "amount": 3 }
          ]
        },
        {
          "id": "set8",
          "cards": [
            { "id": "s8c1",  "form": "oval",      "color": "green", "fill": "dashed", "amount": 2 },
            { "id": "s8c2",  "form": "diamond",   "color": "red",   "fill": "none",   "amount": 2 },
            { "id": "s8c3",  "form": "diamond",   "color": "red",   "fill": "filled", "amount": 2 },
            { "id": "s8c4",  "form": "oval",      "color": "red",   "fill": "none",   "amount": 2 },
            { "id": "s8c5",  "form": "oval",      "color": "green", "fill": "none",   "amount": 3 },
            { "id": "s8c6",  "form": "rectangle", "color": "red",   "fill": "filled", "amount": 2 },
            { "id": "s8c7",  "form": "rectangle", "color": "red",   "fill": "filled", "amount": 1 },
            { "id": "s8c8",  "form": "rectangle", "color": "red",   "fill": "dashed", "amount": 3 },
            { "id": "s8c9",  "form": "diamond",   "color": "red",   "fill": "none",   "amount": 1 },
            { "id": "s8c10", "form": "oval",      "color": "red",   "fill": "dashed", "amount": 1 },
            { "id": "s8c11", "form": "rectangle", "color": "blue",  "fill": "dashed", "amount": 2 },
            { "id": "s8c12", "form": "oval",      "color": "red",   "fill": "none",   "amount": 1 }
          ]
        },
        {
          "id": "set9",
          "cards": [
            { "id": "s9c1",  "form": "rectangle", "color": "red",   "fill": "dashed", "amount": 2 },
            { "id": "s9c2",  "form": "rectangle", "color": "green", "fill": "none",   "amount": 2 },
            { "id": "s9c3",  "form": "oval",      "color": "green", "fill": "dashed", "amount": 1 },
            { "id": "s9c4",  "form": "rectangle", "color": "blue",  "fill": "none",   "amount": 3 },
            { "id": "s9c5",  "form": "diamond",   "color": "red",   "fill": "none",   "amount": 3 },
            { "id": "s9c6",  "form": "diamond",   "color": "blue",  "fill": "filled", "amount": 3 },
            { "id": "s9c7",  "form": "rectangle", "color": "green", "fill": "dashed", "amount": 1 },
            { "id": "s9c8",  "form": "oval",      "color": "blue",  "fill": "none",   "amount": 3 },
            { "id": "s9c9",  "form": "rectangle", "color": "blue",  "fill": "none",   "amount": 1 },
            { "id": "s9c10", "form": "rectangle", "color": "green", "fill": "dashed", "amount": 2 },
            { "id": "s9c11", "form": "oval",      "color": "blue",  "fill": "none",   "amount": 1 },
            { "id": "s9c12", "form": "diamond",   "color": "red",   "fill": "dashed", "amount": 1 }
          ]
        },
        {
          "id": "set10",
          "cards": [
            { "id": "s10c1",  "form": "diamond",   "color": "blue",  "fill": "dashed", "amount": 3 },
            { "id": "s10c2",  "form": "diamond",   "color": "green", "fill": "filled", "amount": 2 },
            { "id": "s10c3",  "form": "oval",      "color": "green", "fill": "dashed", "amount": 3 },
            { "id": "s10c4",  "form": "oval",      "color": "red",   "fill": "dashed", "amount": 3 },
            { "id": "s10c5",  "form": "rectangle", "color": "red",   "fill": "filled", "amount": 1 },
            { "id": "s10c6",  "form": "oval",      "color": "red",   "fill": "dashed", "amount": 2 },
            { "id": "s10c7",  "form": "diamond",   "color": "red",   "fill": "dashed", "amount": 3 },
            { "id": "s10c8",  "form": "rectangle", "color": "green", "fill": "dashed", "amount": 2 },
            { "id": "s10c9",  "form": "rectangle", "color": "blue",  "fill": "dashed", "amount": 1 },
            { "id": "s10c10", "form": "rectangle", "color": "green", "fill": "filled", "amount": 3 },
            { "id": "s10c11", "form": "rectangle", "color": "red",   "fill": "dashed", "amount": 1 },
            { "id": "s10c12", "form": "diamond",   "color": "red",   "fill": "dashed", "amount": 1 }
          ]
        },
        {
          "id": "set11",
          "cards": [
            { "id": "s11c1",  "form": "oval",      "color": "blue",  "fill": "filled", "amount": 3 },
            { "id": "s11c2",  "form": "oval",      "color": "red",   "fill": "none",   "amount": 3 },
            { "id": "s11c3",  "form": "diamond",   "color": "blue",  "fill": "filled", "amount": 2 },
            { "id": "s11c4",  "form": "diamond",   "color": "red",   "fill": "dashed", "amount": 2 },
            { "id": "s11c5",  "form": "diamond",   "color": "green", "fill": "dashed", "amount": 1 },
            { "id": "s11c6",  "form": "diamond",   "color": "green", "fill": "none",   "amount": 1 },
            { "id": "s11c7",  "form": "diamond",   "color": "red",   "fill": "dashed", "amount": 3 },
            { "id": "s11c8",  "form": "oval",      "color": "red",   "fill": "none",   "amount": 2 },
            { "id": "s11c9",  "form": "diamond",   "color": "blue",  "fill": "dashed", "amount": 1 },
            { "id": "s11c10", "form": "diamond",   "color": "red",   "fill": "none",   "amount": 3 },
            { "id": "s11c11", "form": "oval",      "color": "red",   "fill": "dashed", "amount": 2 },
            { "id": "s11c12", "form": "diamond",   "color": "blue",  "fill": "none",   "amount": 1 }
          ]
        },
        {
          "id": "set12",
          "cards": [
            { "id": "s12c1",  "form": "rectangle", "color": "blue",  "fill": "none",   "amount": 3 },
            { "id": "s12c2",  "form": "rectangle", "color": "blue",  "fill": "dashed", "amount": 2 },
            { "id": "s12c3",  "form": "diamond",   "color": "red",   "fill": "filled", "amount": 1 },
            { "id": "s12c4",  "form": "rectangle", "color": "red",   "fill": "dashed", "amount": 2 },
            { "id": "s12c5",  "form": "oval",      "color": "blue",  "fill": "filled", "amount": 2 },
            { "id": "s12c6",  "form": "oval",      "color": "green", "fill": "filled", "amount": 3 },
            { "id": "s12c7",  "form": "oval",      "color": "blue",  "fill": "dashed", "amount": 3 },
            { "id": "s12c8",  "form": "oval",      "color": "red",   "fill": "dashed", "amount": 3 },
            { "id": "s12c9",  "form": "diamond",   "color": "blue",  "fill": "dashed", "amount": 2 },
            { "id": "s12c10", "form": "diamond",   "color": "blue",  "fill": "none",   "amount": 2 },
            { "id": "s12c11", "form": "diamond",   "color": "red",   "fill": "filled", "amount": 2 },
            { "id": "s12c12", "form": "diamond",   "color": "blue",  "fill": "filled", "amount": 2 }
          ]
        },
        {
          "id": "set13",
          "cards": [
            { "id": "s13c1",  "form": "diamond",   "color": "green", "fill": "none",   "amount": 1 },
            { "id": "s13c2",  "form": "oval",      "color": "blue",  "fill": "filled", "amount": 2 },
            { "id": "s13c3",  "form": "oval",      "color": "red",   "fill": "none",   "amount": 3 },
            { "id": "s13c4",  "form": "oval",      "color": "blue",  "fill": "dashed", "amount": 3 },
            { "id": "s13c5",  "form": "rectangle", "color": "green", "fill": "dashed", "amount": 1 },
            { "id": "s13c6",  "form": "rectangle", "color": "red",   "fill": "dashed", "amount": 1 },
            { "id": "s13c7",  "form": "diamond",   "color": "blue",  "fill": "dashed", "amount": 3 },
            { "id": "s13c8",  "form": "oval",      "color": "blue",  "fill": "dashed", "amount": 1 },
            { "id": "s13c9",  "form": "diamond",   "color": "red",   "fill": "filled", "amount": 1 },
            { "id": "s13c10", "form": "oval",      "color": "red",   "fill": "dashed", "amount": 1 },
            { "id": "s13c11", "form": "rectangle", "color": "red",   "fill": "none",   "amount": 2 },
            { "id": "s13c12", "form": "diamond",   "color": "green", "fill": "filled", "amount": 3 }
          ]
        }
      ]
    },
    {
      "identifier": "duSagst",
      "name": "Du Sagst...",
      "modes": ["TEAM"],
      "maxPoints": 6,
      "scorebarMode": "circle",
      "qIndex": 0,
      "timeToThinkSeconds": 30,
      "timer": { "id": null, "active": false, "currSeconds": 0, "initSeconds": 30 },
      "teamStates": {
        "t1": {
          "id": "t1-default",
          "boxStates": [
            { "id": "t1-box1", "answerIndex": -1, "answerTheQuestion": true,  "showAnswer": false, "submitted": true },
            { "id": "t1-box2", "answerIndex": -1, "answerTheQuestion": false, "showAnswer": false, "submitted": true }
          ]
        },
        "t2": {
          "id": "t2-default",
          "boxStates": [
            { "id": "t2-box1", "answerIndex": -1, "answerTheQuestion": true,  "showAnswer": false, "submitted": true },
            { "id": "t2-box2", "answerIndex": -1, "answerTheQuestion": false, "showAnswer": false, "submitted": true }
          ]
        }
      },
      "display": { "question": false, "answers": [] },
      "rules": "Spiel: Du Sagst...",
      "questions": [
        {
          "id": "ds1",
          "question": "Was hältst du lieber als Haustier?",
          "answers": [
            { "id": "ds1a1", "text": "Hund" },
            { "id": "ds1a2", "text": "Katze" },
            { "id": "ds1a3", "text": "Hamster" },
            { "id": "ds1a4", "text": "Fisch" }
          ]
        },
        {
          "id": "ds2",
          "question": "Was trinkst du morgens am liebsten?",
          "answers": [
            { "id": "ds2a1", "text": "Kaffee" },
            { "id": "ds2a2", "text": "Tee" },
            { "id": "ds2a3", "text": "Orangensaft" },
            { "id": "ds2a4", "text": "Wasser" }
          ]
        },
        {
          "id": "ds3",
          "question": "Was machst du als erstes nach dem Aufwachen?",
          "answers": [
            { "id": "ds3a1", "text": "Handy checken" },
            { "id": "ds3a2", "text": "Aufstehen" },
            { "id": "ds3a3", "text": "Duschen" },
            { "id": "ds3a4", "text": "Frühstücken" }
          ]
        },
        {
          "id": "ds4",
          "question": "Welches Verkehrsmittel nutzt du am meisten?",
          "answers": [
            { "id": "ds4a1", "text": "Auto" },
            { "id": "ds4a2", "text": "Fahrrad" },
            { "id": "ds4a3", "text": "Bus oder Bahn" },
            { "id": "ds4a4", "text": "Zu Fuß" }
          ]
        },
        {
          "id": "ds5",
          "question": "Was isst du am liebsten auf der Pizza?",
          "answers": [
            { "id": "ds5a1", "text": "Salami" },
            { "id": "ds5a2", "text": "Margherita" },
            { "id": "ds5a3", "text": "Thunfisch" },
            { "id": "ds5a4", "text": "Hawaii" }
          ]
        },
        {
          "id": "ds6",
          "question": "Welche Jahreszeit magst du am liebsten?",
          "answers": [
            { "id": "ds6a1", "text": "Frühling" },
            { "id": "ds6a2", "text": "Sommer" },
            { "id": "ds6a3", "text": "Herbst" },
            { "id": "ds6a4", "text": "Winter" }
          ]
        },
        {
          "id": "ds7",
          "question": "Wo verbringst du am liebsten Urlaub?",
          "answers": [
            { "id": "ds7a1", "text": "Strand" },
            { "id": "ds7a2", "text": "Berge" },
            { "id": "ds7a3", "text": "Stadt" },
            { "id": "ds7a4", "text": "Zuhause bleiben" }
          ]
        },
        {
          "id": "ds8",
          "question": "Was machst du am Wochenende am liebsten?",
          "answers": [
            { "id": "ds8a1", "text": "Freunde treffen" },
            { "id": "ds8a2", "text": "Ausschlafen" },
            { "id": "ds8a3", "text": "Sport machen" },
            { "id": "ds8a4", "text": "Netflix schauen" }
          ]
        },
        {
          "id": "ds9",
          "question": "Welches Tier würdest du als Haustier wählen?",
          "answers": [
            { "id": "ds9a1", "text": "Hund" },
            { "id": "ds9a2", "text": "Katze" },
            { "id": "ds9a3", "text": "Vogel" },
            { "id": "ds9a4", "text": "Keins" }
          ]
        },
        {
          "id": "ds10",
          "question": "Was isst du am liebsten zum Frühstück?",
          "answers": [
            { "id": "ds10a1", "text": "Müsli" },
            { "id": "ds10a2", "text": "Brötchen" },
            { "id": "ds10a3", "text": "Eier" },
            { "id": "ds10a4", "text": "Nichts" }
          ]
        },
        {
          "id": "ds11",
          "question": "Welchen Film-/Seriengenre schaust du am liebsten?",
          "answers": [
            { "id": "ds11a1", "text": "Action" },
            { "id": "ds11a2", "text": "Komödie" },
            { "id": "ds11a3", "text": "Horror" },
            { "id": "ds11a4", "text": "Dokumentation" }
          ]
        }
      ]
    },
    {
      "identifier": "zehnSetzen",
      "name": "Zehn Setzen",
      "modes": ["DUELL", "TEAM"],
      "maxPoints": 10,
      "scorebarMode": "number",
      "qIndex": 0,
      "teamStates": {
        "t1": { "id": "t1", "answerScores": [0, 0, 0, 0], "submitted": false },
        "t2": { "id": "t2", "answerScores": [0, 0, 0, 0], "submitted": false }
      },
      "display": { "question": false, "answers": [], "correctAnswer": false, "teamScores": { "t1": false, "t2": false } },
      "rules": "Spiel: Zehn Setzen",
      "questions": [
        {
          "id": "zs1",
          "question": "Welches Land hat die längste Küstenlinie der Welt?",
          "answers": [
            { "id": "zs1a1", "answer": "Russland" },
            { "id": "zs1a2", "answer": "Kanada" },
            { "id": "zs1a3", "answer": "Norwegen" },
            { "id": "zs1a4", "answer": "Australien" }
          ],
          "correctAnswer": { "id": "zs1a2", "answer": "Kanada" }
        },
        {
          "id": "zs2",
          "question": "Welches chemische Element hat das Symbol Au?",
          "answers": [
            { "id": "zs2a1", "answer": "Silber" },
            { "id": "zs2a2", "answer": "Aluminium" },
            { "id": "zs2a3", "answer": "Gold" },
            { "id": "zs2a4", "answer": "Kupfer" }
          ],
          "correctAnswer": { "id": "zs2a3", "answer": "Gold" }
        },
        {
          "id": "zs3",
          "question": "Wer schrieb das Werk 'Also sprach Zarathustra'?",
          "answers": [
            { "id": "zs3a1", "answer": "Arthur Schopenhauer" },
            { "id": "zs3a2", "answer": "Immanuel Kant" },
            { "id": "zs3a3", "answer": "Friedrich Nietzsche" },
            { "id": "zs3a4", "answer": "Georg Wilhelm Friedrich Hegel" }
          ],
          "correctAnswer": { "id": "zs3a3", "answer": "Friedrich Nietzsche" }
        },
        {
          "id": "zs4",
          "question": "Welche Hauptstadt liegt am weitesten nördlich?",
          "answers": [
            { "id": "zs4a1", "answer": "Oslo" },
            { "id": "zs4a2", "answer": "Helsinki" },
            { "id": "zs4a3", "answer": "Reykjavik" },
            { "id": "zs4a4", "answer": "Stockholm" }
          ],
          "correctAnswer": { "id": "zs4a3", "answer": "Reykjavik" }
        },
        {
          "id": "zs5",
          "question": "In welchem Jahr wurde die Berliner Mauer errichtet?",
          "answers": [
            { "id": "zs5a1", "answer": "1956" },
            { "id": "zs5a2", "answer": "1959" },
            { "id": "zs5a3", "answer": "1961" },
            { "id": "zs5a4", "answer": "1963" }
          ],
          "correctAnswer": { "id": "zs5a3", "answer": "1961" }
        },
        {
          "id": "zs6",
          "question": "Welcher Künstler malte 'Die Erschaffung Adams' auf der Sixtinischen Kapelle?",
          "answers": [
            { "id": "zs6a1", "answer": "Leonardo da Vinci" },
            { "id": "zs6a2", "answer": "Raffael" },
            { "id": "zs6a3", "answer": "Michelangelo" },
            { "id": "zs6a4", "answer": "Caravaggio" }
          ],
          "correctAnswer": { "id": "zs6a3", "answer": "Michelangelo" }
        },
        {
          "id": "zs7",
          "question": "Welcher Kontinent hat die meisten Länder?",
          "answers": [
            { "id": "zs7a1", "answer": "Asien" },
            { "id": "zs7a2", "answer": "Europa" },
            { "id": "zs7a3", "answer": "Amerika" },
            { "id": "zs7a4", "answer": "Afrika" }
          ],
          "correctAnswer": { "id": "zs7a4", "answer": "Afrika" }
        },
        {
          "id": "zs8",
          "question": "Wie viele Meter ist der Mariannengraben tief (gerundet)?",
          "answers": [
            { "id": "zs8a1", "answer": "7.000 m" },
            { "id": "zs8a2", "answer": "9.000 m" },
            { "id": "zs8a3", "answer": "11.000 m" },
            { "id": "zs8a4", "answer": "13.000 m" }
          ],
          "correctAnswer": { "id": "zs8a3", "answer": "11.000 m" }
        },
        {
          "id": "zs9",
          "question": "Welches Organ produziert die Gallenflüssigkeit?",
          "answers": [
            { "id": "zs9a1", "answer": "Milz" },
            { "id": "zs9a2", "answer": "Bauchspeicheldrüse" },
            { "id": "zs9a3", "answer": "Niere" },
            { "id": "zs9a4", "answer": "Leber" }
          ],
          "correctAnswer": { "id": "zs9a4", "answer": "Leber" }
        },
        {
          "id": "zs10",
          "question": "Welche Programmiersprache wurde von Guido van Rossum entwickelt?",
          "answers": [
            { "id": "zs10a1", "answer": "Ruby" },
            { "id": "zs10a2", "answer": "Python" },
            { "id": "zs10a3", "answer": "Perl" },
            { "id": "zs10a4", "answer": "Java" }
          ],
          "correctAnswer": { "id": "zs10a2", "answer": "Python" }
        },
        {
          "id": "zs11",
          "question": "Welches Land gewann die erste Fußball-Weltmeisterschaft 1930?",
          "answers": [
            { "id": "zs11a1", "answer": "Brasilien" },
            { "id": "zs11a2", "answer": "Argentinien" },
            { "id": "zs11a3", "answer": "Uruguay" },
            { "id": "zs11a4", "answer": "Italien" }
          ],
          "correctAnswer": { "id": "zs11a3", "answer": "Uruguay" }
        },
        {
          "id": "zs12",
          "question": "Wie viele Kilometer pro Sekunde bewegt sich Licht im Vakuum?",
          "answers": [
            { "id": "zs12a1", "answer": "100.000 km/s" },
            { "id": "zs12a2", "answer": "200.000 km/s" },
            { "id": "zs12a3", "answer": "300.000 km/s" },
            { "id": "zs12a4", "answer": "400.000 km/s" }
          ],
          "correctAnswer": { "id": "zs12a3", "answer": "300.000 km/s" }
        },
        {
          "id": "zs13",
          "question": "In welchem Land liegt Machu Picchu?",
          "answers": [
            { "id": "zs13a1", "answer": "Bolivien" },
            { "id": "zs13a2", "answer": "Kolumbien" },
            { "id": "zs13a3", "answer": "Chile" },
            { "id": "zs13a4", "answer": "Peru" }
          ],
          "correctAnswer": { "id": "zs13a4", "answer": "Peru" }
        },
        {
          "id": "zs14",
          "question": "Welche Musikrichtung entstand in Jamaika?",
          "answers": [
            { "id": "zs14a1", "answer": "Calypso" },
            { "id": "zs14a2", "answer": "Reggae" },
            { "id": "zs14a3", "answer": "Bossa Nova" },
            { "id": "zs14a4", "answer": "Samba" }
          ],
          "correctAnswer": { "id": "zs14a2", "answer": "Reggae" }
        },
        {
          "id": "zs15",
          "question": "Wie viele Knochen hat ein erwachsener Mensch?",
          "answers": [
            { "id": "zs15a1", "answer": "176" },
            { "id": "zs15a2", "answer": "196" },
            { "id": "zs15a3", "answer": "206" },
            { "id": "zs15a4", "answer": "226" }
          ],
          "correctAnswer": { "id": "zs15a3", "answer": "206" }
        }
      ]
    },
    {
      "identifier": "fragenhagel",
      "name": "Fragenhagel",
      "modes": ["DUELL"],
      "maxPoints": 20,
      "scorebarMode": "number",
      "qIndex": 0,
      "currentScore": 0,
      "activePlayerId": null,
      "buzzerCount": 0,
      "timerState": { "isActive": false, "seconds": 0 },
      "intervalState": { "start": -1, "end": -1 },
      "rules": "Spiel: Fragenhagel",
      "configuredIntervals": [
        { "id": "fi1", "label": "Intervall 1", "start": 25, "end": 30 },
        { "id": "fi2", "label": "Intervall 2", "start": 32, "end": 37 },
        { "id": "fi3", "label": "Intervall 3", "start": 41, "end": 46 }
      ],
      "questions": [
        { "id": "fh01", "question": "Wie heißt die Hauptstadt von Frankreich?",                    "answer": "Paris" },
        { "id": "fh02", "question": "Welches ist das kleinste Land der Welt?",                     "answer": "Vatikan" },
        { "id": "fh03", "question": "Wie heißt der größte Ozean der Erde?",                       "answer": "Pazifik" },
        { "id": "fh04", "question": "Was ist die Hauptstadt von Deutschland?",                     "answer": "Berlin" },
        { "id": "fh05", "question": "Wie viele Kontinente gibt es?",                               "answer": "7" },
        { "id": "fh06", "question": "Wie heißt die Hauptstadt von Australien?",                   "answer": "Canberra" },
        { "id": "fh07", "question": "In welchem Land steht der Eiffelturm?",                     "answer": "Frankreich" },
        { "id": "fh08", "question": "Welches ist das schnellste Landtier?",                       "answer": "Gepard" },
        { "id": "fh09", "question": "Wie viele Planeten hat unser Sonnensystem?",                 "answer": "8" },
        { "id": "fh10", "question": "Was ist H₂O?",                                              "answer": "Wasser" },
        { "id": "fh11", "question": "Welches ist das größte Tier der Welt?",                     "answer": "Blauwal" },
        { "id": "fh12", "question": "Wie viele Buchstaben hat das deutsche Alphabet?",            "answer": "26" },
        { "id": "fh13", "question": "Welche Sprache wird in Brasilien gesprochen?",               "answer": "Portugiesisch" },
        { "id": "fh14", "question": "In welchem Meer liegt Mallorca?",                            "answer": "Mittelmeer" },
        { "id": "fh15", "question": "Aus welchem Material besteht eine Geige hauptsächlich?",    "answer": "Holz" },
        { "id": "fh16", "question": "Wie nennt man flüssiges Gestein aus einem Vulkan?",         "answer": "Lava" },
        { "id": "fh17", "question": "Wer schrieb Romeo und Julia?",                               "answer": "Shakespeare" },
        { "id": "fh18", "question": "Wie viele Wochen hat ein Jahr?",                             "answer": "52" },
        { "id": "fh19", "question": "Welcher Planet ist der größte im Sonnensystem?",             "answer": "Jupiter" },
        { "id": "fh20", "question": "Wie heißt der längste Fluss der Welt?",                     "answer": "Nil" },
        { "id": "fh21", "question": "Wie viele Stunden hat ein Tag?",                             "answer": "24" },
        { "id": "fh22", "question": "Welches Tier ist das Symbol der Demokratischen Partei der USA?", "answer": "Esel" },
        { "id": "fh23", "question": "Wie heißt der höchste Berg der Welt?",                      "answer": "Mount Everest" },
        { "id": "fh24", "question": "Wie viele Beine hat eine Spinne?",                           "answer": "8" },
        { "id": "fh25", "question": "Welche Farbe hat eine reife Banane?",                       "answer": "Gelb" },
        { "id": "fh26", "question": "Wie viele Zähne hat ein erwachsener Mensch?",                "answer": "32" },
        { "id": "fh27", "question": "Welches Tier ist das Nationaltier Australiens?",             "answer": "Känguru" },
        { "id": "fh28", "question": "Wie viele Beine hat ein Insekt?",                            "answer": "6" },
        { "id": "fh29", "question": "In welchem Kontinent liegt Ägypten?",                       "answer": "Afrika" },
        { "id": "fh30", "question": "Wie heißt der kleinste Planet im Sonnensystem?",            "answer": "Merkur" },
        { "id": "fh31", "question": "Wie viele Karten hat ein normales Kartenspiel?",             "answer": "52" },
        { "id": "fh32", "question": "Welches Land hat die meisten Einwohner?",                   "answer": "China" },
        { "id": "fh33", "question": "Welcher Komponist war für einen Großteil seines Lebens taub?", "answer": "Beethoven" },
        { "id": "fh34", "question": "Welche Farbe hat der Smaragd?",                             "answer": "Grün" },
        { "id": "fh35", "question": "Wie viele Tage hat Februar in einem Schaltjahr?",            "answer": "29" },
        { "id": "fh36", "question": "Wie viele Töne hat eine Durtonleiter?",                      "answer": "7" },
        { "id": "fh37", "question": "Welches Gas atmen wir ein?",                                "answer": "Sauerstoff" },
        { "id": "fh38", "question": "In welcher Stadt steht das Kolosseum?",                     "answer": "Rom" },
        { "id": "fh39", "question": "Welcher Planet hat die meisten Monde im Sonnensystem?",     "answer": "Saturn" },
        { "id": "fh40", "question": "Wie viele Knochen hat ein erwachsener Mensch?",              "answer": "206" },
        { "id": "fh41", "question": "Welche Farbe hat der Rubin?",                               "answer": "Rot" },
        { "id": "fh42", "question": "Wie viele Spieler stehen in einer Fußballmannschaft auf dem Platz?", "answer": "11" },
        { "id": "fh43", "question": "In welchem Jahr fiel die Berliner Mauer?",                  "answer": "1989" },
        { "id": "fh44", "question": "Wie heißt der Zauberer aus Harry Potter?",                  "answer": "Harry Potter" },
        { "id": "fh45", "question": "Welches Element hat das chemische Symbol O?",               "answer": "Sauerstoff" },
        { "id": "fh46", "question": "Wie viele Farben hat ein Regenbogen?",                       "answer": "7" },
        { "id": "fh47", "question": "Wer malte die Mona Lisa?",                                  "answer": "Leonardo da Vinci" },
        { "id": "fh48", "question": "In welchem Jahr begann der Erste Weltkrieg?",               "answer": "1914" },
        { "id": "fh49", "question": "Wie heißt der Schöpfer der Relativitätstheorie?",          "answer": "Einstein" },
        { "id": "fh50", "question": "Wie viele Augen hat eine Biene?",                           "answer": "5" },
        { "id": "fh51", "question": "Wie nennt man einen schlafenden Vulkan?",                   "answer": "Ruhender Vulkan" },
        { "id": "fh52", "question": "Welches Instrument hat 88 Tasten?",                         "answer": "Klavier" },
        { "id": "fh53", "question": "Wie heißt der Gegenspieler von Batman?",                   "answer": "Joker" },
        { "id": "fh54", "question": "Welches Tier kann am höchsten springen (relativ zur Körpergröße)?", "answer": "Floh" },
        { "id": "fh55", "question": "Wie viele Sterne hat die US-Flagge?",                        "answer": "50" },
        { "id": "fh56", "question": "In welchem Organ wird Insulin produziert?",                 "answer": "Bauchspeicheldrüse" },
        { "id": "fh57", "question": "Wie heißt der Held aus der Legende von Zelda?",            "answer": "Link" },
        { "id": "fh58", "question": "Wie heißt der Fluss, an dem Paris liegt?",                  "answer": "Seine" },
        { "id": "fh59", "question": "In welchem Land wurde Pizza erfunden?",                     "answer": "Italien" },
        { "id": "fh60", "question": "Wie nennt man die Angst vor Spinnen?",                      "answer": "Arachnophobie" }
      ]
    }
  ]$games$,
  NULL,
  true,
  'PUBLIC',
  'MEDIUM',
  false,
  false,
  false,
  NULL,
  NULL,
  NOW(),
  NOW()
);
