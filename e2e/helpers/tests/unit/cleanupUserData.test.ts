const prismaMock = vi.hoisted(() => ({
  room: { deleteMany: vi.fn() },
  gameshow: { findMany: vi.fn(), delete: vi.fn() },
  $disconnect: vi.fn()
}));

vi.mock("../../../.generated/prisma/client", () => ({
  PrismaClient: vi.fn(() => prismaMock)
}));
vi.mock("@prisma/adapter-pg", () => ({
  PrismaPg: vi.fn()
}));

import {
  cleanupUserData,
  disconnectE2ePrisma
} from "../../db";

describe("cleanupUserData", () => {
  beforeEach(async () => {
    await disconnectE2ePrisma();
    vi.clearAllMocks();
    vi.stubEnv("DATABASE_URL", "postgresql://u:p@localhost:5432/thegenius_e2e");
    prismaMock.room.deleteMany.mockResolvedValue({ count: 1 });
    prismaMock.gameshow.findMany.mockResolvedValue([]);
    prismaMock.gameshow.delete.mockResolvedValue({});
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("includes resource name and id in the error message", async () => {
    prismaMock.room.deleteMany.mockRejectedValue(new Error("boom"));
    prismaMock.gameshow.findMany.mockResolvedValue([
      { id: "show-1", creatorId: "user-1" }
    ]);
    prismaMock.gameshow.delete.mockRejectedValue(new Error("nope"));

    const promise = cleanupUserData("user-1", {
      roomIds: ["room-1"],
      gameshowIds: ["show-1"]
    });

    await expect(promise).rejects.toThrow(/room room-1 \(boom\)/);
    await expect(
      cleanupUserData("user-1", {
        roomIds: ["room-1"],
        gameshowIds: ["show-1"]
      })
    ).rejects.toThrow(/gameshow show-1 \(nope\)/);
  });

  it("does not delete gameshows created by other users", async () => {
    prismaMock.gameshow.findMany.mockResolvedValue([
      { id: "own", creatorId: "user-1" },
      { id: "foreign", creatorId: "user-2" }
    ]);

    await cleanupUserData("user-1", { gameshowIds: ["own", "foreign"] });

    expect(prismaMock.gameshow.delete).toHaveBeenCalledTimes(1);
    expect(prismaMock.gameshow.delete).toHaveBeenCalledWith({
      where: { id: "own" }
    });
  });

  it("scopes room deletion to the user and selected ids", async () => {
    await cleanupUserData("user-1", { roomIds: ["room-1"] });

    expect(prismaMock.room.deleteMany).toHaveBeenCalledWith({
      where: { id: "room-1", creatorId: "user-1" }
    });
  });
});
