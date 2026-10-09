export const ALLOWED_DB_SUFFIXES = ["_e2e", "_test"] as const;

export function getDatabaseName(url: string): string {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error("DATABASE_URL ist keine gültige URL.");
  }
  return decodeURIComponent(parsed.pathname.replace(/^\/+/, ""));
}

export function assertSafeDatabaseUrl(url: string | undefined): void {
  const allowed = ALLOWED_DB_SUFFIXES.join(" oder ");
  if (url === undefined || url === "") {
    throw new Error(
      `DATABASE_URL ist nicht gesetzt. Erlaubte Datenbank-Suffixe: ${allowed}.`
    );
  }

  let name: string;
  try {
    name = getDatabaseName(url);
  } catch {
    throw new Error(
      `DATABASE_URL ist nicht lesbar. Erlaubte Datenbank-Suffixe: ${allowed}.`
    );
  }

  if (!ALLOWED_DB_SUFFIXES.some((suffix) => name.endsWith(suffix))) {
    throw new Error(
      `Datenbank "${name}" abgelehnt. E2E darf nur Datenbanken mit den Suffixen ${allowed} verwenden.`
    );
  }
}
