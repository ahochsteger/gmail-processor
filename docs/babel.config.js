module.exports = {
  plugins: [
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    '@babel/plugin-transform-class-properties'
  ],
  presets: [require.resolve('@docusaurus/core/lib/babel/preset')],
};
