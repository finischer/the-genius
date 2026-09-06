import { describe, expect, it, vi } from "vitest";
import { TRPCError } from "@trpc/server";
import { getTestCaller, mockFindManyGameshows } from "__tests__/utils";
import { prisma } from "~/server/db";
import {
  GameshowDifficulty,
  GameshowVisbility
} from "~/generated/prisma/enums";

describe("gameshowsRouter -> getPublicGameshows", () => {
  it("Unauthed user -> should throw UNAUTHORIZED", async () => {
    const caller = getTestCaller(null);

    await expect(caller.gameshows.getPublicGameshows()).rejects.toThrowError(
      new TRPCError({
        code: "UNAUTHORIZED",
        message: "Du musst angemeldet sein, um die Aktion auszuführen"
      })
    );
  });

  it("Auth user -> returns list of public gameshows", async () => {
    const caller = getTestCaller({
      user: { id: "some-user-id", username: "Test User", role: "USER" },
      expires: "2100-01-01T00:00:00.000Z"
    });

    const result = await caller.gameshows.getPublicGameshows();

    expect(Array.isArray(result)).toBe(true);

    if (result.length) {
      // Beispiel: Prüfe, ob Fields da sind
      expect(result[0]?.id).toBeDefined();
      expect(result[0]?.difficulty).toBeDefined();
    }
  });

  /**
   * Property 8: Serialisierung von user (NULL vs. vorhanden)
   * NULL-user → `undefined`; vorhandener user → `{ id, username }` oder `"UNKNOWN_USER"` als Fallback
   * Validates: Requirements 4.4, 4.5
   */

  const AUTHED_SESSION = {
    user: { id: "some-user-id", username: "Test User", role: "USER" },
    expires: "2100-01-01T00:00:00.000Z"
  } as const;

  const BASE_SELECT_RESULT = {
    id: "gs-p8",
    name: "Property 8 Show",
    description: "Desc",
    games: [],
    difficulty: GameshowDifficulty.MEDIUM,
    isOfficial: false,
    originalCreatorId: null,
    originalGameshowId: null,
    importedGameshow: false
  };

  it("Property 8a: NULL-user in DB → user field is undefined in response", async () => {
    vi.mocked(prisma.gameshow.findMany).mockResolvedValueOnce([
      { ...BASE_SELECT_RESULT, user: null } as never
    ]);

    const caller = getTestCaller(AUTHED_SESSION);
    const result = await caller.gameshows.getPublicGameshows();

    expect(result).toHaveLength(1);
    expect(result[0]?.user).toBeUndefined();
  });

  it("Property 8b: present user in DB → serialized as { id, username }", async () => {
    vi.mocked(prisma.gameshow.findMany).mockResolvedValueOnce([
      { ...BASE_SELECT_RESULT, user: { id: "u1", username: "alice" } } as never
    ]);

    const caller = getTestCaller(AUTHED_SESSION);
    const result = await caller.gameshows.getPublicGameshows();

    expect(result).toHaveLength(1);
    expect(result[0]?.user).toEqual({ id: "u1", username: "alice" });
  });

  it("Property 8c: user with null username → username falls back to 'UNKNOWN_USER'", async () => {
    vi.mocked(prisma.gameshow.findMany).mockResolvedValueOnce([
      { ...BASE_SELECT_RESULT, user: { id: "u2", username: null } } as never
    ]);

    const caller = getTestCaller(AUTHED_SESSION);
    const result = await caller.gameshows.getPublicGameshows();

    expect(result).toHaveLength(1);
    expect(result[0]?.user).toEqual({ id: "u2", username: "UNKNOWN_USER" });
  });

  /**
   * Property 6: getPublicGameshows schließt keine NULL-creatorId-Gameshows aus
   *
   * Validates: Requirements 4.1, 4.2
   */
  it("Property 6: includes PUBLIC gameshow with creatorId=null (official gameshow without user)", async () => {
    const officialGameshow = {
      id: "official-1",
      creatorId: null,
      name: "Official Gameshow",
      description: "An official gameshow without a creator",
      games: [],
      visibility: "PUBLIC" as const,
      difficulty: "MEDIUM" as const,
      isOfficial: true,
      originalCreatorId: null,
      originalGameshowId: null,
      importedGameshow: null,
      isModified: null,
      isFavorite: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      user: null
    };

    mockFindManyGameshows([officialGameshow]);

    const caller = getTestCaller({
      user: { id: "some-user-id", username: "Test User", role: "USER" },
      expires: "2100-01-01T00:00:00.000Z"
    });

    const result = await caller.gameshows.getPublicGameshows();

    const found = result.find((g) => g.id === "official-1");
    expect(found).toBeDefined();
    expect(found?.isOfficial).toBe(true);
    expect(found?.user).toBeUndefined();
  });

  /**
   * Property 7: Serialisierungsinvariante für isOfficial
   *
   * Jedes zurückgegebene Objekt enthält `isOfficial` mit dem Datenbankwert.
   * Validates: Requirements 4.3
   */
  it("Property 7: every returned gameshow contains isOfficial matching the stored DB value", async () => {
    const caller = getTestCaller({
      user: { id: "1", username: "Alice", role: "USER" },
      expires: "2100-01-01T00:00:00.000Z"
    });

    mockFindManyGameshows([
      {
        id: "official-2",
        creatorId: null,
        name: "Offizielle Gameshow",
        description: "Eine offizielle Gameshow",
        games: [],
        visibility: GameshowVisbility.PUBLIC,
        difficulty: GameshowDifficulty.MEDIUM,
        isOfficial: true,
        isFavorite: false,
        originalCreatorId: null,
        originalGameshowId: null,
        importedGameshow: false,
        isModified: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "regular-2",
        creatorId: "2",
        name: "Reguläre Gameshow",
        description: "Eine reguläre Gameshow",
        games: [],
        visibility: GameshowVisbility.PUBLIC,
        difficulty: GameshowDifficulty.EASY,
        isOfficial: false,
        isFavorite: false,
        originalCreatorId: null,
        originalGameshowId: null,
        importedGameshow: false,
        isModified: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    const result = await caller.gameshows.getPublicGameshows();

    expect(result).toHaveLength(2);

    // Every returned object must have an isOfficial field
    for (const gameshow of result) {
      expect(gameshow).toHaveProperty("isOfficial");
      expect(typeof gameshow.isOfficial).toBe("boolean");
    }

    // Values must match the stored DB values
    const official = result.find((g) => g.id === "official-2");
    const regular = result.find((g) => g.id === "regular-2");

    expect(official?.isOfficial).toBe(true);
    expect(regular?.isOfficial).toBe(false);
  });
});
