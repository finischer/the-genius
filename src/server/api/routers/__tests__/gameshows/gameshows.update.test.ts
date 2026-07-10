import { describe, expect, it } from "vitest";
import { TRPCError } from "@trpc/server";
import { getTestCaller } from "__tests__/utils";

describe("gameshowsRouter -> update", () => {
  it("Unauthed user -> UNAUTHORIZED", async () => {
    const caller = getTestCaller(null);

    await expect(
      caller.gameshows.update({
        gameshowId: "1",
        updatedGameshow: { name: "updated name" }
      })
    ).rejects.toThrowError(
      new TRPCError({
        code: "UNAUTHORIZED",
        message: "Du musst angemeldet sein, um die Aktion auszuführen"
      })
    );
  });

  it("Auth user -> NOT_FOUND if gameshow doesn't exist (or not owned)", async () => {
    const caller = getTestCaller({
      user: { id: "user-1", username: "Test user", role: "USER" },
      expires: "2100-01-01T00:00:00.000Z"
    });

    await expect(
      caller.gameshows.update({
        gameshowId: "non-existing-id",
        updatedGameshow: { name: "Should fail" }
      })
    ).rejects.toThrowError(
      new TRPCError({
        code: "NOT_FOUND",
        message: "Gameshow konnte nicht gespeichert werden"
      })
    );
  });

  it("Auth user -> updates an existing gameshow", async () => {
    const caller = getTestCaller({
      user: { id: "1", username: "Test user", role: "USER" },
      expires: "2100-01-01T00:00:00.000Z"
    });

    const result = await caller.gameshows.update({
      gameshowId: "1",
      updatedGameshow: {
        name: "Updated Name",
        games: [{}, {}]
      }
    });

    expect(result).toBeDefined();
    expect(result.name).toBe("Updated Name");
  });

  it("Auth user -> marks imported gameshow as modified when updated", async () => {
    const caller = getTestCaller({
      user: { id: "2", username: "Test user", role: "USER" },
      expires: "2100-01-01T00:00:00.000Z"
    });

    const result = await caller.gameshows.update({
      gameshowId: "3", // This is an imported gameshow (importedGameshow: true, isModified: false)
      updatedGameshow: {
        name: "Updated Imported Gameshow",
        games: [{}]
      }
    });

    expect(result).toBeDefined();
    expect(result.name).toBe("Updated Imported Gameshow");
    expect(result.isModified).toBe(true); // Should now be marked as modified
  });
});
