import { describe, it, expect, beforeEach, vi } from "vitest";
import { getTestCaller } from "__tests__/utils";
import { TRPCError } from "@trpc/server";
import { MOCK_USERS } from "__mock__/mockUsers";

describe("usersRouter -> getAll", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Get all users -> should throw UNAUTHORIZED", async () => {
    const caller = getTestCaller(null);

    await expect(caller.users.getAll()).rejects.toThrowError(
      new TRPCError({
        code: "UNAUTHORIZED",
        message: "Du musst angemeldet sein, um die Aktion auszuführen"
      })
    );
  });

  it("Admin get all users -> should return all users", async () => {
    const caller = getTestCaller({
      user: {
        id: "1",
        role: "ADMIN",
        username: "admin",
        email: ""
      },
      expires: "2100-01-01T00:00:00.000Z"
    });

    const result = await caller.users.getAll();

    expect(result).toHaveLength(MOCK_USERS.length);
  });
});
