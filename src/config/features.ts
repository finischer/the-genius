import type { UserRole } from "@prisma/client";

type TFeaturesMap = {
  [index in UserRole]: {
    maxNumGameshows: number;
  };
};

export const FEATURES: TFeaturesMap = {
  USER: {
    maxNumGameshows: 3,
  },
  PREMIUM: {
    maxNumGameshows: 20,
  },
  ADMIN: {
    maxNumGameshows: Infinity,
  },
};
