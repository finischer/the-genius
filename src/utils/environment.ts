import { env } from "~/env.mjs";

export const isProduction =
  process.env.NODE_ENV === "production" && env.NEXT_PUBLIC_THE_GENIUS_ENV === "production";
