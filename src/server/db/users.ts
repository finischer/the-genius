import { prisma } from "../db";

/**
 * Updates the login timestmap of given User in database. It will return false when User was not found.
 */
export async function updateLoginTimestamp(userId: string) {
  const userExists = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!userExists) return false;

  try {
    const res = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        lastLoginAt: new Date(),
      },
    });

    return res;
  } catch {
    console.info(`Login timestamp will not be updated. It is the first login for User ${userId}`);
  }
}
