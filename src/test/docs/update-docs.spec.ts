import { ContextType, MetaInfo, MetaInfoType, RunMode } from "../../lib/Context"
import { PatternUtil, defaultDateFormat } from "../../lib/utils/PatternUtil"
import { ConfigMocks } from "../mocks/ConfigMocks"
import { GMailMocks } from "../mocks/GMailMocks"
import { MockFactory } from "../mocks/MockFactory"

const dateInfo = `Use \`"\${<key>:format:<dateformat>}"\` to format the date/time using a custom [Moment.js format strings](https://momentjs.com/docs/#/displaying/format/) (default: \`"${defaultDateFormat}"\`).`
const variableInfo = `All custom variables configured at \`global.variables\` are available using \`"\${variables.<varName>}"\`.`
const mocks = MockFactory.newCustomMocks(
  ConfigMocks.newDefaultConfigJson(),
  GMailMocks.getGmailSampleData(),
  [0, 0, 0],
  [0, 0, 0],
  RunMode.SAFE_MODE,
)
const ctx = mocks.attachmentContext

function write(s: string) {
  process.stdout.write(`${s}\n`)
}

function genMetaInfoDocs(contextType: ContextType, m: MetaInfo, title: string, description: string, position: string) {
  if (position === "first") {
    write("[")
  }
  write(`{"contextType":"${contextType}","title":"${title}","description":"${description}","placeholder":[`)
  Object.keys(m)
    .sort()
    .forEach((k, idx, arr) => {
      const stringValue = PatternUtil.stringValue(ctx, ctx.meta, k)
      let desc = m[k].description
      if (m[k].type === MetaInfoType.DATE) desc += ` ${dateInfo}`
      if (m[k].type === MetaInfoType.VARIABLE) desc += ` ${variableInfo}`
      let condComma = ""
      if (idx < arr.length - 1) {
        condComma = ","
      }
      write(`  {"key":"${k}", "type": "${m[k].type}", "example": "${stringValue}", "description": ${JSON.stringify(desc)}}${condComma}`)
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
  it("should generate processing context substitution docs", () => {
    genMetaInfoDocs(
      ContextType.PROCESSING,
      ctx.procMeta,
      "Processing Placeholder",
      "These context substitution placeholder are globally available.",
      "first",
    )
  })
  it("should generate thread context substitution docs", () => {
    genMetaInfoDocs(
      ContextType.THREAD,
      ctx.threadMeta,
      "Thread Placeholder",
      "These context substitution placeholder are defined for the currently GMail thread.",
      "standard",
    )
  })
  it("should generate message context substitution docs", () => {
    genMetaInfoDocs(
      ContextType.MESSAGE,
      ctx.messageMeta,
      "Message Placeholder",
      "These context substitution placeholder are defined for the currently processed GMail message.",
      "standard",
    )
  })
  it("should generate attachment context substitution docs", () => {
    genMetaInfoDocs(
      ContextType.ATTACHMENT,
      ctx.attachmentMeta,
      "Attachment Placeholder",
      "These context substitution placeholder are defined for the currently processed GMail attachment.",
      "last",
    )
  })
})
