import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",

    include: [
      "src/core/**/*.test.ts",
      "src/core/**/*.spec.ts",
      "__tests__/**/*.test.ts",
    ],
  },
});
