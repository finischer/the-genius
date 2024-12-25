import { assert, describe, expect, it, vi } from "vitest";

// Important: First mock before importing the module
vi.mock("~/server/db", () => {
  return {
    prisma: {
      gameshow: {
        findMany: vi.fn()
        // findFirst, create, update, delete... je nachdem, was du brauchst
      }
    }
  };
});

import { TRPCError } from "@trpc/server";
import { getOrCreateObjectId } from "~/utils/database";
import { getTestCaller, mockFindManyGameshows } from "__tests__/utils";

describe("gameshowsRouter -> getAllByCreatorId", () => {
  it("Unauthed user should not be possible to get gameshows from other users", async () => {
    const caller = getTestCaller(null);

    await expect(caller.gameshows.getAllByCreatorId()).rejects.toThrowError(
      new TRPCError({
        code: "UNAUTHORIZED",
        message: "Du musst angemeldet sein, um die Aktion auszuführen"
      })
    );
  });

  it("gibt Gameshows zurück, wenn ein User eingeloggt ist", async () => {
    mockFindManyGameshows([
      {
        id: "1",
        creatorId: "1",
        name: "Gameshow #1",
        games: [{}, {}],
        createdAt: new Date(),
        updatedAt: new Date(),
        isFavorite: false,
        visibility: "PRIVATE",
        originalCreatorId: null,
        originalGameshowId: null,
        difficulty: "EASY",
        importedGameshow: null,
        description: ""
      }
    ]);

    const caller = getTestCaller({
      user: {
        id: getOrCreateObjectId("1"),
        role: "USER",
        username: "testuser",
        email: ""
      },
      expires: "2100-01-01T00:00:00.000Z"
    });

    const result = await caller.gameshows.getAllByCreatorId();

    expect(result).toHaveLength(1);

    const firstGameshow = result[0];
    assert(firstGameshow);

    expect(firstGameshow.id).toBe("1");
    expect(firstGameshow.numOfGames).toBe(2);
  });
});
