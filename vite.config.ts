/// <reference types="vitest" />
import { resolve } from "path";

import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import dts from "vite-plugin-dts";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    build: {
      copyPublicDir: false,
      lib: {
        entry: resolve(__dirname, "src/index.ts"),
        name: "rebac-admin",
        fileName: "rebac-admin",
      },
      rollupOptions: {
        external: ["react", "react-dom", "react-router-dom"],
        output: {
          assetFileNames: "rebac-admin.[ext]",
          globals: {
            react: "React",
            "react-dom": "ReactDOM",
            "react-router-dom": "_ReactRouterDOM",
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
        include: ["src"],
        exclude: ["**/*.msw.ts", "src/test", "src/mocks"],
      }),
      nodePolyfills({
        globals: {
          // Required by async-limiter.
          process: true,
        },
      }),
    ],
    publicDir: "demo/public",
    server: {
      host: "0.0.0.0",
      port: Number(env.PORT),
      proxy: {
        [env.VITE_DEMO_API_URL ?? "/api"]: {
          target: env.VITE_DEMO_PROXY_API_URL ?? "/",
        },
      },
    },
    test: {
      coverage: {
        reporter: ["text", "json-summary", "json", "cobertura"],
        reportOnFailure: true,
      },
      environment: "happy-dom",
      globals: true,
      include: [
        "src/**/*.{test,spec}.?(c|m)[jt]s?(x)",
        "demo/**/*.{test,spec}.?(c|m)[jt]s?(x)",
      ],
      setupFiles: "src/test/setup.ts",
    },
  };
});
