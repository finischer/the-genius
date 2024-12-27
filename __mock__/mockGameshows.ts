import type { Gameshow } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import { MOCK_USERS } from "__mock__/mockUsers";
import { vi } from "vitest";

export const MOCK_GAMESHOWS: Gameshow[] = [
  {
    id: "1",
    creatorId: "1",
    description: "Test Gameshow",
    name: "Test Gameshow",
    createdAt: new Date(),
    updatedAt: new Date(),
    isFavorite: false,
    games: [{}, {}],
    visibility: "PRIVATE",
    difficulty: "EASY",
    originalCreatorId: null,
    originalGameshowId: null,
    importedGameshow: false
  },
  {
    id: "2",
    creatorId: "1",
    description: "Test Gameshow 2",
    name: "Test Gameshow 2",
    createdAt: new Date(),
    updatedAt: new Date(),
    isFavorite: false,
    games: [],
    visibility: "PRIVATE",
    difficulty: "EASY",
    originalCreatorId: null,
    originalGameshowId: null,
    importedGameshow: false
  },
  {
    id: "3",
    creatorId: "2",
    description: "Test Gameshow 3",
    name: "Test Gameshow 3",
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
];

export const GAMESHOW_MOCK_FUNCTIONS = {
  delete: vi.fn().mockImplementation((args: Prisma.GameshowDeleteArgs) => {
    const showIndex = MOCK_GAMESHOWS.findIndex((g) => g.id === args.where.id);

    if (showIndex === -1) {
      return null;
    }

    const deletedShow = MOCK_GAMESHOWS[showIndex];
    MOCK_GAMESHOWS.splice(showIndex, 1);

    return deletedShow;
  }),
  update: vi.fn().mockImplementation((args: Prisma.GameshowUpdateArgs) => {
    // updates the gameshow in the mock data
    const updatedShow = MOCK_GAMESHOWS.find((g) => g.id === args.where.id);

    if (!updatedShow) {
      return null;
    }

    // Updates every key in the data object
    for (const key in args.data) {
      const newValue = args.data[key as keyof Prisma.GameshowUpdateInput];
      (updatedShow as any)[key] = newValue;
    }

    return updatedShow;
  }),
  create: vi.fn().mockImplementation((args: Prisma.GameshowCreateArgs) => {
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
  findMany: vi.fn().mockImplementation((args: Prisma.GameshowFindManyArgs) => {
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
};
