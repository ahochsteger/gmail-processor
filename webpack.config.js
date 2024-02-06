/* eslint-disable no-undef, @typescript-eslint/no-var-requires */
const GasPlugin = require("gas-webpack-plugin")
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

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
  ],
  devtool: false,
}
