import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions
} from "next-auth";
import { prisma } from "~/server/db";
import { jwtCallback, sessionCallback, signInCallback } from "./auth/callbacks";
import DiscordProvider from "./auth/providers/DiscordProvider";
import GoogleProvider from "./auth/providers/GoogleProvider";
import LocalCredentialsProvider from "./auth/providers/LocalCredentialsProvider";
import { isDevelopmentServer } from "~/utils/environment";
import { UserRole } from "~/generated/prisma/enums";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */

export const DEFAULT_ROLE: UserRole = UserRole.USER;

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: UserRole;
      username: string | undefined;
    } & DefaultSession["user"];
  }

  interface User {
    role: UserRole;
    username?: string;
    isEmailVerified: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    username: string | undefined;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */

export const authOptions: NextAuthOptions = {
  callbacks: {
    signIn: signInCallback,
    session: sessionCallback,
    jwt: isDevelopmentServer ? jwtCallback : undefined,
    redirect: ({ baseUrl }) => {
      return baseUrl;
    }
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider,
    DiscordProvider,
    // Add local credentials provider if isDevelopment
    ...(isDevelopmentServer ? [LocalCredentialsProvider] : [])
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error"
  },
  session: {
    strategy: isDevelopmentServer ? "jwt" : "database"
  },
  // Enable debug messages in the console if you are having problems
  debug: isDevelopmentServer
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
