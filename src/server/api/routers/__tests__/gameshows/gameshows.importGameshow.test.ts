import { describe, expect, it, vi } from "vitest";
import { TRPCError } from "@trpc/server";
import { getTestCaller } from "__tests__/utils";
import { prisma } from "~/server/db";
import type { Gameshow } from "~/generated/prisma/client";

describe("gameshowsRouter -> importGameshow", () => {
  it("Unauthed -> UNAUTHORIZED", async () => {
    const caller = getTestCaller(null);
    await expect(
      caller.gameshows.importGameshow({ gameshowId: "1" })
    ).rejects.toThrowError(
      new TRPCError({
        code: "UNAUTHORIZED",
        message: "Du musst angemeldet sein, um die Aktion auszuführen"
      })
    );
  });

  it("Auth -> NOT_FOUND if game does not exist", async () => {
    const caller = getTestCaller({
      user: { id: "1", username: "Test user", role: "USER" },
      expires: "2100-01-01T00:00:00.000Z"
    });

    await expect(
      caller.gameshows.importGameshow({ gameshowId: "not-there" })
    ).rejects.toThrowError(
      new TRPCError({
        code: "NOT_FOUND",
        message: "Gameshow konnte nicht gefunden werden"
      })
    );
  });

  it("Auth -> FORBIDDEN if importedGameshow===true", async () => {
    const caller = getTestCaller({
      user: { id: "1", username: "Test user", role: "USER" },
      expires: "2100-01-01T00:00:00.000Z"
    });

    await expect(
      caller.gameshows.importGameshow({ gameshowId: "3" })
    ).rejects.toThrowError(
      new TRPCError({
        code: "FORBIDDEN",
        message: "You can't import an imported gameshow."
      })
    );
  });

  it("Auth -> FORBIDDEN if visibility=PRIVATE", async () => {
    const caller = getTestCaller({
      user: { id: "1", username: "Test user", role: "USER" },
      expires: "2100-01-01T00:00:00.000Z"
    });

    // Mock => { visibility: "PRIVATE" }
    await expect(
      caller.gameshows.importGameshow({ gameshowId: "2" })
    ).rejects.toThrowError(
      new TRPCError({
        code: "FORBIDDEN",
        message: "You can't import a private gameshow."
      })
    );
  });

  it("Auth -> successfully imports the gameshow", async () => {
    const caller = getTestCaller({
      user: { id: "1", username: "Test user", role: "USER" },
      expires: "2100-01-01T00:00:00.000Z"
    });

    const result = await caller.gameshows.importGameshow({
      gameshowId: "4"
    });

    expect(result).toBeDefined();
    // Der Router erzeugt eine neue Gameshow mit neuem "id" (ObjectId) und setzt "importedGameshow = true"
    expect(result.importedGameshow).toBe(true);
    expect(result.isModified).toBe(false); // Should initially be false
    expect(result.originalGameshowId).toBe("4");
    expect(result.originalCreatorId).toBe("2"); // Original creator ID should be preserved
    expect(result.creatorId).toBe("1"); // But current user should be the new creator
  });

  /**
   * Property 9: importGameshow mit NULL-creatorId
   * Validates: Requirements 5.1, 5.2
   *
   * For any official gameshow (where creatorId = NULL), calling importGameshow SHALL succeed
   * and the newly created gameshow record SHALL have originalCreatorId = NULL and creatorId
   * set to the importing user's ID.
   */
  it("Property 9 – Auth -> successfully imports official gameshow (creatorId=null), originalCreatorId is null", async () => {
    const importingUserId = "1";
    const caller = getTestCaller({
      user: { id: importingUserId, username: "Test user", role: "USER" },
      expires: "2100-01-01T00:00:00.000Z"
    });

    const officialGameshow: Gameshow = {
      id: "official-id",
      creatorId: null,
      name: "Official Gameshow",
      description: "Curated by the platform",
      games: [],
      visibility: "PUBLIC",
      importedGameshow: false,
      isOfficial: true,
      isFavorite: false,
      difficulty: "MEDIUM",
      originalCreatorId: null,
      originalGameshowId: null,
      isModified: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    vi.mocked(prisma.gameshow.findFirst).mockResolvedValueOnce(
      officialGameshow
    );

    const result = await caller.gameshows.importGameshow({
      gameshowId: "official-id"
    });

    // Verify the create call captured the correct originalCreatorId
    const createCall = vi.mocked(prisma.gameshow.create).mock.calls.at(-1);
    expect(createCall).toBeDefined();
    expect(createCall![0].data.originalCreatorId).toBeNull();
    expect(createCall![0].data.creatorId).toBe(importingUserId);

    // Verify the returned record reflects the correct values
    expect(result).toBeDefined();
    expect(result.originalCreatorId).toBeNull();
    expect(result.creatorId).toBe(importingUserId);
    expect(result.importedGameshow).toBe(true);
    expect(result.originalGameshowId).toBe("official-id");
  });
});
