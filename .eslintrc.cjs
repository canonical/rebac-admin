module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "react-app",
    "eslint:recommended",
    "plugin:prettier/recommended",
    "plugin:vitest/recommended",
    "plugin:promise/recommended",
    "plugin:import/typescript",
    "plugin:jsx-a11y/recommended",
    "plugin:@tanstack/eslint-plugin-query/recommended",
  ],
  "overrides": [
    {
      "files": ["**/*.test-d.ts"],
      "rules": {
        // Typecheck files may use type assertions rather than expect().
        "vitest/expect-expect": 0,
      },
    }
  ],
  ignorePatterns: ["dist", "build", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    project: "./tsconfig.json",
  },
  plugins: [
    "prettier",
    "react-refresh",
    "vitest",
    "promise",
    "jsx-a11y",
    "@tanstack/query",
  ],
  rules: {
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/no-misused-promises": "error",
    "prefer-promise-reject-errors": "error",
    "@typescript-eslint/await-thenable": "error",
    "react/jsx-filename-extension": [
      1,
      {
        extensions: [".tsx"],
      },
    ],
    "import/prefer-default-export": 0,
    "import/imports-first": ["error", "absolute-first"],
    "import/newline-after-import": "error",
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
      { allowConstantExport: true },
    ],
    "@tanstack/query/exhaustive-deps": "error",
    "@tanstack/query/prefer-query-object-syntax": 0,
    "@tanstack/query/stable-query-client": "error",
  },
  settings: {
    "import/resolver": {
      node: {
        paths: ["src"],
      },
    },
  },
};
