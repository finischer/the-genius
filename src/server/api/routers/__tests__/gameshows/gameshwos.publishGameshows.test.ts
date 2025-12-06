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
