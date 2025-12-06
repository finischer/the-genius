import { describe, expect, it } from "vitest";
import { TRPCError } from "@trpc/server";
import { getTestCaller } from "__tests__/utils";

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
    expect(result.originalGameshowId).toBe("4");
  });
});
