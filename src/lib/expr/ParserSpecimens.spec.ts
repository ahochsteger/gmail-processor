import { readFileSync, readdirSync, statSync } from "fs"
import path from "path"
import { ExprEvaluator } from "./ExprEvaluator"

const EXAMPLES_DIR = "src/examples"
const VALID_EXPRESSION_EXAMPLES = path.join(
  EXAMPLES_DIR,
  "expressions-valid.txt",
)
const INVALID_EXPRESSION_EXAMPLES = path.join(
  EXAMPLES_DIR,
  "expressions-invalid.txt",
)

function getFiles(dir: string): string[] {
  let files: string[] = []
  const items = readdirSync(dir)
  for (const item of items) {
    const fullPath = path.join(dir, item)
    if (statSync(fullPath).isDirectory()) {
      files = files.concat(getFiles(fullPath))
    } else if (fullPath.endsWith(".json")) {
      files.push(fullPath)
    }
  }
  return files
}

function loadSpecimens(file: string): string[] {
  return readFileSync(file, "utf-8")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "" && !line.startsWith("#"))
}

function findExpressions(obj: any): string[] {
  const expressions: string[] = []
  const scan = (val: any) => {
    if (typeof val === "string" && (val.includes("${") || val.includes("{{"))) {
      expressions.push(val)
    } else if (typeof val === "object" && val !== null) {
      Object.values(val).forEach(scan)
    }
  }
  scan(obj)
  return expressions
}

describe("Parser Specimens", () => {
  describe("Valid Expressions (.txt)", () => {
    const validSpecimens = loadSpecimens(VALID_EXPRESSION_EXAMPLES)
    test.each(validSpecimens)("should parse: %s", (expr) => {
      expect(() => ExprEvaluator.parse(expr)).not.toThrow()
    })
  })

  describe("Invalid Expressions (.txt)", () => {
    const invalidSpecimens = loadSpecimens(INVALID_EXPRESSION_EXAMPLES)
    test.each(invalidSpecimens)("should fail: %s", (expr) => {
      expect(() => ExprEvaluator.parse(expr)).toThrow()
    })
  })

  describe("Expressions from JSON Examples", () => {
    const exampleFiles = getFiles(EXAMPLES_DIR)
    exampleFiles.forEach((file) => {
      const content = readFileSync(file, "utf-8")
      const json = JSON.parse(content)
      const expressions = findExpressions(json)
      if (expressions.length > 0) {
        describe(path.relative(process.cwd(), file), () => {
          test.each(expressions)("should parse: %s", (expr) => {
            expect(() => ExprEvaluator.parse(expr)).not.toThrow()
          })
        })
      }
    })
  })
})
