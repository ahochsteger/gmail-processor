import { babel } from "@rollup/plugin-babel"
import commonjs from "@rollup/plugin-commonjs"
import json from "@rollup/plugin-json"
import resolve from "@rollup/plugin-node-resolve"
import replace from "@rollup/plugin-replace"
import terser from "@rollup/plugin-terser"
import typescript from "@rollup/plugin-typescript"
import fs from "fs"
import { defineConfig } from "rollup"
import analyzer from "rollup-plugin-analyzer"
import gas from "rollup-plugin-google-apps-script"
import { visualizer } from "rollup-plugin-visualizer"

const pkg = JSON.parse(fs.readFileSync("./package.json", "utf-8"))

export default defineConfig({
  context: "globalThis",
  input: "./build/lib/index.js",
  output: {
    file: "./build/gas/lib/GmailProcessorLib.js",
    format: "iife",
    name: "GmailProcessorLib",
  },
  plugins: [
    replace({
      preventAssignment: true,
      values: {
        __PACKAGE_DESCRIPTION__: pkg.description,
        __PACKAGE_NAME__: pkg.name,
        __PACKAGE_VERSION__: pkg.version,
      },
    }),
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
