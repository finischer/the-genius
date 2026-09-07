/**
 * Returns a deterministic, static Date based on a seed string.
 * Uses a fixed epoch as base – same input always produces the same date,
 * regardless of when the seed runs.
 *
 * Dates are spread across a 2-year window ending 2025-01-01.
 */

// Fixed reference point – never changes
const BASE_DATE = new Date("2025-01-01T00:00:00.000Z").getTime();
const TWO_YEARS_MS = 2 * 365 * 24 * 60 * 60 * 1000;

function djb2Hash(s: string): number {
  let hash = 5381;
  for (let i = 0; i < s.length; i++) {
    hash = (hash * 33) ^ s.charCodeAt(i);
  }
  return Math.abs(hash);
}

export function seededDate(seed: string): Date {
  const offset = djb2Hash(seed) % TWO_YEARS_MS;
  return new Date(BASE_DATE - offset);
}

export function seededUpdatedAt(seed: string): Date {
  const created = seededDate(seed);
  const maxDeltaMs = 30 * 24 * 60 * 60 * 1000; // up to 30 days after createdAt
  const delta = djb2Hash(seed + "_updated") % maxDeltaMs;
  return new Date(created.getTime() + delta);
}
