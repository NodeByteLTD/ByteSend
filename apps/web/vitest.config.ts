import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import { fileURLToPath } from "node:url";

const bytesendSdkEntry = fileURLToPath(
  new URL("../../packages/sdk/index.ts", import.meta.url),
);

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      "bytesend-js": bytesendSdkEntry,
    },
  },
  test: {
    environment: "node",
    globals: true,
    setupFiles: [
      "./src/test/setup/setup-env.ts",
      "./src/test/setup/setup-tests.ts",
    ],
    clearMocks: true,
    restoreMocks: true,
    mockReset: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.test.{ts,tsx}",
        "src/**/*.spec.{ts,tsx}",
        "src/test/**",
        "src/env.js",
      ],
    },
  },
});
