import { MetaInfo, MetaInfoType, RunMode } from "../../lib/Context"
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

function genMetaInfoDocs(m: MetaInfo, title: string, description: string) {
  write(``)
  write(`## ${title}`)
  write(``)
  write(`${description}`)
  write(``)
  write(`| Key | Type | Example | Description |`)
  write(`|-----|------|---------|-------------|`)
  Object.keys(m)
    .sort()
    .forEach((k) => {
      const stringValue = PatternUtil.stringValue(ctx, ctx.meta, k)
      let desc = m[k].description
      if (m[k].type === MetaInfoType.DATE) desc += ` ${dateInfo}`
      if (m[k].type === MetaInfoType.VARIABLE) desc += ` ${variableInfo}`
      write(`| \`${k}\` | \`${m[k].type}\` | \`${stringValue}\` | ${desc} |`)
    })
}

describe("Generate MetaInfo Docs", () => {
  write(`# Meta Infos`)
  write(``)
  write(
    `The following meta infos are available for substitution in strings, depending on the context.`,
  )
  it("should generate processing meta info docs", () => {
    genMetaInfoDocs(
      ctx.procMeta,
      "Processing Meta Infos",
      "These meta info placeholder are globally available.",
    )
  })
  it("should generate thread meta info docs", () => {
    genMetaInfoDocs(
      ctx.threadMeta,
      "Thread Meta Infos",
      "These meta info placeholder are defined for the currently GMail thread.",
    )
  })
  it("should generate message meta info docs", () => {
    genMetaInfoDocs(
      ctx.messageMeta,
      "Message Meta Infos",
      "These meta info placeholder are defined for the currently processed GMail message.",
    )
  })
  it("should generate attachment meta info docs", () => {
    genMetaInfoDocs(
      ctx.attachmentMeta,
      "Attachment Meta Infos",
      "These meta info placeholder are defined for the currently processed GMail attachment.",
    )
  })
})
