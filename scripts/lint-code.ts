import * as fs from "fs"
import path from "path"

type ESLintSupression = {
  kind: string
  justification: string
}
type ESLintMessage = {
  ruleId: string
  severity: number
  message: string
  line: number
  column: number
  nodeType: string
  messageId: string
  endLine: number
  endColumn: number
  suppressions: ESLintSupression[]
}

type ESLintEntry = {
  filePath: string
  messages: ESLintMessage[]
  suppressedMessages: ESLintMessage[]
  errorCount: number
  fatalErrorCount: number
  warningCount: number
  fixableErrorCount: number
  fixableWarningCount: number
  usedDeprecatedRules: string[]
}

function logEntry(level: string, e: ESLintEntry) {
  e.messages.forEach((m) => {
    console.log(`${level} ${e.filePath}:${m.line}:${m.column} ${m.message}`)
  })
}

if (process.argv.length < 3) {
  console.error("Missing arguments: Path to eslint json file")
  process.exit(1)
}
const filePath = path.normalize(process.argv[2])
if (filePath.includes("..")) {
  console.error(
    `Invalid path to eslint json file: '${filePath}' must not contain '..'!`,
  )
  process.exit(1)
}
const results = JSON.parse(fs.readFileSync(filePath, "utf8")) as ESLintEntry[]
const fatalErrors = results.filter((e) => e.fatalErrorCount > 0)
const errors = results.filter((e) => e.errorCount > 0)
const warnings = results.filter((e) => e.warningCount > 0)
const suppressed = results.filter((e) => e.suppressedMessages.length > 0)
fatalErrors.forEach((e) => logEntry("FATAL", e))
errors.forEach((e) => logEntry("ERROR", e))
warnings.forEach((e) => logEntry("WARN", e))

console.log("Summary:")
console.log(`- Fatal errors: ${fatalErrors.length}`)
console.log(`- Errors: ${errors.length}`)
console.log(`- Warnings: ${warnings.length}`)
console.log(`- Suppressed: ${suppressed.length}`)
process.exit(fatalErrors.length + errors.length + warnings.length)
