export interface ICleanupGameshow {
  id: string;
  creatorId: string | null;
}

export function selectCleanupTargets(
  userId: string,
  gameshows: readonly ICleanupGameshow[]
): string[] {
  return gameshows
    .filter((gameshow) => gameshow.creatorId === userId)
    .map((gameshow) => gameshow.id);
}
