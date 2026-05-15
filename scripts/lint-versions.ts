import * as fs from "fs"
import * as path from "path"
import * as os from "os"
import { execSync } from "child_process"

function readJsonFile(filePath: string): any {
  return JSON.parse(fs.readFileSync(path.resolve(filePath), "utf8"))
}

function extractMajorVersion(versionString: string): string {
  const match = versionString.match(/(\d+)/)
  if (!match) {
    throw new Error(`Could not extract major version from ${versionString}`)
  }
  return match[1]
}

function lintNodeVersion() {
  const devbox = readJsonFile("devbox.json")
  const pkg = readJsonFile("package.json")
  const docsPkg = readJsonFile("docs/package.json")
  const renovate = readJsonFile("renovate.json")

  let hasErrors = false

  const error = (msg: string) => {
    console.error(`[ERROR] ${msg}`)
    hasErrors = true
  }

  const devboxNode = devbox.packages?.find((p: string) =>
    p.startsWith("nodejs@"),
  )
  if (!devboxNode) {
    error("Could not find 'nodejs' package in devbox.json.")
    process.exit(1)
  }

  const majorVersion = extractMajorVersion(devboxNode.split("@")[1])
  const expectedEngine = `${majorVersion}.x`

  // 1. Check root package.json engines
  if (pkg.engines?.node !== expectedEngine) {
    error(
      `package.json engines.node should be '${expectedEngine}', but found '${pkg.engines?.node}'`,
    )
  }

  // 2. Check root package.json @types/node
  const typesNode = pkg.devDependencies?.["@types/node"]
  if (!typesNode || extractMajorVersion(typesNode) !== majorVersion) {
    error(
      `package.json devDependencies['@types/node'] major version should be '${majorVersion}', but found '${typesNode}'`,
    )
  }

  // 3. Check docs/package.json engines
  if (docsPkg.engines?.node !== expectedEngine) {
    error(
      `docs/package.json engines.node should be '${expectedEngine}', but found '${docsPkg.engines?.node}'`,
    )
  }

  // 4. Check docs/package.json @types/node
  const docsTypesNode = docsPkg.devDependencies?.["@types/node"]
  if (!docsTypesNode || extractMajorVersion(docsTypesNode) !== majorVersion) {
    error(
      `docs/package.json devDependencies['@types/node'] major version should be '${majorVersion}', but found '${docsTypesNode}'`,
    )
  }

  // 5. Check renovate.json rule
  const typesNodeRule = renovate.packageRules?.find((rule: any) =>
    rule.matchPackageNames?.includes("@types/node"),
  )
  if (!typesNodeRule || typesNodeRule.allowedVersions !== expectedEngine) {
    error(
      `renovate.json is missing a packageRule for '@types/node' with allowedVersions: '${expectedEngine}'`,
    )
  }

  // 6. Check typescript version consistency
  const rootTs = pkg.devDependencies?.typescript
  const docsTs = docsPkg.devDependencies?.typescript
  if (!rootTs || !docsTs || rootTs !== docsTs) {
    error(
      `TypeScript versions do not match across workspaces! Root has '${rootTs || "missing"}', Docs has '${docsTs || "missing"}'`,
    )
  }

  // 7. Check overrides consistency
  const lock = readJsonFile("package-lock.json")
  Object.entries(pkg.overrides || {}).forEach(([name, version]) => {
    const overrideVersion = version as string
    if (overrideVersion.includes("^") || overrideVersion.includes("~")) {
      error(
        `Override for '${name}' should be strictly pinned, but found '${overrideVersion}'`,
      )
    }
    const actualVersion = lock.packages[`node_modules/${name}`]?.version
    if (actualVersion && actualVersion !== overrideVersion.replace(/^[^0-9]*/, "")) {
      error(
        `Override for '${name}' is set to '${overrideVersion}', but lockfile has '${actualVersion}'`,
      )
    }
  })

  // 8. Check release cool-down consistency
  const daysMatch = renovate.minimumReleaseAge?.match(/(\d+) days/)
  const days = daysMatch ? parseInt(daysMatch[1]) : 7
  const beforeDate = new Date()
  beforeDate.setDate(beforeDate.getDate() - days)
  const beforeStr = beforeDate.toISOString()
  console.log(`[INFO] Verifying release cool-down (${days} days, cutoff: ${beforeStr})...`)

  const findCulprits = (dir: string, cutoff: string) => {
    const packageJson = readJsonFile(path.join(dir, "package.json"))
    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    }

    console.log(`[INFO] Inspecting direct dependencies in ${dir} to find culprits...`)
    for (const [name, version] of Object.entries(allDeps)) {
      const pinned = (version as string).replace(/^[^0-9]*/, "")
      try {
        const timeJson = execSync(`npm view ${name} time --json`, { stdio: "pipe" }).toString()
        const times = JSON.parse(timeJson)
        const pubTime = times[pinned]
        if (pubTime && pubTime > cutoff) {
          error(
            `Release cool-down violation in ${dir}: ${name}@${pinned} was published on ${pubTime.split("T")[0]}, which is after the cutoff ${cutoff}.`,
          )
        }
      } catch (e) {
        // Skip packages that fail npm view (e.g. private or local)
      }
    }
  }

  const verifyCoolDown = (dir: string) => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "npm-check-"))
    try {
      const pkgPath = path.join(dir, "package.json")
      if (fs.existsSync(pkgPath)) {
        fs.copyFileSync(pkgPath, path.join(tempDir, "package.json"))
        if (fs.existsSync(".npmrc")) {
          fs.copyFileSync(".npmrc", path.join(tempDir, ".npmrc"))
        }

        const cmd = `npm install --package-lock-only --before ${beforeStr} --no-audit --ignore-scripts --legacy-peer-deps --quiet`
        execSync(cmd, { cwd: tempDir, stdio: "pipe" })
      }
    } catch (e: any) {
      const stderr = e.stderr?.toString() || ""
      if (stderr.includes("ETARGET") || stderr.includes("notarget")) {
        // We found a violation. Now let's be helpful and find exactly which ones.
        findCulprits(dir, beforeStr)
      } else {
        error(`Failed to verify release cool-down in ${dir}: ${e.message}\n${stderr}`)
      }
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true })
    }
  }

  verifyCoolDown(".")
  verifyCoolDown("docs")

  if (hasErrors) {
    console.error(
      "\nVersion drift or cool-down violation detected! Please ensure dependencies respect the Renovate releaseAge policy.",
    )
    process.exit(1)
  } else {
    console.log(
      `[SUCCESS] Node.js major version ${majorVersion}, TypeScript, Overrides, and Release Cool-down are perfectly aligned across all configuration files.`,
    )
  }
}

lintNodeVersion()
