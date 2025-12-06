import { GAMESHOW_MOCK_FUNCTIONS } from "__mock__/mockGameshows";
import { USER_MOCK_FUNCTIONS } from "__mock__/mockUsers";
import { vi } from "vitest";

vi.mock("~/server/db", () => {
  return {
    prisma: {
      gameshow: GAMESHOW_MOCK_FUNCTIONS,
      user: USER_MOCK_FUNCTIONS
    }
  };
});
