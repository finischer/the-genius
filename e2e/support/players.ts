export const MIN_PLAYERS = 1;
export const MAX_PLAYERS = 5;

export function assertPlayerCount(n: number): void {
  if (!Number.isInteger(n) || n < MIN_PLAYERS || n > MAX_PLAYERS) {
    throw new Error(
      `Ungültige Spieleranzahl: ${String(n)}. Erlaubt sind ganze Zahlen von ${MIN_PLAYERS} bis ${MAX_PLAYERS}.`
    );
  }
}
