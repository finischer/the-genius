import {
  GameshowDifficulty,
  GameshowVisbility
} from "~/generated/prisma/enums";
import {
  safedGameshowSchema,
  safedPublicGameshowSchema
} from "~/server/api/routers/gameshows";

// ---------------------------------------------------------------------------
// Task 4.2 – Property 1: safedGameshowSchema accepts nullable creatorId
// Validates: Requirements 1.2, 3.1
// ---------------------------------------------------------------------------

describe("safedGameshowSchema – nullable creatorId", () => {
  const baseGameshow = {
    id: "show-1",
    name: "Test Gameshow",
    numOfGames: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    isFavorite: false,
    games: [],
    visibility: GameshowVisbility.PRIVATE,
    difficulty: GameshowDifficulty.MEDIUM,
    originalCreatorId: null,
    originalGameshowId: null,
    importedGameshow: null,
    isModified: null
  };

  it("accepts creatorId: null (official / orphaned gameshow)", () => {
    const result = safedGameshowSchema.safeParse({
      ...baseGameshow,
      creatorId: null
    });
    expect(result.success).toBe(true);
  });

  it("accepts creatorId: string (normal user-owned gameshow)", () => {
    const result = safedGameshowSchema.safeParse({
      ...baseGameshow,
      creatorId: "user-123"
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing creatorId (field must be present, even if null)", () => {
    // Build object without creatorId directly to avoid unused-var lint error
    const withoutCreatorId = {
      id: baseGameshow.id,
      name: baseGameshow.name,
      numOfGames: baseGameshow.numOfGames,
      createdAt: baseGameshow.createdAt,
      updatedAt: baseGameshow.updatedAt,
      isFavorite: baseGameshow.isFavorite,
      games: baseGameshow.games,
      visibility: baseGameshow.visibility,
      difficulty: baseGameshow.difficulty,
      originalCreatorId: baseGameshow.originalCreatorId,
      originalGameshowId: baseGameshow.originalGameshowId,
      importedGameshow: baseGameshow.importedGameshow,
      isModified: baseGameshow.isModified
    };
    // creatorId is required in the schema (nullable, not optional)
    const result = safedGameshowSchema.safeParse(withoutCreatorId);
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Task 4.4 – Property 5: safedPublicGameshowSchema accepts missing user field
// Validates: Requirements 3.2, 3.4
// ---------------------------------------------------------------------------

describe("safedPublicGameshowSchema – optional user field", () => {
  const basePublicGameshow = {
    id: "official-gameshow-id",
    name: "Official Gameshow",
    description: "A platform gameshow",
    difficulty: GameshowDifficulty.MEDIUM,
    games: [],
    isOfficial: true,
    originalCreatorId: null,
    originalGameshowId: null,
    importedGameshow: null
  };

  it("accepts an object without a user field (official gameshow)", () => {
    // user is intentionally omitted
    const result = safedPublicGameshowSchema.safeParse(basePublicGameshow);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.user).toBeUndefined();
    }
  });

  it("accepts an object with a user field (backwards compatible)", () => {
    const result = safedPublicGameshowSchema.safeParse({
      ...basePublicGameshow,
      user: { id: "user-123", username: "testuser" }
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.user).toEqual({
        id: "user-123",
        username: "testuser"
      });
    }
  });

  it("parsed result contains the isOfficial boolean field", () => {
    const result = safedPublicGameshowSchema.safeParse({
      ...basePublicGameshow,
      isOfficial: true
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(typeof result.data.isOfficial).toBe("boolean");
      expect(result.data.isOfficial).toBe(true);
    }
  });

  it("isOfficial defaults as false for regular public gameshows", () => {
    const result = safedPublicGameshowSchema.safeParse({
      ...basePublicGameshow,
      isOfficial: false
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.isOfficial).toBe(false);
    }
  });

  it("rejects an object missing the isOfficial field entirely", () => {
    // Build object without isOfficial directly to avoid unused-var lint error
    const withoutIsOfficial = {
      id: basePublicGameshow.id,
      name: basePublicGameshow.name,
      description: basePublicGameshow.description,
      difficulty: basePublicGameshow.difficulty,
      games: basePublicGameshow.games,
      originalCreatorId: basePublicGameshow.originalCreatorId,
      originalGameshowId: basePublicGameshow.originalGameshowId,
      importedGameshow: basePublicGameshow.importedGameshow
    };
    const result = safedPublicGameshowSchema.safeParse(withoutIsOfficial);
    expect(result.success).toBe(false);
  });
});
