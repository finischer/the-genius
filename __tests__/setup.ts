import { GAMESHOW_MOCK_FUNCTIONS } from "__mock__/mockGameshows";
import { vi } from "vitest";

vi.mock("~/server/db", () => {
  return {
    prisma: {
      gameshow: GAMESHOW_MOCK_FUNCTIONS
    }
  };
});
