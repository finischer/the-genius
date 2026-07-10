import { describe, expect, it } from "vitest";
import { TRPCError } from "@trpc/server";
import { getTestCaller } from "__tests__/utils";

describe("gameshowsRouter -> publishGameshow", () => {
  it("Unauthed -> UNAUTHORIZED", async () => {
    const caller = getTestCaller(null);
    await expect(
      caller.gameshows.publishGameshow({
        gameshowId: "1",
        name: "Published Show",
        description: "Public desc",
        difficultyLevel: "HARD"
      })
    ).rejects.toThrowError(
      new TRPCError({
        code: "UNAUTHORIZED",
        message: "Du musst angemeldet sein, um die Aktion auszuführen"
      })
    );
  });

  it("Auth -> NOT_FOUND if not found or not owned", async () => {
    const caller = getTestCaller({
      user: { id: "1", username: "Test user", role: "USER" },
      expires: "2099-12-31T23:59:59.999Z"
    });

    await expect(
      caller.gameshows.publishGameshow({
        gameshowId: "invalid-id",
        name: "Should fail",
        description: "desc",
        difficultyLevel: "EASY"
      })
    ).rejects.toThrowError(
      new TRPCError({
        code: "NOT_FOUND",
        message: "Gameshow konnte nicht gespeichert werden"
      })
    );
  });

  it("Auth -> FORBIDDEN when trying to publish unmodified imported gameshow", async () => {
    const caller = getTestCaller({
      user: { id: "2", username: "Test user", role: "USER" },
      expires: "2099-12-31T23:59:59.999Z"
    });

    await expect(
      caller.gameshows.publishGameshow({
        gameshowId: "3", // This is an imported gameshow (importedGameshow: true, isModified: false)
        name: "Should fail",
        description: "This should not work",
        difficultyLevel: "EASY"
      })
    ).rejects.toThrowError(
      new TRPCError({
        code: "FORBIDDEN",
        message:
          "Unveränderte importierte Spielshows können nicht veröffentlicht werden. Bitte bearbeiten Sie die Spielshow zuerst."
      })
    );
  });

  it("Auth -> SUCCESS when publishing modified imported gameshow", async () => {
    const caller = getTestCaller({
      user: { id: "1", username: "Test user", role: "USER" },
      expires: "2099-12-31T23:59:59.999Z"
    });

    const result = await caller.gameshows.publishGameshow({
      gameshowId: "5", // This is a modified imported gameshow (importedGameshow: true, isModified: true)
      name: "Modified Import Published",
      description: "This should work now",
      difficultyLevel: "HARD"
    });

    expect(result).toBeDefined();
    expect(result.id).toBe("5");
    expect(result.visibility).toBe("PUBLIC");
    expect(result.description).toBe("This should work now");
  });

  it("Auth -> publishes the gameshow (visibility=PUBLIC)", async () => {
    const caller = getTestCaller({
      user: { id: "1", username: "Test user", role: "USER" },
      expires: "2099-12-31T23:59:59.999Z"
    });

    const result = await caller.gameshows.publishGameshow({
      gameshowId: "1",
      name: "Final Show",
      description: "We go public",
      difficultyLevel: "MEDIUM"
    });

    expect(result).toBeDefined();
    expect(result.id).toBe("1");
    expect(result.visibility).toBe("PUBLIC");
    expect(result.description).toBe("We go public");
  });
});
