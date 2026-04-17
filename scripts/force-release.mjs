#!/usr/bin/env node

/**
 * Force Release Utility
 *
 * Automates the process of forcing a release with release-please
 * by calculating the next version number based on the level (major, minor, patch).
 */

import { execSync } from "child_process"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const BASE_DIR = path.resolve(__dirname, "..")
const MANIFEST_PATH = path.join(BASE_DIR, ".release-please-manifest.json")

function log(msg) {
  console.log(`[${new Date().toISOString()}] ${msg}`)
}

function error(msg) {
  console.error(`[${new Date().toISOString()}] ERROR: ${msg}`)
  process.exit(1)
}

/**
 * Accept argument for increment level: major, minor, patch (default)
 */
const level = process.argv[2] || "patch"
const validLevels = ["major", "minor", "patch"]

if (!validLevels.includes(level)) {
  error(`Invalid increment level: "${level}". Valid levels: ${validLevels.join(", ")}`)
}

async function main() {
  if (!fs.existsSync(MANIFEST_PATH)) {
    error(`${MANIFEST_PATH} not found. Ensure you are running this from the repository root.`)
  }

  let manifest
  try {
    manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"))
  } catch (err) {
    error(`Failed to parse ${MANIFEST_PATH}: ${err.message}`)
  }

  const currentVersion = manifest["."]
  if (!currentVersion) {
    error(`Could not find current version for path "." in manifest.`)
  }

  const parts = currentVersion.split(".").map(Number)
  if (parts.length < 3 || parts.some(isNaN)) {
    error(`Invalid version format detected: "${currentVersion}"`)
  }

  // Increment based on level
  if (level === "major") {
    parts[0]++
    parts[1] = 0
    parts[2] = 0
  } else if (level === "minor") {
    parts[1]++
    parts[2] = 0
  } else {
    // patch
    parts[2]++
  }

  const nextVersion = parts.join(".")

  log(`Current version: ${currentVersion}`)
  log(`Next ${level} version: ${nextVersion}`)

  const commitMsg = `chore: force ${level} release\n\nRelease-As: ${nextVersion}`

  log(`Creating empty commit to force ${level} release...`)
  try {
    // Note: In some environments (like CI), we may need to set user identity first.
    // The script assumes git is configured locally or via environment variables.
    execSync(`git commit --allow-empty -m "${commitMsg}"`, { stdio: "inherit" })
    log(`SUCCESS: Created force-${level} commit for ${nextVersion}`)
    log("Push this commit to trigger the release-please PR.")
  } catch (err) {
    error("Failed to create git commit. Ensure you have git installed and are in a git repository.")
  }
}

main()
