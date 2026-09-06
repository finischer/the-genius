import { describe, it, beforeEach, vi } from "vitest";
import { getTestCaller } from "__tests__/utils";
import { TRPCError } from "@trpc/server";
import { MOCK_USERS } from "__mock__/mockUsers";
import { prisma } from "~/server/db";
import type { User } from "~/generated/prisma/client";
import { FilterOperator } from "~/components/shared/DataTable/dataTable.types";

// ── Helpers ───────────────────────────────────────────────────────────────────

const now = new Date("2024-01-01T00:00:00.000Z");

function makeUser(overrides: Partial<User> & { id: string }): User {
  return {
    name: "Test User",
    username: null,
    email: `${overrides.id}@example.com`,
    emailVerified: null,
    isEmailVerified: false,
    password: null,
    image: null,
    role: "USER",
    isFirstVisit: false,
    lastLoginAt: now,
    createdAt: now,
    updatedAt: now,
    ...overrides
  };
}

function makeUsers(count: number): User[] {
  return Array.from({ length: count }, (_, i) =>
    makeUser({ id: `user-${i + 1}`, name: `User ${i + 1}` })
  );
}

const ADMIN_SESSION = {
  user: { id: "1", role: "ADMIN", username: "admin", email: "" },
  expires: "2100-01-01T00:00:00.000Z"
} as const;

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("usersRouter -> getAll", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Get all users -> should throw UNAUTHORIZED", async () => {
    const caller = getTestCaller(null);

    await expect(caller.users.getAll({})).rejects.toThrowError(
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

    const result: Awaited<ReturnType<typeof caller.users.getAll>> =
      await caller.users.getAll({});

    expect(result.items).toHaveLength(MOCK_USERS.length);
  });

  // ── Filter ──────────────────────────────────────────────────────────────────

  it("Filter: getAll with a filter should call findMany with a non-empty where clause", async () => {
    const filteredUser = makeUser({
      id: "alice",
      username: "alice",
      email: "alice@example.com"
    });
    vi.mocked(prisma.user.findMany).mockResolvedValueOnce([filteredUser]);

    const caller = getTestCaller(ADMIN_SESSION);

    const result = await caller.users.getAll({
      filter: {
        username: { operator: FilterOperator.Contains, value: "alice" }
      }
    });

    expect(result.items).toEqual([filteredUser]);

    const findManyCall = vi.mocked(prisma.user.findMany).mock.calls[0]?.[0];
    expect(findManyCall?.where).toBeDefined();
    expect(findManyCall?.where).not.toEqual({});
  });

  // ── Sort ────────────────────────────────────────────────────────────────────

  it("Sort: getAll with sort should call findMany with matching orderBy entry", async () => {
    vi.mocked(prisma.user.findMany).mockResolvedValueOnce(makeUsers(2));

    const caller = getTestCaller(ADMIN_SESSION);

    await caller.users.getAll({
      sort: { key: "username", direction: "asc" }
    });

    const findManyCall = vi.mocked(prisma.user.findMany).mock.calls[0]?.[0];
    const orderBy = findManyCall?.orderBy as
      Record<string, string>[] | undefined;

    expect(orderBy).toBeDefined();
    expect(orderBy).toEqual(expect.arrayContaining([{ username: "asc" }]));
  });

  // ── Pagination: hasNextPage = true ──────────────────────────────────────────

  it("Pagination: returns hasNextPage=true and trims items when findMany returns pageSize+1 rows", async () => {
    const pageSize = 25;
    // Simulate DB returning one extra item (the "peek" item)
    vi.mocked(prisma.user.findMany).mockResolvedValueOnce(
      makeUsers(pageSize + 1)
    );

    const caller = getTestCaller(ADMIN_SESSION);

    const result = await caller.users.getAll({
      pagination: { cursor: null, pageSize }
    });

    expect(result.hasNextPage).toBe(true);
    expect(result.items).toHaveLength(pageSize);
    expect(result.nextCursor).toBe(result.items[pageSize - 1]?.id ?? null);
  });

  // ── Pagination: hasNextPage = false ─────────────────────────────────────────

  it("Pagination: returns hasNextPage=false and nextCursor=null when fewer items than pageSize are returned", async () => {
    const pageSize = 10;
    vi.mocked(prisma.user.findMany).mockResolvedValueOnce(makeUsers(pageSize));

    const caller = getTestCaller(ADMIN_SESSION);

    const result = await caller.users.getAll({
      pagination: { cursor: null, pageSize }
    });

    expect(result.hasNextPage).toBe(false);
    expect(result.nextCursor).toBeNull();
    expect(result.items).toHaveLength(pageSize);
  });

  // ── Pagination: cursor forward navigation ───────────────────────────────────

  it("Pagination: cursor navigation passes cursor and skip:1 to findMany", async () => {
    const pageSize = 5;
    vi.mocked(prisma.user.findMany).mockResolvedValueOnce(makeUsers(pageSize));

    const caller = getTestCaller(ADMIN_SESSION);

    await caller.users.getAll({
      pagination: { cursor: "some-id", pageSize }
    });

    const findManyCall = vi.mocked(prisma.user.findMany).mock.calls[0]?.[0];
    expect(findManyCall?.cursor).toEqual({ id: "some-id" });
    expect(findManyCall?.skip).toBe(1);
  });
});
