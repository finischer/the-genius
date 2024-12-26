import { describe, expect, it } from "vitest";
import { TRPCError } from "@trpc/server";
import { getTestCaller } from "__tests__/utils";

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
      expect(result[0]?.user.username).toBeDefined();
    }
  });
});
