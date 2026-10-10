export type TGameCheck = "picker" | "configurator" | "room";

export interface IGameCase {
  identifier: string;
  check: TGameCheck;
  title: string;
}

const GAME_CHECKS: readonly TGameCheck[] = ["picker", "configurator", "room"];

export function buildGameCases(identifiers: readonly string[]): IGameCase[] {
  return identifiers.flatMap((identifier) =>
    GAME_CHECKS.map((check) => ({
      identifier,
      check,
      title: `${identifier}: ${check}`
    }))
  );
}

/** Games that exist in code but are not released yet (no `games` table row). */
export const UNRELEASED_GAMES: readonly string[] = ["referatBingo"];

export function releasedGames<T extends string>(
  identifiers: readonly T[]
): T[] {
  return identifiers.filter(
    (identifier) => !UNRELEASED_GAMES.includes(identifier)
  );
}
