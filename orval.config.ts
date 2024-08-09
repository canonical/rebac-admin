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
        delay: () => (process.env.NODE_ENV === "development" ? 1000 : 10),
        delayFunctionLazyExecute: true,
        generateEachHttpStatus: true,
      },
      clean: ["src/api"],
      prettier: true,
      override: {
        mutator: {
          path: "./src/api-utils/mutator/custom-instance.ts",
          name: "customInstance",
        },
        useNativeEnums: true,
      },
    },
  },
});
