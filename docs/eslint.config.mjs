import docusaurus from "@docusaurus/eslint-plugin";
import tseslint from "typescript-eslint";
import eslint from "@eslint/js";
import globals from "globals";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        project: "./tsconfig.json",
      },
    },
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "@docusaurus": docusaurus,
    },
    rules: {
      ...docusaurus.configs.recommended.rules,
    },
  },
  {
    files: ["**/*.js", "**/*.cjs"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-var-requires": "off",
      "no-undef": "off", // Often tricky with globals in mixed environments
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "no-undef": "off", // TS handles this better via type checking
    },
  },
  {
    ignores: ["node_modules/", "build/", ".docusaurus/"],
  },
);
