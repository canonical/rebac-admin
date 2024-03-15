import { defineConfig } from "orval";

export default defineConfig({
  openapi: {
    input: {
      target: "./openapi.yaml",
    },
    output: {
      target: "src/api/api.ts",
      client: "react-query",
      mode: "tags-split",
      mock: {
        type: "msw",
        // Needs to be shorter than the 1000ms timeout that RTL sets for async methods.
        delay: 900,
      },
      clean: ["src/api"],
      prettier: true,
      override: {
        useNativeEnums: true,
      },
    },
  },
});
