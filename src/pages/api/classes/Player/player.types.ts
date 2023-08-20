import type { Player } from "@prisma/client";

export type TPlayer = Omit<Player, "id" | "states">;
