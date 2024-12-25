import { vi } from "vitest";

vi.mock("~/server/db", () => {
  return {
    prisma: {
      gameshow: {
        findMany: vi.fn()
        // findFirst, create, update, delete... je nachdem, was du brauchst
      }
    }
  };
});
