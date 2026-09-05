import type { Prisma } from "~/generated/prisma/client";

export type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    gameshows: true;
  };
}>;
