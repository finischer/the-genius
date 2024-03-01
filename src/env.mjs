import { z } from "zod";
import { createEnv } from "@t3-oss/env-nextjs";

const environments = z.enum(["development", "test", "production"]);

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    MONGODB_URI: z.string().url(),
    NODE_ENV: environments,
    NEXTAUTH_SECRET: process.env.NODE_ENV === "production" ? z.string().min(1) : z.string().min(1).optional(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    DISCORD_CLIENT_ID: z.string(),
    DISCORD_CLIENT_SECRET: z.string(),
    SOCKET_IO_ADMIN_USERNAME: z.string().min(1),
    SOCKET_IO_ADMIN_PASSWORD: z.string().min(1),
    WEBSITE_URL: z.string().min(1),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_THE_GENIUS_ENV: z.string().min(1),
    NEXT_PUBLIC_GTAG_ID:
      process.env.NEXT_PUBLIC_GTAG_ID === "production" ? z.string().min(1) : z.string().min(1).optional(),
    NEXT_PUBLIC_PARTYKIT_HOST: z.string().min(1),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    MONGODB_URI: process.env.MONGODB_URI,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
    SOCKET_IO_ADMIN_PASSWORD: process.env.SOCKET_IO_ADMIN_PASSWORD,
    SOCKET_IO_ADMIN_USERNAME: process.env.SOCKET_IO_ADMIN_USERNAME,
    WEBSITE_URL: process.env.WEBSITE_URL,
    NEXT_PUBLIC_THE_GENIUS_ENV: process.env.NEXT_PUBLIC_THE_GENIUS_ENV,
    NEXT_PUBLIC_GTAG_ID: process.env.NEXT_PUBLIC_GTAG_ID,
    NEXT_PUBLIC_PARTYKIT_HOST: process.env.NEXT_PUBLIC_PARTYKIT_HOST,
  },
});
