import * as fs from "fs"
import * as path from "path"

const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
  bgGreen: "\x1b[42m",
  bgRed: "\x1b[41m",
  white: "\x1b[37m",
}

interface Assertion {
  level: "assertion"
  status: string
  message: string
}

interface Test {
  level: "test"
  message: string
  status: string
  results?: Assertion[]
}

interface Suite {
  level: "suite"
  name: string
  message: string
  status: string
  results?: Test[]
}

interface Summary {
  level: "summary"
  name: string
  message: string
  status: string
  results?: Suite[]
}

function getStatusIcon(status: string): string {
  return status === "success"
    ? `${colors.green}✓${colors.reset}`
    : `${colors.red}✗${colors.reset}`
}

function getStatusColor(status: string): string {
  return status === "success" ? colors.green : colors.red
}

function formatResult(summary: Summary): string {
  const lines: string[] = []

  lines.push("")
  const titleText = ` E2E TEST RUN SUMMARY: ${summary.status.toUpperCase()} `
  const titleBg = summary.status === "success" ? colors.bgGreen : colors.bgRed
  lines.push(
    `${colors.bold}${titleBg}${colors.white}${titleText}${colors.reset}`,
  )
  lines.push("")

  let totalSuites = 0
  let passedSuites = 0
  let totalTests = 0
  let passedTests = 0
  let totalAssertions = 0
  let passedAssertions = 0

  if (summary.results) {
    for (const suite of summary.results) {
      totalSuites++
      if (suite.status === "success") passedSuites++

      lines.push(
        `${colors.bold}${colors.cyan}Suite: ${suite.name}${colors.reset} (${getStatusIcon(suite.status)})`,
      )

      if (suite.results) {
        for (const test of suite.results) {
          totalTests++
          if (test.status === "success") passedTests++

          lines.push(
            `  ${getStatusIcon(test.status)} ${colors.bold}${test.message}${colors.reset}`,
          )

          if (test.results) {
            for (const assertion of test.results) {
              totalAssertions++
              if (assertion.status === "success") passedAssertions++

              lines.push(
                `    ${getStatusIcon(assertion.status)} ${colors.gray}${assertion.message}${colors.reset}`,
              )
            }
          }
        }
      }
      lines.push("") // empty line between suites
    }
  }

  // Summary statistics
  lines.push(`${colors.bold}Statistics:${colors.reset}`)
  lines.push(
    `  Suites:     ${getStatusColor(passedSuites === totalSuites ? "success" : "failure")}${passedSuites} passed${colors.reset}, ${totalSuites} total`,
  )
  lines.push(
    `  Tests:      ${getStatusColor(passedTests === totalTests ? "success" : "failure")}${passedTests} passed${colors.reset}, ${totalTests} total`,
  )
  lines.push(
    `  Assertions: ${getStatusColor(passedAssertions === totalAssertions ? "success" : "failure")}${passedAssertions} passed${colors.reset}, ${totalAssertions} total`,
  )
  lines.push("")

  return lines.join("\n")
}

function parseSummary(input: string): Summary {
  try {
    const parsed = JSON.parse(input.trim())
    if (parsed && parsed.level === "summary") {
      return parsed as Summary
    }
  } catch {
    // Ignore and try extraction
  }

  // Find something that looks like the JSON summary
  const startIndex = input.indexOf('{"level":"summary"')
  if (startIndex !== -1) {
    const subStr = input.substring(startIndex)
    const endIndex = subStr.lastIndexOf("}")
    if (endIndex !== -1) {
      const jsonCandidate = subStr.substring(0, endIndex + 1)
      try {
        const parsed = JSON.parse(jsonCandidate)
        if (parsed && parsed.level === "summary") {
          return parsed as Summary
        }
      } catch (e) {
        throw new Error(
          `Found JSON candidate starting with summary level, but failed to parse: ${String(e)}`,
        )
      }
    }
  }

  throw new Error("Could not find a valid E2E JSON summary in the input.")
}

function runWithInput(input: string) {
  try {
    const summary = parseSummary(input)
    console.log(formatResult(summary))
    if (summary.status !== "success") {
      process.exit(1)
    }
  } catch (error) {
    console.error(
      `${colors.bold}${colors.red}Parsing Error:${colors.reset} ${String(error)}`,
    )
    console.log("\nRaw Output:\n", input)
    process.exit(1)
  }
}

function main() {
  const args = process.argv.slice(2)
  let inputSource = ""

  if (args.length > 0 && args[0] !== "-") {
    // Read from specified file
    const filePath = path.resolve(process.cwd(), args[0])
    if (!fs.existsSync(filePath)) {
      console.error(`ERROR: File not found: ${args[0]}`)
      process.exit(1)
    }
    inputSource = fs.readFileSync(filePath, "utf-8")
    runWithInput(inputSource)
  } else {
    // If running in a TTY and build/stdout.log exists, default to that, otherwise read from stdin
    const defaultLogPath = path.resolve(process.cwd(), "build/stdout.log")
    if (!process.stdin.isTTY) {
      // Pipe input
      let data = ""
      process.stdin.setEncoding("utf-8")
      process.stdin.on("data", (chunk) => {
        data += chunk
      })
      process.stdin.on("end", () => {
        runWithInput(data)
      })
    } else if (fs.existsSync(defaultLogPath)) {
      inputSource = fs.readFileSync(defaultLogPath, "utf-8")
      runWithInput(inputSource)
    } else {
      console.error(
        "ERROR: No input provided via stdin and build/stdout.log does not exist.",
      )
      console.error("Usage: npx ts-node scripts/format-e2e.ts [file_path]")
      console.error(
        "   or: cat build/stdout.log | npx ts-node scripts/format-e2e.ts",
      )
      process.exit(1)
    }
  }
}

main()
