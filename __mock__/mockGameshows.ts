import type { Gameshow } from "@prisma/client";

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
