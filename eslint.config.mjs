// @ts-check

import googleappsscript from "eslint-plugin-googleappsscript"
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended"
import eslintPluginTsdoc from "eslint-plugin-tsdoc"
import globals from "globals"
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
    // ignores: ["src/examples/**/*.ts"],
    extends: [
      // ...eslint.configs.recommended,
      ...tseslint.configs.recommended,
      // ...tseslint.configs.recommendedTypeChecked,
      //...tseslint.configs.strictTypeChecked,
      eslintPluginPrettierRecommended,
    ],
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      "eslint-plugin-tsdoc": eslintPluginTsdoc,
      // prettier: eslintPluginPrettierRecommended,
    },
    languageOptions: {
      globals: {
        ...globals.es2015,
        ...globals.node,
        ...googleappsscript.environments.googleappsscript.globals,
        ...globals.jest,
      },
      parser: tseslint.parser,
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-extraneous-class": "off", // Reason: Requires refactoring classes with only static methods.
      "@typescript-eslint/no-unnecessary-condition": "warn",
      "@typescript-eslint/restrict-template-expressions": "warn",
    },
  },

  // {
  //   ...eslint.configs.recommended,
  //   ...eslintPluginPrettierRecommended,
  //   name: "gas",
  //   files: ["./src/gas/**/*.js"],
  //   extends: [],
  //   languageOptions: {
  //     globals: {
  //       ...globals.es2015,
  //       ...googleappsscript.environments.googleappsscript.globals,
  //     },
  //   },
  //   rules: {},
  // },

  // global variables, applies to everything
  // {
  //   languageOptions: {
  //     globals: {
  //       ...globals.es2015,
  //       ...globals.node,
  //       ...googleappsscript.environments.googleappsscript.globals,
  //       ...globals.jest,
  //     },
  //   },
  // },
)
