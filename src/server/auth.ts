import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
  type Profile,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider, { type GoogleProfile } from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";

import { type UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import { prisma } from "~/server/db";
import { sendVerificationRequest } from "./emailService";
import { filterUserForClient } from "./helpers/filterForUserClient";
import type { OAuthProvider } from "next-auth/providers";
import type { CallbacksOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import { ObjectId } from "bson";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
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

const sessionCallback: CallbacksOptions["session"] = async ({
  session,
  token,
  trigger,
}) => {
  if (session.user && token.sub) {
    session.user.name = token.name;
    session.user.email = token.email;
    session.user.id = token.sub;
    session.user.username = token.username;
    session.user.role = token.role;

    if (trigger === "update" && token.username) {
      session.user.username = token.username;
    }
  }

  return {
    ...session,
  };
};

const jwtCallback: CallbacksOptions["jwt"] = async ({
  session,
  token,
  trigger,
}) => {
  token.id = token.sub ?? "";

  console.log("Token: ", token);
  if (trigger === "update" && session) {
    token.username = session.user.username;

    // update user in database
    const newUser = await prisma.user.update({
      where: {
        id: token.id,
      },
      data: {
        username: token.username,
      },
    });
  }

  return {
    ...token,
  };
};

export const authOptions: NextAuthOptions = {
  callbacks: {
    signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        const googleProfile: GoogleProfile = profile as GoogleProfile;
        const canSignIn =
          googleProfile.email_verified &&
          googleProfile.email.endsWith("@gmail.com");

        return canSignIn;
      }

      if (user) {
        return true;
      }
      return false;
    },
    session: sessionCallback,
    jwt: jwtCallback,
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    // CredentialsProvider({
    //   name: "credentials",
    //   credentials: {
    //     email: {
    //       label: "E-Mail",
    //       type: "email",
    //       placeholder: "Deine E-Mail",
    //     },
    //     password: {
    //       label: "Passwort",
    //       type: "password",
    //       placeholder: "Dein Passwort",
    //     },
    //   },
    //   async authorize(credentials) {
    //     if (!credentials?.email || !credentials?.password) {
    //       throw new Error("Du hast keine Zugangsdaten eingegeben");
    //     }

    //     const user = await prisma.user.findUnique({
    //       where: { email: credentials.email },
    //       include: {
    //         gameshows: true,
    //       },
    //     });

    //     if (!user || !user?.password) {
    //       throw new Error("Es existiert kein User mit dieser E-Mail 🙁");
    //     }

    //     const isCorrectPassword = await bcrypt.compare(
    //       credentials.password,
    //       user.password
    //     );

    //     if (!isCorrectPassword) {
    //       throw new Error(
    //         "Du musst dich beim Passwort vertippt haben. Probiere es nochmal. Ich schaue auch nicht hin 🫣"
    //       );
    //     }

    //     return filterUserForClient(user);
    //   },
    // }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      profile(profile: GoogleProfile, tokens) {
        console.log("Google Profile: ", { profile, tokens });
        console.log("Profile sub: ", profile.sub);
        return {
          id: profile.sub,
          role: "USER",
          emailVerified: profile.email_verified,
          name: profile.given_name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
    // EmailProvider({
    //   server: {
    //     host: process.env.EMAIL_SERVER_HOST,
    //     port: Number(process.env.EMAIL_SERVER_PORT),
    //     auth: {
    //       user: process.env.EMAIL_SERVER_USER,
    //       pass: process.env.EMAIL_SERVER_PASSWORD,
    //     },
    //   },
    //   from: process.env.EMAIL_FROM,
    //   sendVerificationRequest,
    // }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
  },
  // Enable debug messages in the console if you are having problems
  debug: process.env.NODE_ENV === "development",
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
