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

    expect(result).toHaveLength(2);

    const firstGameshow = result[0];
    assert(firstGameshow);

    expect(firstGameshow.id).toBe("1");
    expect(firstGameshow.numOfGames).toBe(2);
  });
});

describe("gameshowsRouter -> getById", () => {
  it("Unauthed user should not be possible to get gameshow by id", async () => {
    const caller = getTestCaller(null);

    await expect(
      caller.gameshows.getById({
        gameshowId: "1"
      })
    ).rejects.toThrowError(
      new TRPCError({
        code: "UNAUTHORIZED",
        message: "Du musst angemeldet sein, um die Aktion auszuführen"
      })
    );
  });

  it("Authed user should not be possible to get gameshow by id if it does not exist", async () => {
    const caller = getTestCaller({
      user: {
        id: "1",
        role: "USER",
        username: "testuser",
        email: ""
      },
      expires: "2100-01-01T00:00:00.000Z"
    });

    await expect(
      caller.gameshows.getById({
        gameshowId: "123"
      })
    ).rejects.toThrowError(
      new TRPCError({
        code: "NOT_FOUND",
        message: "Gameshow not found"
      })
    );
  });

  it("Authed user and gameshow exists", async () => {
    const caller = getTestCaller({
      user: {
        id: "1",
        role: "USER",
        username: "testuser",
        email: ""
      },
      expires: "2100-01-01T00:00:00.000Z"
    });

    const result = await caller.gameshows.getById({
      gameshowId: "1"
    });

    expect(result).toBeDefined();

    expect(result.id).toBe("1");
    expect(result.creatorId).toBe("1");
  });
});
