import type { GameshowDifficulty } from "~/generated/prisma/enums";

export type TTheGeniusConfig = {
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
