import { describe, it, expect, beforeEach, vi } from "vitest";
import { getTestCaller } from "__tests__/utils";
import { TRPCError } from "@trpc/server";

describe("usersRouter -> updateUserByAdmin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Unauthed user -> UNAUTHORIZED", async () => {
    const caller = getTestCaller(null);

    await expect(
      caller.users.updateUserByAdmin({
        id: "1",
        data: {
          email: "  "
        }
      })
    ).rejects.toThrowError(
      new TRPCError({
        code: "UNAUTHORIZED",
        message: "Du musst angemeldet sein, um die Aktion auszuführen"
      })
    );
  });

  it("Auth user -> FORBIDDEN", async () => {
    const caller = getTestCaller({
      user: {
        id: "1",
        username: "Test user",
        role: "USER"
      },
      expires: "2100-01-01T00:00:00.000Z"
    });

    await expect(
      caller.users.updateUserByAdmin({
        id: "1",
        data: {
          email: "  "
        }
      })
    ).rejects.toThrowError(
      new TRPCError({
        code: "FORBIDDEN",
        message: "Nur ein Admin kann diese Aktion ausführen"
      })
    );
  });

  it("Auth user -> updates the user", async () => {
    const adminCaller = getTestCaller({
      user: {
        id: "1",
        role: "ADMIN",
        username: "admin",
        email: ""
      },
      expires: "2100-01-01T00:00:00.000Z"
    });

    const result = await adminCaller.users.updateUserByAdmin({
      id: "1",
      data: {
        username: "Alice2"
      }
    });

    expect(result).toBeDefined();
    expect(result.username).toBe("Alice2");
  });
});
