/// <reference types="vitest" />
import { resolve } from "path";

import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    build: {
      lib: {
        entry: resolve(__dirname, "src/index.ts"),
        name: "rebac-admin",
        fileName: "rebac-admin",
      },
      rollupOptions: {
        external: ["react", "react-dom"],
        output: {
          globals: {
            react: "React",
            "react-dom": "ReactDOM",
          },
        },
      },
      sourcemap: true,
    },
    plugins: [
      react(),
      tsconfigPaths(),
      dts({
        rollupTypes: true,
        exclude: ["**/*.msw.ts", "src/test"],
      }),
    ],
    server: {
      host: "0.0.0.0",
      port: Number(env.PORT),
    },
    test: {
      environment: "happy-dom",
      globals: true,
      include: ["src/**/*.{test,spec}.?(c|m)[jt]s?(x)"],
      setupFiles: "src/test/setup.ts",
    },
  };
});
