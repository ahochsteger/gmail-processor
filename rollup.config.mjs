import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
import typescript from "@rollup/plugin-typescript"
import { defineConfig } from "rollup"
import gas from "rollup-plugin-gas"
import nodePolyfills from "rollup-plugin-polyfill-node"

export default defineConfig({
  context: "globalThis",
  input: "./build/lib/index.js",
  output: {
    file: "./build/gas/lib/GmailProcessorLib.js",
    format: "iife",
    name: "GmailProcessorLib",
    sourcemap: true,
  },
  plugins: [
    resolve(),
    commonjs(),
    typescript({}),
    gas({
      comment: true,
      moduleHeaderComment: true,
    }),
    nodePolyfills(/* options */),
  ],
})
