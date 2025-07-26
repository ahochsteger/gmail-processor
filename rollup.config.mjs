import commonjs from "@rollup/plugin-commonjs"
import json from "@rollup/plugin-json"
import resolve from "@rollup/plugin-node-resolve"
import replace from "@rollup/plugin-replace"
import swc from "@rollup/plugin-swc"
import typescript from "@rollup/plugin-typescript"
import fs from "fs"
import { defineConfig } from "rollup"
import filesize from "rollup-plugin-filesize"
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
    swc(),
    gas({
      gasEntryOptions: {
        comment: false,
      },
      moduleHeaderComment: true,
    }),
    visualizer({
      filename: "build/bundle-stats.html",
    }),
    filesize(),
  ],
})
