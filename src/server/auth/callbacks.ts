import type { CallbacksOptions, Session } from "next-auth";
import { prisma } from "../db";
import type { GoogleProfile } from "next-auth/providers/google";

export const signInCallback: CallbacksOptions["signIn"] = ({
  user,
  account,
  profile,
}) => {
  console.log("signIn callback", { user, account, profile });
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
};

export const sessionCallback: CallbacksOptions["session"] = async ({
  session,
  trigger,
  newSession: toValidateNewSession,
  user,
}) => {
  if (user) {
    session.user.id = user.id;
    session.user.username = user.username;
    session.user.role = user.role;
  }

  if (trigger === "update") {
    const newSession = toValidateNewSession as Session;
    const newUsername = newSession.user.username;

    const newUser = await prisma.user.findUnique({
      where: { username: newUsername },
    });

    if (newUser) {
      throw new Error(
        `Der Username "${newUsername}" ist leider schon vergeben 🙁`
      );
    }

    session = newSession;

    await prisma.user.update({
      where: {
        id: newSession.user.id,
      },
      data: {
        username: newUsername,
      },
    });
  }

  return {
    ...session,
  };
};
