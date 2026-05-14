import * as fs from "fs"
import * as path from "path"

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

  if (hasErrors) {
    console.error(
      "\nVersion drift detected! Please ensure devbox.json, package.json, package-lock.json, docs/package.json, and renovate.json are aligned.",
    )
    process.exit(1)
  } else {
    console.log(
      `[SUCCESS] Node.js major version ${majorVersion}, TypeScript, and Overrides are perfectly aligned across all configuration files.`,
    )
  }
}

lintNodeVersion()
