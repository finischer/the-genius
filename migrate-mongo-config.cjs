// migrate-mongo configuration
// Docs: https://github.com/seppevs/migrate-mongo
//
// In production (Railway) MONGODB_URI is injected as an environment variable.
// Locally, we load .env.local first (takes precedence), then .env as fallback.

require("dotenv").config({ path: ".env.local", override: false });
require("dotenv").config({ path: ".env", override: false });

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI environment variable is not set");
}

// Parse database name from the connection string
const dbName =
  new URL(uri).pathname.replace(/^\//, "").split("?")[0] || "the-genius";

/** @type {import('migrate-mongo').config.Config} */
module.exports = {
  mongodb: {
    url: uri,
    databaseName: dbName
  },

  // Migration files location (relative to project root)
  migrationsDir: "migrations",

  // Collection that tracks which migrations have been applied
  changelogCollectionName: "changelog",

  // File extension — .cjs for CommonJS compatibility
  migrationFileExtension: ".cjs",

  // Use MD5 checksums to detect file changes after a migration was applied
  useFileHash: false,

  moduleSystem: "commonjs"
};
