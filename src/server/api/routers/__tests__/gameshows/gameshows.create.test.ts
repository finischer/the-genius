import { describe, expect, it, vitest, type vi } from "vitest";
import { TRPCError } from "@trpc/server";
import { getTestCaller } from "__tests__/utils";
import { prisma } from "~/server/db";
import { FEATURES } from "~/config/features";

describe("gameshowsRouter -> create", () => {
  it("Unauthed user -> UNAUTHORIZED", async () => {
    const caller = getTestCaller(null);

    await expect(caller.gameshows.create({})).rejects.toThrowError(
      new TRPCError({
        code: "UNAUTHORIZED",
        message: "Du musst angemeldet sein, um die Aktion auszuführen"
      })
    );
  });

  it("User has reached gameshow limit => FORBIDDEN", async () => {
    const caller = getTestCaller({
      user: {
        id: "1",
        role: "USER",
        username: "testuser",
        email: ""
      },
      expires: "2100-01-01T00:00:00.000Z"
    });

    // Mock count to return 3
    (prisma.gameshow.count as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      FEATURES.USER.maxNumGameshows
    );

    // Expect to throw FORBIDDEN
    await expect(
      caller.gameshows.create({ name: "New Show", games: [] })
    ).rejects.toThrowError(
      new TRPCError({
        code: "FORBIDDEN",
        message: "Du hast die maximale Anzahl an Spielshows erreichst"
      })
    );

    const createSpy = vitest.spyOn(prisma.gameshow, "create");
    expect(createSpy).not.toHaveBeenCalled();
  });

  it("User has NOT reached the gameshow limit => create successful", async () => {
    const caller = getTestCaller({
      user: {
        id: "u1",
        role: "USER",
        username: "testuser",
        email: ""
      },
      expires: "2100-01-01T00:00:00.000Z"
    });

    (prisma.gameshow.count as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      FEATURES.USER.maxNumGameshows - 1
    );

    // 2) Jetzt mocken wir "create", damit es irgendein Objekt zurückgibt
    (prisma.gameshow.create as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      id: "created-id-999",
      creatorId: "u1",
      name: "My New Show",
      description: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      isFavorite: false,
      games: [],
      visibility: "PRIVATE",
      difficulty: null,
      originalCreatorId: null,
      originalGameshowId: null,
      importedGameshow: false
    });

    const createSpy = vitest.spyOn(prisma.gameshow, "create");

    const result = await caller.gameshows.create({
      name: "My New Show",
      games: [{ question: "Q1" }, { question: "Q2" }]
    });

    expect(createSpy).toHaveBeenCalledWith({
      data: {
        name: "My New Show",
        games: [{ question: "Q1" }, { question: "Q2" }],
        creatorId: "u1"
      }
    });

    expect(result.id).toBe("created-id-999");
    expect(result.creatorId).toBe("u1");
    expect(result.name).toBe("My New Show");
  });
});
