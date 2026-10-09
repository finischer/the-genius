import { describe, expect, it, vi } from "vitest";
import { TRPCError } from "@trpc/server";
import { getTestCaller } from "tests/utils";
import { MOCK_GAMESHOWS } from "__mock__/mockGameshows";
import { prisma } from "~/server/db";
import { FEATURES } from "~/config/features";

const OWN_USER_ID = "1";
const FOREIGN_GAMESHOW_ID = "3";

const getUserCaller = () =>
  getTestCaller({
    user: {
      id: OWN_USER_ID,
      role: "USER",
      username: "testuser",
      email: ""
    },
    expires: "2100-01-01T00:00:00.000Z"
  });

describe("gameshowsRouter -> ownership and limits", () => {
  it("getById on a foreign gameshow -> NOT_FOUND", async () => {
    const foreign = MOCK_GAMESHOWS.find((g) => g.id === FOREIGN_GAMESHOW_ID);
    expect(foreign?.creatorId).not.toBe(OWN_USER_ID);

    await expect(
      getUserCaller().gameshows.getById({ gameshowId: FOREIGN_GAMESHOW_ID })
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
  });

  it("delete on a foreign gameshow -> FORBIDDEN and nothing is deleted", async () => {
    const deleteMock = vi.mocked(prisma.gameshow.delete);
    deleteMock.mockClear();

    await expect(
      getUserCaller().gameshows.delete({ gameshowId: FOREIGN_GAMESHOW_ID })
    ).rejects.toThrowError(new TRPCError({ code: "FORBIDDEN" }));

    expect(deleteMock).not.toHaveBeenCalled();
  });

  it("create at the gameshow limit -> FORBIDDEN", async () => {
    vi.mocked(prisma.gameshow.count).mockResolvedValueOnce(
      FEATURES.USER.maxNumGameshows
    );

    await expect(
      getUserCaller().gameshows.create({ name: "New Show", games: [] })
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
