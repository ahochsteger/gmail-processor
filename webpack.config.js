/* eslint-disable no-undef, @typescript-eslint/no-var-requires */
const GasPlugin = require("gas-webpack-plugin")

module.exports = {
  mode: "development",
  entry: "./build/src",
  output: {
    path: __dirname,
    filename: "dist/Lib.js",
    library: {
      name: "Lib",
      type: "var",
    },
  },
  plugins: [new GasPlugin()],
  devtool: false,
}
