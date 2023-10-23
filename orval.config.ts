import { defineConfig } from "orval";

export default defineConfig({
  openapi: {
    input: {
      target: "./openapi.yaml",
    },
    output: {
      target: "src/api/api.ts",
      client: "react-query",
      mode: "split",
      mock: true,
    },
  },
});
