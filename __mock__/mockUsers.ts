import type { Prisma } from "@prisma/client";
import { vi } from "vitest";

export type MockUser = {
  id: string;
  username: string;
  email: string;
};

// Beispiel-Einträge:
export const MOCK_USERS: MockUser[] = [
  {
    id: "1",
    username: "Alice",
    email: "alice@example.com"
  },
  {
    id: "2",
    username: "Bob",
    email: "bob@example.com"
  }
];

export const USER_MOCK_FUNCTIONS = {
  findUnique: vi.fn(),
  findMany: vi.fn().mockResolvedValue(MOCK_USERS),
  create: vi.fn(),
  update: vi.fn().mockImplementation((args: Prisma.UserUpdateArgs) => {
    const user = MOCK_USERS.find((u) => u.id === args.where.id);

    if (!user) {
      return null;
    }

    for (const key in args.data) {
      const newValue = args.data[key as keyof Prisma.UserUpdateInput];
      (user as unknown as Record<string, unknown>)[key] = newValue;
    }

    return user;
  }),
  delete: vi.fn()
};
