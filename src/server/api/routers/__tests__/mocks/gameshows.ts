import { createMockProcedure } from "~/server/api/routers/__tests__/utils/mock-utils";
import type { gameshowsRouter } from "~/server/api/routers/gameshows";
import { protectedProcedure, t } from "~/server/api/trpc";

export const mockGameshows = t.router({
  getAllByCreatorId: protectedProcedure.query(
    createMockProcedure<typeof gameshowsRouter.getAllByCreatorId>([
      {
        id: "1",
        creatorId: "1",
        name: "Gameshow #1",
        numOfGames: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        isFavorite: false,
        games: [],
        visibility: "PUBLIC",
        difficulty: "EASY",
        originalCreatorId: null,
        originalGameshowId: null,
        importedGameshow: false
      }
    ])
  )
});
