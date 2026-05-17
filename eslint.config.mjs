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
      "./src/lib/expr/generated/*.ts",
    ],
  },

  // applies to all core library ts files
  {
    name: "lib",
    files: ["src/lib/**/*.ts"],
    ignores: ["src/lib/**/*.spec.ts"],
    extends: [...tseslint.configs.recommended, eslintPluginPrettierRecommended],
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      "eslint-plugin-tsdoc": eslintPluginTsdoc,
    },
    languageOptions: {
      globals: {
        ...googleappsscript.environments.googleappsscript.globals,
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

  // applies to all test spec files
  {
    name: "specs",
    files: ["src/**/*.spec.ts"],
    extends: [...tseslint.configs.recommended, eslintPluginPrettierRecommended],
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      jest: eslintPluginJest,
    },
    languageOptions: {
      globals: {
        ...googleappsscript.environments.googleappsscript.globals,
        ...eslintPluginJest.environments.globals.globals,
      },
      parser: tseslint.parser,
    },
    rules: {
      ...eslintPluginJest.configs.recommended.rules,
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-extraneous-class": "off",
      "@typescript-eslint/no-unnecessary-condition": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "jest/expect-expect": "off",
      "jest/no-conditional-expect": "off",
      "jest/no-identical-title": "off",
      "jest/valid-title": "off",
    },
  },
)
