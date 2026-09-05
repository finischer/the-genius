import type { GameshowDifficulty } from "~/generated/prisma/client";

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
