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
  update: vi.fn(),
  delete: vi.fn()
};
