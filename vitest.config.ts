import { join } from "path";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: [
      "**/tests/unit/**/*.test.{ts,tsx}",
      "**/tests/integration/**/*.test.{ts,tsx}"
    ],
    exclude: [...configDefaults.exclude, "e2e/.generated/**"],
    globals: true,
    setupFiles: ["./tests/setup.ts"]
  },
  resolve: {
    alias: {
      "~/": join(__dirname, "./src/")
    }
  }
});
