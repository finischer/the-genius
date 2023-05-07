import { type User } from "@prisma/client";

export const filterUserForClient = (user: User) => {
  return {
    id: user.id,
    name: user.username,
    image: user.image,
    gameshows: user.gameshows,
    email: user.email,
    role: user.role,
  };
};
