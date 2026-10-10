const ALPHABET =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const RANDOM_LENGTH = 8;

let counter = 0;

/**
 * Creates a unique gameshow name: `e2e-` followed by at least 8 alphanumeric
 * characters. A time and counter suffix guarantees uniqueness even when the
 * injected random source is deterministic.
 */
export function createE2eName(random: () => number = Math.random): string {
  let randomPart = "";
  for (let i = 0; i < RANDOM_LENGTH; i++) {
    const index = Math.min(
      ALPHABET.length - 1,
      Math.max(0, Math.floor(random() * ALPHABET.length))
    );
    randomPart += ALPHABET.charAt(index);
  }
  counter += 1;
  const suffix = `${Date.now().toString(36)}${counter.toString(36)}`;
  return `e2e-${randomPart}${suffix}`;
}
