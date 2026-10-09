export const FLAGGEN_GAME_NAME = "Flaggen";

export const FLAGGEN_GAME = {
  identifier: "flaggen",
  name: FLAGGEN_GAME_NAME,
  maxPoints: 7,
  scorebarMode: "circle",
  modes: ["DUELL", "TEAM"],
  countries: [
    { id: "de", shortCode: "de", country: "Deutschland" },
    { id: "fr", shortCode: "fr", country: "Frankreich" }
  ],
  qIndex: 0,
  display: { answer: false, country: false },
  rules: ""
};
