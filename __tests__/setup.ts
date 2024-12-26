import { vi } from "vitest";
import { MOCK_GAMESHOWS } from "../__mock__/mockGameshows";
import type { Prisma } from "@prisma/client";
import { MOCK_USERS } from "__mock__/mockUsers";

vi.mock("~/server/db", () => {
  return {
    prisma: {
      gameshow: {
        create: vi
          .fn()
          .mockImplementation((args: Prisma.GameshowCreateArgs) => {
            return {
              ...args.data,
              id: "created-id",
              description: "",
              createdAt: new Date(),
              updatedAt: new Date(),
              isFavorite: false,
              visibility: "PRIVATE",
              difficulty: null,
              originalCreatorId: null,
              originalGameshowId: null,
              importedGameshow: false
            };
          }),
        count: vi.fn(),
        findMany: vi
          .fn()
          .mockImplementation((args: Prisma.GameshowFindManyArgs) => {
            let result = [...MOCK_GAMESHOWS];

            // Filter by where clause keys
            if (args?.where) {
              result = result.filter((show) => {
                const keys = Object.keys(args.where || {});
                return keys.every((key) => {
                  // @ts-ignore
                  return show[key] === args.where[key];
                });
              });
            }

            // 2) Check, ob user included/selected ist
            //    => Dann "joinen" wir den User aus MOCK_USERS
            //    Dies ist nur ein Demo, real kannst du differenziert auf
            //    include: { user: { select: ... } } reagieren
            const wantUser = Boolean(args.include?.user || args.select?.user);

            if (wantUser) {
              result = result.map((show) => {
                const user = MOCK_USERS.find((u) => u.id === show.creatorId);
                return {
                  ...show,
                  user: user ?? null
                };
              });
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
