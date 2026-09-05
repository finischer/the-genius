import { type Prisma } from "~/generated/prisma/enums";

export type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    gameshows: true;
  };
}>;
