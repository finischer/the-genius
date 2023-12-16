import { ObjectId } from "bson";
import type { CallbacksOptions, Session } from "next-auth";
import type { DiscordProfile } from "next-auth/providers/discord";
import type { GoogleProfile } from "next-auth/providers/google";
import { capitalize } from "~/utils/strings";
import { prisma } from "../db";
import { updateLoginTimestamp } from "../db/users";
import { getOrCreateObjectId } from "~/utils/database";

const isOtherProviderAlreadyInUse = async (userEmail: string | null | undefined, provider: string) => {
  if (!userEmail) throw new Error("Email is null or undefined");

  const user = await prisma.user.findUnique({
    where: {
      email: userEmail,
    },
    include: {
      accounts: true,
    },
  });

  if (!user) return false; // no user found, so no other provider is used

  // check if another provider is already in use
  const alreadyUsedProviders = user.accounts.filter((acc) => acc.provider !== provider);

  return alreadyUsedProviders.length > 0;
};

// ONLY DURING TEST PHASE
const MAX_USERS = 150;
const maxUsersReached = async (userEmail: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email: userEmail,
    },
    select: {
      id: true,
    },
  });

  // if user already exists, user can log in
  if (user) return false;

  // check if users collection is full
  const users = await prisma.user.findMany({
    select: {
      id: true,
    },
  });

  if (users.length >= MAX_USERS) return true;

  return false;
};

export const signInCallback: CallbacksOptions["signIn"] = async ({ user, account, profile }) => {
  if (!user.email) throw new Error("Es wurde keine Email in der Anfrage angegeben");

  if (!user.isEmailVerified)
    throw new Error(
      `Deine Email bei ${capitalize(account?.provider ?? "PROVIDER_NOT_FOUND")} wurde noch nicht verifiziert`
    );

  if (account && (await isOtherProviderAlreadyInUse(user.email, account.provider))) {
    // other provider already in use
    throw new Error("Ein anderer Account nutzt diese Email bereits!");
  }

  if (await maxUsersReached(user.email)) {
    throw new Error("Die maximale Anzahl an Usern ist leider schon erreicht wurden");
  }

  let canSignIn = false;
  if (account?.provider === "google") {
    const googleProfile: GoogleProfile = profile as GoogleProfile;
    canSignIn = googleProfile.email_verified && googleProfile.email.endsWith("@gmail.com");
  } else if (account?.provider === "discord") {
    const discordProfile = profile as DiscordProfile;
    canSignIn = discordProfile.verified;
  }

  if (canSignIn) {
    const userId = getOrCreateObjectId(user.id);

    // update last login timestamp in database
    await updateLoginTimestamp(userId);

    return true;
  }

  throw new Error(
    `Anmeldung mit ${capitalize(account?.provider.toUpperCase() ?? "PROVIDER_NOT_FOUND")} ist fehlgeschlagen`
  );
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
      throw new Error(`Der Username "${newUsername}" ist leider schon vergeben 🙁`);
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
