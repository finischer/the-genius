import { existsSync } from "node:fs";
import { resolve } from "node:path";

export const E2E_REQUIRED_ENV: readonly string[] = [
  "DATABASE_URL",
  "NEXTAUTH_SECRET",
  "E2E_TEST_EMAIL",
  "E2E_TEST_PASSWORD",
  "E2E_ADMIN_EMAIL",
  "E2E_ADMIN_PASSWORD",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "DISCORD_CLIENT_ID",
  "DISCORD_CLIENT_SECRET",
  "SOCKET_IO_ADMIN_USERNAME",
  "SOCKET_IO_ADMIN_PASSWORD",
  "WEBSITE_URL",
  "NEXT_PUBLIC_THE_GENIUS_ENV",
  "NEXT_PUBLIC_POSTHOG_KEY",
  "NEXT_PUBLIC_POSTHOG_HOST"
];

export function findMissingEnv(
  names: readonly string[],
  env: Record<string, string | undefined>
): string[] {
  return names.filter((name) => (env[name] ?? "") === "");
}

export function assertE2eEnv(
  env: Record<string, string | undefined>,
  envFilePath: string = resolve(process.cwd(), ".env.test")
): void {
  const missing = findMissingEnv(E2E_REQUIRED_ENV, env);
  if (missing.length === 0) return;

  const fileHint = existsSync(envFilePath)
    ? ""
    : " Die Datei .env.test fehlt, Vorlage: .env.test.example.";
  throw new Error(
    `Fehlende Umgebungsvariablen für E2E: ${missing.join(", ")}.${fileHint}`
  );
}
