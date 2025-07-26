// @ts-check

import googleappsscript from "eslint-plugin-googleappsscript"
import eslintPluginJest from "eslint-plugin-jest"
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended"
import eslintPluginTsdoc from "eslint-plugin-tsdoc"
import tseslint from "typescript-eslint"

export default tseslint.config(
  // global ignores
  {
    ignores: [
      "bak/",
      "build/",
      "docs/",
      "dist/",
      "gas/",
      "node_modules/",
      "*.bak*",
      "**/*.bak*",
      "./src/**/*.ts",
      "./src/lib/expr/generated/*.ts",
    ],
  },

  // applies to all ts files
  {
    name: "ts",
    files: ["src/lib/**/*.ts"],
    ignores: ["src/lib/**/*.spec.ts"],
    extends: [...tseslint.configs.recommended, eslintPluginPrettierRecommended],
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      "eslint-plugin-tsdoc": eslintPluginTsdoc,
      jest: eslintPluginJest,
    },
    languageOptions: {
      globals: {
        ...googleappsscript.environments.googleappsscript.globals,
        ...eslintPluginJest.environments.globals.globals,
      },
      parser: tseslint.parser,
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      ...eslintPluginJest.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-extraneous-class": "off", // Reason: Requires refactoring classes with only static methods.
      "@typescript-eslint/no-unnecessary-condition": "warn",
      "@typescript-eslint/restrict-template-expressions": "warn",
    },
  },
)
