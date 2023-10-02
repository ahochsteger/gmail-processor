module.exports = {
  plugins: [
    ["@babel/plugin-proposal-decorators", { decoratorsBeforeExport: true }],
    '@babel/plugin-transform-class-properties'
  ],
  presets: [require.resolve('@docusaurus/core/lib/babel/preset')],
};
