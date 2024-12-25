import { vi } from "vitest";

vi.mock("~/server/db", () => {
  return {
    prisma: {
      gameshow: {
        findMany: vi.fn()
      }
    }
  };
});
