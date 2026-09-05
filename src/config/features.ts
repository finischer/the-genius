import type { UserRole } from "~/generated/prisma/client";

type TFeaturesMap = {
  [index in UserRole]: {
    maxNumGameshows: number;
  };
};

export const FEATURES: TFeaturesMap = {
  GUEST: {
    maxNumGameshows: 0
  },
  USER: {
    maxNumGameshows: 3
  },
  PREMIUM: {
    maxNumGameshows: 20
  },
  ADMIN: {
    maxNumGameshows: Infinity
  }
};
