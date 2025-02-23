import { babel } from "@rollup/plugin-babel"
import commonjs from "@rollup/plugin-commonjs"
import json from "@rollup/plugin-json"
import resolve from "@rollup/plugin-node-resolve"
import terser from "@rollup/plugin-terser"
import typescript from "@rollup/plugin-typescript"
import { defineConfig } from "rollup"
import analyzer from "rollup-plugin-analyzer"
import gas from "rollup-plugin-google-apps-script"
import { visualizer } from "rollup-plugin-visualizer"

export default defineConfig({
  context: "globalThis",
  input: "./build/lib/index.js",
  output: {
    file: "./build/gas/lib/GmailProcessorLib.js",
    format: "iife",
    name: "GmailProcessorLib",
  },
  plugins: [
    json(),
    resolve({
      //preferBuiltins: false,
      // browser: true, // Required to activate polyfills for Google Apps Script
    }),
    commonjs(),
    typescript(),
    babel({ babelHelpers: "bundled" }),
    gas({
      gasEntryOptions: {
        comment: false,
      },
      moduleHeaderComment: true,
    }),
    analyzer({
      summaryOnly: true,
      limit: 5,
    }),
    terser({
      compress: true,
    }),
    visualizer({
      filename: "build/bundle-stats.html",
    }),
  ],
})
