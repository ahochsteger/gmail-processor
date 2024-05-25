/* eslint-disable no-undef, @typescript-eslint/no-var-requires */
const GasPlugin = require("gas-webpack-plugin")
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
const __PACKAGE_JSON__ = require("./package.json")
const { DefinePlugin } = require("webpack")

module.exports = {
  mode: "development",
  context: __dirname,
  entry: "./build/lib/index.js",
  output: {
    path: __dirname,
    filename: "./build/gas/lib/GmailProcessorLib.js",
    library: {
      name: "GmailProcessorLib",
      type: "var",
    },
  },
  plugins: [
    new GasPlugin({
      autoGlobalExportsFiles: ["./build/lib/index.js"],
      comment: true,
    }),
    new NodePolyfillPlugin(),
    new DefinePlugin({ __PACKAGE_JSON__: JSON.stringify(__PACKAGE_JSON__) }),
  ],
  devtool: false,
}
