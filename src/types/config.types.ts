import type { GameshowDifficulty } from "~/generated/prisma/enums";

export type TTheGeniusConfig = {
  appTitle: string;
  socialMedia: {
    buyMeACoffee: string;
  };
  gameshow: {
    difficultLevels: Record<
      GameshowDifficulty,
      {
        name: string;
        description: string;
      }
    >;
  };
};
