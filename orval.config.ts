import { parse } from "dotenv";
import { readFileSync } from "fs";
import { defineConfig } from "orval";
import path from "path";

const env = parse(readFileSync(path.resolve(process.cwd(), ".env")));

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
        delay: Number(env.VITE_MOCK_API_DELAY),
      },
      clean: ["src/api"],
      prettier: true,
      override: {
        useNativeEnums: true,
        query: {
          options: {
            refetchOnWindowFocus: false,
          },
        },
      },
    },
  },
});
