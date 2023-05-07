import { User } from "@prisma/client";

export const filterUserForClient = (user: User) => {
  return {
    id: user.id,
    name: user.name,
    image: user.image,
    gameshows: user.gameshows,
    email: user.email,
  };
};
