import { describe, expect, it, vitest } from "vitest";
import { TRPCError } from "@trpc/server";
import { getTestCaller } from "__tests__/utils";
import { prisma } from "~/server/db";

describe("gameshowsRouter -> delete", () => {
  it("Unauthed user -> UNAUTHORIZED", async () => {
    const caller = getTestCaller(null);

    await expect(
      caller.gameshows.delete({ gameshowId: "1" })
    ).rejects.toThrowError(
      new TRPCError({
        code: "UNAUTHORIZED",
        message: "Du musst angemeldet sein, um die Aktion auszuführen"
      })
    );
  });

  it("Auth user -> FORBIDDEN if no matching gameshow found", async () => {
    const caller = getTestCaller({
      user: { id: "user-42", username: "Test user", role: "USER" },
      expires: "2100-01-01T00:00:00.000Z"
    });

    await expect(
      caller.gameshows.delete({ gameshowId: "something" })
    ).rejects.toThrowError(
      new TRPCError({
        code: "FORBIDDEN"
      })
    );
  });

  it("Auth user -> deletes the gameshow", async () => {
    const caller = getTestCaller({
      user: { id: "1", username: "Test user", role: "USER" },
      expires: "2100-01-01T00:00:00.000Z"
    });

    const deleteSpy = vitest.spyOn(prisma.gameshow, "delete");
    const result = await caller.gameshows.delete({ gameshowId: "1" });

    expect(deleteSpy).toHaveBeenCalledWith({
      where: { id: "1" }
    });

    expect(result).toBeDefined();
    expect(result.id).toBe("1");
  });
});
