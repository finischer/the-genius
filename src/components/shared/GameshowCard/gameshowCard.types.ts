import type { Game, GameshowDifficulty } from "@prisma/client";

export interface IGameshowCardProps {
  id: string;
  title: string;
  creator: string;
  description: string;
  games: Game[];
  difficulty: GameshowDifficulty;
}
