import type { TTheGeniusConfig } from "~/types/config.types";

export const TheGeniusConfig: TTheGeniusConfig = {
  appTitle: "TheGenius",
  socialMedia: {
    buyMeACoffee: "https://www.buymeacoffee.com/niklasfischer"
  },
  gameshow: {
    difficultLevels: {
      VERY_EASY: {
        name: "Anfängerabenteuer",
        description:
          "Ideal für alle, die den ersten Schritt in die Welt der Wissensspiele wagen. Die Fragen sind so freundlich, dass sogar deine Haustiere mitmachen könnten."
      },
      EASY: {
        name: "Knobel-Kapitäne",
        description:
          "Für die, die gerne ein bisschen herausgefordert werden, aber immer noch ein entspanntes Spiel wünschen. Eine Reise durch das Wissen mit ein paar kleinen Rätseln, um das Gehirn in Schwung zu bringen."
      },
      MEDIUM: {
        name: "Denker-Duell",
        description:
          "Hier wird das Wissen schon auf die Probe gestellt. Die Fragen sind anspruchsvoll, aber nicht so schwer, dass man die Wörterbücher hervorholen muss. Perfekt für ambitionierte Quiz-Fans."
      },
      HARD: {
        name: "Brainiac Battle",
        description:
          "Bereite dich auf einige knifflige Herausforderungen vor, die dich wirklich ins Schwitzen bringen könnten. Nur für jene, die das Unbekannte mit einem Lächeln begrüßen."
      },
      VERY_HARD: {
        name: "Mastermind Madness",
        description:
          "Nur die Tapfersten wagen es, diesen Grad zu wählen. Die Fragen sind so anspruchsvoll, dass selbst Einstein staunen würde. Hier geht es um den ultimativen Test deines Wissens und deiner Kreativität."
      }
    }
  }
};
