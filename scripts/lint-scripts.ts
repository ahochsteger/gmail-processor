import * as fs from "fs"
import * as path from "path"

const BASE_DIR = process.cwd()
const PACKAGE_JSON_PATH = path.join(BASE_DIR, "package.json")
const SCRIPTS_DIR = path.join(BASE_DIR, "scripts")

interface Scripts {
  [key: string]: string
}

interface PackageJson {
  scripts?: Scripts
}

let errorCount = 0

function logError(message: string) {
  console.error(`ERROR: ${message}`)
  errorCount++
}

// Graph for cycle detection
// Node IDs: "npm:<name>" or "file:<path>"
const adjList = new Map<string, Set<string>>()

function addEdge(from: string, to: string) {
  if (!adjList.has(from)) adjList.set(from, new Set())
  adjList.get(from)!.add(to)
}

function checkFileExists(filePath: string, context: string): boolean {
  const absolutePath = path.isAbsolute(filePath)
    ? filePath
    : path.resolve(BASE_DIR, filePath)
  if (!fs.existsSync(absolutePath)) {
    logError(
      `Referenced file does not exist: '${filePath}' (Context: ${context})`,
    )
    return false
  }
  return true
}

function resolveNpmScript(
  scriptName: string,
  definedScripts: string[],
  context: string,
): string[] {
  if (scriptName.endsWith("*")) {
    const prefix = scriptName.slice(0, -1)
    const matches = definedScripts.filter((s) => s.startsWith(prefix))
    if (matches.length === 0) {
      logError(
        `No scripts match wildcard reference: '${scriptName}' (Context: ${context})`,
      )
    }
    return matches.map((m) => `npm:${m}`)
  }

  if (!definedScripts.includes(scriptName)) {
    logError(
      `Referenced npm script is missing: '${scriptName}' (Context: ${context})`,
    )
    return []
  }
  return [`npm:${scriptName}`]
}

function detectCycles() {
  const visited = new Set<string>()
  const visiting = new Set<string>()
  const pathStack: string[] = []

  function dfs(u: string) {
    visited.add(u)
    visiting.add(u)
    pathStack.push(u)

    const neighbors = adjList.get(u)
    if (neighbors) {
      for (const v of neighbors) {
        if (visiting.has(v)) {
          const cyclePath = pathStack.slice(pathStack.indexOf(v)).concat(v)
          logError(`Circular reference detected: ${cyclePath.join(" -> ")}`)
        } else if (!visited.has(v)) {
          dfs(v)
        }
      }
    }

    visiting.delete(u)
    pathStack.pop()
  }

  for (const node of adjList.keys()) {
    if (!visited.has(node)) {
      dfs(node)
    }
  }
}

function lint() {
  if (!fs.existsSync(PACKAGE_JSON_PATH)) {
    logError(`package.json not found at ${PACKAGE_JSON_PATH}`)
    return
  }

  const pkg: PackageJson = JSON.parse(
    fs.readFileSync(PACKAGE_JSON_PATH, "utf-8"),
  )
  const scripts = pkg.scripts || {}
  const scriptNames = Object.keys(scripts)

  // 1. Process package.json scripts
  for (const [name, command] of Object.entries(scripts)) {
    const sourceNode = `npm:${name}`
    const context = `package.json script '${name}'`

    // Extract npm calls
    const npmMatches = command.matchAll(
      /npm (?:run|test|exec) ([a-zA-Z0-9:*-]+)(?!.*--prefix)/g,
    )
    for (const match of npmMatches) {
      const targets = resolveNpmScript(match[1], scriptNames, context)
      targets.forEach((t) => addEdge(sourceNode, t))
    }

    // Extract npm: calls (concurrently)
    const npmColonMatches = command.matchAll(
      /npm:([a-zA-Z0-9:*-]+)(?!.*--prefix)/g,
    )
    for (const match of npmColonMatches) {
      const targets = resolveNpmScript(match[1], scriptNames, context)
      targets.forEach((t) => addEdge(sourceNode, t))
    }

    // Extract scripts/ file calls
    const scriptPathMatches = command.matchAll(
      /(scripts\/[a-zA-Z0-9._/-]+\.[a-z0-9]+)/g,
    )
    for (const match of scriptPathMatches) {
      const filePath = match[1]
      if (checkFileExists(filePath, context)) {
        addEdge(sourceNode, `file:${filePath}`)
      }
    }
  }

  // 2. Process script files
  if (fs.existsSync(SCRIPTS_DIR)) {
    const files = fs.readdirSync(SCRIPTS_DIR)
    for (const file of files) {
      const relativePath = `scripts/${file}`
      const fullPath = path.join(BASE_DIR, relativePath)
      if (fs.statSync(fullPath).isDirectory()) continue

      const sourceNode = `file:${relativePath}`
      const content = fs.readFileSync(fullPath, "utf-8")
      const lines = content.split("\n")
      const context = `script file '${relativePath}'`

      for (const line of lines) {
        const trimmed = line.trim()
        if (trimmed.startsWith("#")) continue // Skip comments
        if (line.includes("@generated")) continue // Skip documentation mentions

        // Extract npm calls from file
        const npmMatches = line.matchAll(
          /npm (?:run|test|exec) ([a-zA-Z0-9:*-]+)/g,
        )
        for (const match of npmMatches) {
          if (line.includes("--prefix")) continue // Skip subpackages
          const targets = resolveNpmScript(match[1], scriptNames, context)
          targets.forEach((t) => addEdge(sourceNode, t))
        }

        // Extract internal scripts/ file calls
        const scriptPathMatches = line.matchAll(
          /(scripts\/[a-zA-Z0-9._/-]+\.[a-z0-9]+)/g,
        )
        for (const match of scriptPathMatches) {
          const targetPath = match[1]
          if (targetPath === relativePath) continue // Skip self
          if (checkFileExists(targetPath, context)) {
            addEdge(sourceNode, `file:${targetPath}`)
          }
        }
      }
    }
  }

  console.log("Analyzing script dependency graph for cycles...")
  detectCycles()
}

console.log("Linting script references...")
lint()

if (errorCount > 0) {
  console.log(`\nFound ${errorCount} script/reference error(s).`)
  process.exit(1)
} else {
  console.log("All script references and dependency loops are valid.")
}
