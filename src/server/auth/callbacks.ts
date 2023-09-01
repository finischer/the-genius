import type { CallbacksOptions, Session } from "next-auth";
import type { DiscordProfile } from "next-auth/providers/discord";
import type { GoogleProfile } from "next-auth/providers/google";
import { prisma } from "../db";

const isOtherProviderAlreadyInUse = async (
  userEmail: string | null | undefined,
  provider: string
) => {
  if (!userEmail) throw new Error("Email is null or undefined");

  const user = await prisma.user.findUnique({
    where: {
      email: userEmail,
    },
    include: {
      accounts: true,
    },
  });

  if (!user) {
    throw new Error("This User does not exists");
  }

  // check if another provider is already in use
  const alreadyUsedProviders = user.accounts.filter(
    (acc) => acc.provider !== provider
  );

  return alreadyUsedProviders.length > 0;
};

export const signInCallback: CallbacksOptions["signIn"] = async ({
  user,
  account,
  profile,
}) => {
  if (
    account &&
    (await isOtherProviderAlreadyInUse(user.email, account.provider))
  ) {
    // other provider already in use
    throw new Error("Ein anderer Account nutzt diese Email bereits!");
  }

  if (account?.provider === "google") {
    const googleProfile: GoogleProfile = profile as GoogleProfile;
    const canSignIn =
      googleProfile.email_verified &&
      googleProfile.email.endsWith("@gmail.com");

    return canSignIn;
  } else if (account?.provider === "discord") {
    const discordProfile = profile as DiscordProfile;
    return discordProfile.verified;
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
    const newUsername = newSession.user.username ?? "";

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
