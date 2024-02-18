import { ContextType, MetaInfo, MetaInfoType, RunMode } from "../../lib/Context"
import { DATE_FNS_FUNCTIONS, ExprInfoType, defaultDateFormat } from "../../lib/utils/DateUtils"
import { PatternUtil } from "../../lib/utils/PatternUtil"
import { ConfigMocks } from "../mocks/ConfigMocks"
import { GMailMocks } from "../mocks/GMailMocks"
import { MockFactory } from "../mocks/MockFactory"

const dateInfo = `Use \`"\${<key>:format:<format>}"\` to format the date/time using a custom [date-fns format strings](https://date-fns.org/docs/format) (default: \`"${defaultDateFormat}"\`).`
const variableInfo = `Custom variables defined at \`global.variables\` to better manage recurring substitution values.`
const mocks = MockFactory.newCustomMocks(
  ConfigMocks.newComplexConfigJson(),
  GMailMocks.getGmailSampleData(),
  [0, 0, 0],
  [0, 0, 0],
  RunMode.SAFE_MODE,
)
const ctx = mocks.attachmentContext

function write(s: string) {
  if (process.env.GENERATING_DOCS==="true") {
    process.stdout.write(`${s}\n`)
  }
}

function genMetaInfoDocs(contextType: ContextType, m: MetaInfo, position = "standard") {
  if (position === "first") {
    write("[")
  }
  write(`{"contextType":"${contextType}","placeholder":[`)
  Object.keys(m)
    .sort()
    .forEach((k, idx, arr) => {
      const stringValue = PatternUtil.stringValue(ctx, k)
      let deprInfo = m[k].deprecationInfo ?? ""
      let desc = m[k].description
      if (m[k].type === MetaInfoType.DATE) desc += ` ${dateInfo}`
      if (m[k].type === MetaInfoType.VARIABLE) desc += ` ${variableInfo}`
      let condComma = ""
      if (idx < arr.length - 1) {
        condComma = ","
      }
      write(`  {"key":"${k}", "type": "${m[k].type}", "scope": "${contextType}", "example": ${JSON.stringify(stringValue)}, "deprecated": ${!!deprInfo}, "deprecationInfo": ${JSON.stringify(deprInfo)}, "description": ${JSON.stringify(desc)}}${condComma}`)
    })
    let suffix = ","
    if (position === "last") {
      suffix=""
    }
    write(`]}${suffix}`)
    if (position === "last") {
      write("]")
    }
  }

function genDateExpressionDocs(
  dateFnsVersion: string,
  key: string,
  info: ExprInfoType,
  isLast: boolean
) {
  write(`  {"key":"${key}", "type": "${info.type}", "description": "See function [${key}](https://date-fns.org/v${dateFnsVersion}/docs/${key}) of [date-fns](https://date-fns.org/)."}${isLast ? "" : ","}`)
}

describe("Generate Context Substitution Docs", () => {
  it("should generate environment context substitution docs", () => {
    genMetaInfoDocs(
      ContextType.ENV,
      ctx.envMeta,
      "first",
    )
  })
  it("should generate processing context substitution docs", () => {
    genMetaInfoDocs(
      ContextType.PROCESSING,
      ctx.procMeta,
    )
  })
  it("should generate thread context substitution docs", () => {
    genMetaInfoDocs(
      ContextType.THREAD,
      ctx.threadMeta,
    )
  })
  it("should generate message context substitution docs", () => {
    genMetaInfoDocs(
      ContextType.MESSAGE,
      ctx.messageMeta,
    )
  })
  it("should generate attachment context substitution docs", () => {
    genMetaInfoDocs(
      ContextType.ATTACHMENT,
      ctx.attachmentMeta,
      "last",
    )
  })
})
describe("Generate Date Expression Substitution Docs", () => {
  it("should generate date expression substitution docs", () => {
    const dateFnsVersion = require("date-fns/package.json").version
    write("[")
    const expressions = Object.keys(DATE_FNS_FUNCTIONS)
    expressions.forEach((k) => {
      genDateExpressionDocs(dateFnsVersion, k, DATE_FNS_FUNCTIONS[k], k === expressions[expressions.length-1])
    })
    write("]")
  })
})