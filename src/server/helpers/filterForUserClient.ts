import { type UserWithRelations } from "~/types/prisma.types";

export const filterUserForClient = (user: UserWithRelations) => {
  return {
    id: user.id,
    name: user.username,
    image: user.image,
    gameshows: user.gameshows,
    email: user.email,
    role: user.role,
  };
};
