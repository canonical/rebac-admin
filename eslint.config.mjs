import path from "node:path";
import { fileURLToPath } from "node:url";

import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import prettier from "eslint-plugin-prettier";
import react from "eslint-plugin-react";
import hooksPlugin from "eslint-plugin-react-hooks";
import testingLibrary from "eslint-plugin-testing-library";
import tseslint from "typescript-eslint";
import vitest from "eslint-plugin-vitest";
import reactRefresh from "eslint-plugin-react-refresh";
import tanstackQuery from "@tanstack/eslint-plugin-query";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    files: ["src/**/*.ts", "src/**/*.tsx", "demo/**/*.ts", "demo/**/*.tsx"],
  },
  {
    ignores: [
      "dist",
      "build",
      "src/api/",
      ".yarn/",
      "*.config.ts",
      "*.config.mjs",
      "**/mockServiceWorker.js",
    ],
  },
  ...tseslint.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat["jsx-runtime"],
  importPlugin.flatConfigs.recommended,
  ...fixupConfigRules(compat.extends("plugin:import/typescript")),
  {
    plugins: {
      "@tanstack/query": fixupPluginRules(tanstackQuery),
      "react-hooks": fixupPluginRules(hooksPlugin),
      "react-refresh": reactRefresh,
      vitest,
    },
    rules: hooksPlugin.configs.recommended.rules,
  },
  {
    plugins: {
      prettier: fixupPluginRules(prettier),
      "@typescript-eslint": tseslint.plugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 2018,
      sourceType: "module",
      parserOptions: {
        project: "./tsconfig.json",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      "import/resolver": {
        node: {
          paths: ["src"],
        },
        typescript: true,
      },
      react: {
        version: "detect",
      },
    },
    rules: {
      ...vitest.configs.recommended.rules,
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          caughtErrors: "none",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "prefer-promise-reject-errors": "error",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-import-type-side-effects": "error",
      "@typescript-eslint/explicit-module-boundary-types": "error",
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/no-confusing-void-expression": "error",
      "no-shadow": "off",
      "@typescript-eslint/no-shadow": "error",
      "@typescript-eslint/prefer-nullish-coalescing": [
        "error",
        {
          ignorePrimitives: {
            string: true,
            boolean: true,
          },
        },
      ],
      "@typescript-eslint/prefer-optional-chain": "error",
      "no-redeclare": "off",
      "@typescript-eslint/no-redeclare": "error",
      "init-declarations": "off",
      "@typescript-eslint/init-declarations": "error",
      "react/jsx-filename-extension": [
        1,
        {
          extensions: [".tsx"],
        },
      ],
      "import/prefer-default-export": 0,
      "import/imports-first": ["error", "absolute-first"],
      "import/newline-after-import": "error",
      "import/no-named-as-default-member": 0,
      "import/order": [
        "error",
        {
          "newlines-between": "always",

          alphabetize: {
            order: "asc",
          },

          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
        },
      ],
      "jest/prefer-expect-assertions": 0,
      "jest/prefer-inline-snapshots": 0,
      "jest/lowercase-name": 0,
      "jest/no-hooks": 0,
      "default-case": 0,
      "no-param-reassign": 0,
      "no-case-declarations": 0,
      "no-redeclare": 0,
      "prefer-destructuring": 0,
      "react-refresh/only-export-components": [
        "warn",
        {
          allowConstantExport: true,
        },
      ],
      "@tanstack/query/exhaustive-deps": "error",
      "@tanstack/query/prefer-query-object-syntax": 0,
      "@tanstack/query/stable-query-client": "error",
    },
  },
  ...fixupConfigRules(compat.extends("plugin:prettier/recommended")).map(
    (config) => ({
      ...config,
      files: ["**/*.ts?(x)"],
    }),
  ),
  {
    files: ["**/*.ts?(x)"],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 2018,
      sourceType: "module",
      parserOptions: {
        project: "./tsconfig.json",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "prettier/prettier": "error",
    },
  },
  {
    plugins: {
      "testing-library": fixupPluginRules({
        rules: testingLibrary.rules,
      }),
    },
    files: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
    rules: {
      ...testingLibrary.configs["flat/react"].rules,
      "testing-library/no-node-access": "off",
      "testing-library/no-container": "off",
      "testing-library/no-render-in-lifecycle": "off",
      "@typescript-eslint/init-declarations": "off",
    },
  },
  {
    files: ["**/*.test-d.ts"],
    rules: {
      "vitest/expect-expect": 0,
    },
  },
];
