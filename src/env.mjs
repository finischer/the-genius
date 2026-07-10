import { z } from "zod";
import { createEnv } from "@t3-oss/env-nextjs";

const environments = z.enum(["development", "staging", "production"]);

// In CI, we use default values for missing secrets
const isCI = process.env.CI === "true";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    MONGODB_URI: z.string().min(1),
    NODE_ENV: environments,
    APP_ENV: environments,
    NEXTAUTH_SECRET:
      process.env.APP_ENV === "production"
        ? z.string().min(1)
        : z.string().min(1).optional(),
    GOOGLE_CLIENT_ID: z.string().default(""),
    GOOGLE_CLIENT_SECRET: z.string().default(""),
    DISCORD_CLIENT_ID: z.string().default(""),
    DISCORD_CLIENT_SECRET: z.string().default(""),
    SOCKET_IO_ADMIN_USERNAME: z.string().min(1),
    SOCKET_IO_ADMIN_PASSWORD: z.string().min(1),
    WEBSITE_URL: z.string().min(1)
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_THE_GENIUS_ENV: z.string().min(1),
    NEXT_PUBLIC_GTAG_ID:
      process.env.NEXT_PUBLIC_GTAG_ID === "production"
        ? z.string().min(1)
        : z.string().min(1).optional(),
    NEXT_PUBLIC_PARTYKIT_HOST: z.string().min(1),
    NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1),
    NEXT_PUBLIC_POSTHOG_HOST: z.string().min(1)
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    MONGODB_URI: process.env.MONGODB_URI || (isCI ? "mongodb://localhost:27017/test" : undefined),
    NODE_ENV: process.env.NODE_ENV,
    APP_ENV: process.env.APP_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || (isCI ? "test-secret" : undefined),
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
    SOCKET_IO_ADMIN_PASSWORD: process.env.SOCKET_IO_ADMIN_PASSWORD || (isCI ? "test-password" : undefined),
    SOCKET_IO_ADMIN_USERNAME: process.env.SOCKET_IO_ADMIN_USERNAME || (isCI ? "test-username" : undefined),
    WEBSITE_URL: process.env.WEBSITE_URL || (isCI ? "http://localhost:3000" : undefined),
    NEXT_PUBLIC_THE_GENIUS_ENV: process.env.NEXT_PUBLIC_THE_GENIUS_ENV || (isCI ? "development" : undefined),
    NEXT_PUBLIC_GTAG_ID: process.env.NEXT_PUBLIC_GTAG_ID,
    NEXT_PUBLIC_PARTYKIT_HOST: process.env.NEXT_PUBLIC_PARTYKIT_HOST || (isCI ? "localhost:1999" : undefined),
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY || (isCI ? "test-posthog-key" : undefined),
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST || (isCI ? "https://eu.i.posthog.com" : undefined)
  }
});
