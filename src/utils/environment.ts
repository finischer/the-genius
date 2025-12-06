export const isProduction = process.env.APP_ENV === "production";
export const isStaging = process.env.APP_ENV === "staging";
export const isDevelopmentServer = process.env.APP_ENV === "development";
export const isDevelopmentClient =
  process.env.NEXT_PUBLIC_DEBUG_MODE === "true";
