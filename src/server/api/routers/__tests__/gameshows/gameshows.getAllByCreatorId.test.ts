import { assert, describe, expect, it } from "vitest";
import { TRPCError } from "@trpc/server";
import { getTestCaller } from "__tests__/utils";

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

  it("Should return all gameshows created by the authenticated user", async () => {
    const caller = getTestCaller({
      user: {
        id: "1",
        role: "USER",
        username: "testuser",
        email: ""
      },
      expires: "2100-01-01T00:00:00.000Z"
    });

    const result = await caller.gameshows.getAllByCreatorId();

    expect(result).toHaveLength(3); // Updated: Now includes imported+modified gameshow

    const firstGameshow = result[0];
    assert(firstGameshow);

    expect(firstGameshow.id).toBe("1");
    expect(firstGameshow.numOfGames).toBe(2);
  });
});
