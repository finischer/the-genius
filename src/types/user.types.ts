import type { SafedUser } from "~/server/api/routers/users";

export type TUserReduced = Pick<
  SafedUser,
  "id" | "name" | "email" | "image" | "role" | "username"
>;
