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
  workspaces?: string[]
}

const workspaceScripts = new Map<string, string[]>()

function loadWorkspaceScripts(workspaces?: string[]) {
  if (!workspaces) return
  for (const ws of workspaces) {
    const wsPkgPath = path.join(BASE_DIR, ws, "package.json")
    if (fs.existsSync(wsPkgPath)) {
      const wsPkg: PackageJson = JSON.parse(fs.readFileSync(wsPkgPath, "utf-8"))
      workspaceScripts.set(ws, Object.keys(wsPkg.scripts || {}))
    }
  }
}

let errorCount = 0

function logError(message: string) {
  console.error(`ERROR: ${message}`)
  errorCount++
}

// Graph for cycle detection
// Node IDs: "npm:<name>", "npm:<workspace>:<name>", or "file:<path>"
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
  workspaceName?: string,
): string[] {
  const prefixNode = workspaceName ? `workspace:${workspaceName}:` : "npm:"
  if (scriptName.endsWith("*")) {
    const prefix = scriptName.slice(0, -1)
    const matches = definedScripts.filter((s) => s.startsWith(prefix))
    if (matches.length === 0) {
      logError(
        `No scripts match wildcard reference: '${scriptName}' (Context: ${context})`,
      )
    }
    return matches.map((m) => `${prefixNode}${m}`)
  }

  if (!definedScripts.includes(scriptName)) {
    const scope = workspaceName ? `workspace '${workspaceName}'` : "root"
    logError(
      `Referenced npm script in ${scope} is missing: '${scriptName}' (Context: ${context})`,
    )
    return []
  }
  return [`${prefixNode}${scriptName}`]
}

function extractAndResolveNpmCalls(
  commandText: string,
  rootScriptNames: string[],
  context: string,
): string[] {
  const resolvedTargets: string[] = []

  // 1. Match npm (run|test|exec|start) invocations
  const npmMatches = commandText.matchAll(
    /(?:^|[;&|]\s*|\bnpx\s+)?npm\s+(run|test|exec|start)\b([^;&|]*)/g,
  )

  for (const match of npmMatches) {
    const action = match[1]
    const argsString = match[2].trim()
    const tokens = argsString.split(/\s+/).filter(Boolean)

    let workspace: string | undefined
    let scriptName: string | undefined

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i]
      if (token === "-w" && i + 1 < tokens.length) {
        workspace = tokens[++i]
      } else if (token.startsWith("--workspace=")) {
        workspace = token.slice("--workspace=".length)
      } else if (token === "--workspace" && i + 1 < tokens.length) {
        workspace = tokens[++i]
      } else if (token === "--prefix" && i + 1 < tokens.length) {
        workspace = tokens[++i]
      } else if (token.startsWith("--prefix=")) {
        workspace = token.slice("--prefix=".length)
      } else if (token.startsWith("-")) {
        // Option flag, skip
      } else if (!scriptName) {
        scriptName = token
      }
    }

    if (!scriptName) {
      if (action === "test" || action === "start") {
        scriptName = action
      }
    }

    if (scriptName) {
      if (workspace) {
        const wsScripts = workspaceScripts.get(workspace)
        if (wsScripts) {
          const targets = resolveNpmScript(
            scriptName,
            wsScripts,
            context,
            workspace,
          )
          resolvedTargets.push(...targets)
        } else {
          logError(
            `Referenced workspace '${workspace}' does not exist or has no package.json (Context: ${context})`,
          )
        }
      } else {
        const targets = resolveNpmScript(scriptName, rootScriptNames, context)
        resolvedTargets.push(...targets)
      }
    }
  }

  // 2. Extract npm: calls (e.g. from concurrently)
  const npmColonMatches = commandText.matchAll(/npm:([a-zA-Z0-9:*-]+)/g)
  for (const match of npmColonMatches) {
    const targets = resolveNpmScript(match[1], rootScriptNames, context)
    resolvedTargets.push(...targets)
  }

  return resolvedTargets
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
  loadWorkspaceScripts(pkg.workspaces)

  const scripts = pkg.scripts || {}
  const scriptNames = Object.keys(scripts)

  // 1. Process package.json scripts
  for (const [name, command] of Object.entries(scripts)) {
    const sourceNode = `npm:${name}`
    const context = `package.json script '${name}'`

    // Extract and resolve npm calls
    const npmTargets = extractAndResolveNpmCalls(command, scriptNames, context)
    npmTargets.forEach((t) => addEdge(sourceNode, t))

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

        // Extract and resolve npm calls
        const npmTargets = extractAndResolveNpmCalls(line, scriptNames, context)
        npmTargets.forEach((t) => addEdge(sourceNode, t))

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
