import { execFileSync } from "node:child_process";
import { getDatabaseName } from "./database";

/**
 * Locally Playwright owns the E2E database lifecycle on top of the regular
 * `docker-compose.yml` PostgreSQL. CI provides its own PostgreSQL service,
 * and `E2E_MANAGE_DOCKER=false` opts out manually.
 */
export function isDockerManaged(
  env: Record<string, string | undefined>
): boolean {
  return (env.CI ?? "") === "" && env.E2E_MANAGE_DOCKER !== "false";
}

function run(command: string, args: string[]): void {
  execFileSync(command, args, { stdio: "inherit", env: process.env });
}

function psql(sql: string): string {
  return execFileSync(
    "docker",
    [
      "compose",
      "exec",
      "-T",
      "postgres",
      "psql",
      "-U",
      "postgres",
      "-tAc",
      sql
    ],
    { env: process.env }
  )
    .toString()
    .trim();
}

function isPostgresRunning(): boolean {
  const output = execFileSync(
    "docker",
    ["compose", "ps", "--status", "running", "--services"],
    { env: process.env }
  ).toString();
  return output.split("\n").includes("postgres");
}

/**
 * Starts the local database if needed, creates the E2E database, migrates and
 * seeds it. Returns a function that undoes exactly what was done here.
 */
export function startE2eServices(): () => void {
  const databaseName = getDatabaseName(process.env.DATABASE_URL ?? "");
  const startedContainer = !isPostgresRunning();
  if (startedContainer) run("docker", ["compose", "up", "-d", "--wait"]);

  if (!psql(`SELECT 1 FROM pg_database WHERE datname = '${databaseName}'`)) {
    psql(`CREATE DATABASE "${databaseName}"`);
  }
  run("bunx", ["prisma", "migrate", "deploy", "--schema", "prisma"]);
  run("bun", ["prisma/seed/e2e.ts"]);

  return () => {
    if (process.env.E2E_KEEP_SERVICES === "true") return;
    psql(`DROP DATABASE IF EXISTS "${databaseName}" WITH (FORCE)`);
    if (startedContainer) run("docker", ["compose", "stop"]);
  };
}
