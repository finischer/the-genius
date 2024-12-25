import { join } from "path";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude, "**/e2e/**"],
    globals: true,
    setupFiles: ["./__tests__/setup.ts"]
  },
  resolve: {
    alias: {
      "~/": join(__dirname, "./src/")
    }
  }
});
