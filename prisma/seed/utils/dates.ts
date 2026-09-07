/**
 * Returns a deterministic, static Date based on a seed string.
 * Uses a fixed epoch as base – same input always produces the same date,
 * regardless of when the seed runs.
 *
 * Dates are spread across a 2-year window ending 2025-01-01.
 */

// Fixed reference point – end of current year, never in the future
const BASE_DATE = Math.min(
  new Date(`${new Date().getFullYear()}-12-31T23:59:59.000Z`).getTime(),
  Date.now()
);
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
  const updated = new Date(created.getTime() + delta);
  return updated.getTime() > Date.now() ? new Date() : updated;
}
