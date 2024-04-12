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
        delay: () => (process.env.NODE_ENV === "development" ? 1000 : 10),
        delayFunctionLazyExecute: true,
        generateEachHttpStatus: true,
      },
      clean: ["src/api"],
      prettier: true,
      override: {
        useNativeEnums: true,
      },
    },
  },
});
