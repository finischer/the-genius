import { vi } from "vitest";
import { MOCK_GAMESHOWS } from "./mock_data";
import type { Prisma } from "@prisma/client";

vi.mock("~/server/db", () => {
  return {
    prisma: {
      gameshow: {
        findMany: vi
          .fn()
          .mockImplementation((args: Prisma.GameshowFindManyArgs) => {
            let result = MOCK_GAMESHOWS;

            // Falls 'where.creatorId' definiert ist, filtern:
            if (args?.where?.creatorId) {
              result = result.filter(
                (show) => args.where && show.creatorId === args.where.creatorId
              );
            }

            return result;
          }),
        findFirst: vi
          .fn()
          .mockImplementation((args: Prisma.GameshowFindFirstArgs) => {
            const found = MOCK_GAMESHOWS.find((g) => {
              const idMatches = args.where?.id === g.id;
              const creatorMatches = args.where?.creatorId === g.creatorId;
              return idMatches && creatorMatches;
            });
            return found ?? null;
          })
      }
    }
  };
});
