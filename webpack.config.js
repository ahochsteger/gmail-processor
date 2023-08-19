/* eslint-disable no-undef, @typescript-eslint/no-var-requires */
const GasPlugin = require("gas-webpack-plugin")
module.exports = {
  mode: "production",
  context: __dirname,
  entry: "./build/lib/index.js",
  output: {
    path: __dirname,
    filename: "./build/gas/lib/GmailProcessorLib.js",
    library: {
      name: "GmailProcessor",
      type: "var",
    },
  },
  plugins: [
    new GasPlugin({
      autoGlobalExportsFiles: ["./build/lib/index.js"],
      comment: true,
    }),
  ],
  devtool: false,
}
