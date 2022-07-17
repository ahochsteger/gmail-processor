module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    "prettier",
  ],
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    "googleappsscript",
    "prettier",
  ],
  root: true,
};
