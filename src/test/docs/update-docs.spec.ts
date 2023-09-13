import { ContextType, MetaInfo, MetaInfoType, RunMode } from "../../lib/Context"
import { PatternUtil, defaultDateFormat } from "../../lib/utils/PatternUtil"
import { ConfigMocks } from "../mocks/ConfigMocks"
import { GMailMocks } from "../mocks/GMailMocks"
import { MockFactory } from "../mocks/MockFactory"

const dateInfo = `Use \`"\${<key>:format:<format>}"\` to format the date/time using a custom [Moment.js format strings](https://momentjs.com/docs/#/displaying/format/) (default: \`"${defaultDateFormat}"\`).`
const variableInfo = `Custom variables defined at \`global.variables\` to better manage recurring substitution values.`
const mocks = MockFactory.newCustomMocks(
  ConfigMocks.newDefaultConfigJson(),
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
      let desc = m[k].description
      if (m[k].type === MetaInfoType.DATE) desc += ` ${dateInfo}`
      if (m[k].type === MetaInfoType.VARIABLE) desc += ` ${variableInfo}`
      let condComma = ""
      if (idx < arr.length - 1) {
        condComma = ","
      }
      write(`  {"key":"${k}", "type": "${m[k].type}", "scope": "${contextType}", "example": "${stringValue}", "description": ${JSON.stringify(desc)}}${condComma}`)
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
