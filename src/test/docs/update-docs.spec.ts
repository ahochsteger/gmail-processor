import { ContextType, MetaInfo, MetaInfoType, RunMode } from "../../lib/Context"
import { AttachmentActions } from "../../lib/actions/AttachmentActions"
import { defaultDateFormat, ExprInfoType, filterFunctions } from "../../lib/expr/ExprFilter"
import { PatternUtil } from "../../lib/utils/PatternUtil"
import { ConfigMocks } from "../mocks/ConfigMocks"
import { NEW_DOCS_FILE_NAME } from "../mocks/GDriveMocks"
import { GMailMocks } from "../mocks/GMailMocks"
import { MockFactory } from "../mocks/MockFactory"

const dateInfo = `Use \`"\${<key>:date::<format>}"\` to format the date/time using a custom [date-fns format strings](https://date-fns.org/docs/format) (default: \`"${defaultDateFormat}"\`).`
const variableInfo = `Custom variables defined at \`global.variables\` to better manage recurring substitution values.`
const mocks = MockFactory.newCustomMocks(
  ConfigMocks.newComplexConfigJson(),
  GMailMocks.getGmailSampleData(),
  [0, 0, 0],
  [0, 0, 0],
  RunMode.SAFE_MODE,
)
const ctx = mocks.attachmentContext

function log(s: string) {
  if (process.env.GENERATING_DOCS==="true") {
    process.stderr.write(`${s}\n`)
  }
}

function write(s: string) {
  if (process.env.GENERATING_DOCS==="true") {
    process.stdout.write(`${s}\n`)
  }
}

enum ActionContextType {
  ACTION = "action"
}
type PlaceholderContextType = ContextType | ActionContextType

function genMetaInfoDocs(contextType: PlaceholderContextType, m: MetaInfo) {
  const data: unknown[] = []
  data.push
  Object.keys(m)
    .sort()
    .forEach((k, _idx, _arr) => {
      const stringValue = PatternUtil.stringValue(ctx, k, m)
      if (!m[k]) return
      let deprInfo = m[k].deprecationInfo ?? ""
      let desc = m[k].description
      if (m[k].type === MetaInfoType.DATE) desc += ` ${dateInfo}`
      if (m[k].type === MetaInfoType.VARIABLE) desc += ` ${variableInfo}`
      data.push({
        key:k,
        title: m[k].title,
        type: m[k].type,
        scope: contextType,
        example: JSON.stringify(stringValue),
        deprecated: !!deprInfo,
        deprecationInfo: JSON.stringify(deprInfo),
        description: desc,
      })
    })
    log(JSON.stringify(data))
    return {
      contextType: contextType,
      placeholder: data
    }
  }

function genFunctionDocs(
  name: string,
  info: ExprInfoType,
) {
  const libDocs: Record<string,(name: string) => string> = {
    "date-fns": (name: string) => `See function [${name}](https://date-fns.org/v${require("date-fns/package.json").version}/docs/${name}) of [date-fns](https://date-fns.org/).`,
    "parse-duration": (_name: string) => `https://github.com/jkroso/parse-duration?tab=readme-ov-file#api`,
  }
  let desc = info.description ?? ""
  if (info.lib && libDocs[info.lib]) {
    const upstreamDesc = libDocs[info.lib](info.origFn ?? name)
    desc += `\n${upstreamDesc}`
  }
  return {
    key: name,
    lib: info.lib,
    description: desc,
  }
}

describe("Generate Context Substitution Docs", () => {
  const docs: unknown[] = []
  it("should generate environment context substitution docs", () => {
    docs.push(genMetaInfoDocs(
      ContextType.ENV,
      ctx.envMeta,
    ))
  })
  it("should generate processing context substitution docs", () => {
    docs.push(genMetaInfoDocs(
      ContextType.PROCESSING,
      ctx.procMeta,
    ))
  })
  it("should generate thread context substitution docs", () => {
    docs.push(genMetaInfoDocs(
      ContextType.THREAD,
      ctx.threadMeta,
    ))
  })
  it("should generate message context substitution docs", () => {
    docs.push(genMetaInfoDocs(
      ContextType.MESSAGE,
      ctx.messageMeta,
    ))
  })
  it("should generate attachment context substitution docs", () => {
    docs.push(genMetaInfoDocs(
      ContextType.ATTACHMENT,
      ctx.attachmentMeta,
    ))
  })
  it("should generate attachment action context substitution docs", () => {
    const result = AttachmentActions.extractText(ctx, {
      docsFileLocation: NEW_DOCS_FILE_NAME,
      extract:
        "Invoice date:\\s*(?<invoiceDate>[0-9-]+)\\s*Invoice number:\\s*(?<invoiceNumber>[0-9]+)",
    })
    if (result.actionMeta) {
      docs.push(genMetaInfoDocs(
        ActionContextType.ACTION,
        result.actionMeta,
      ))
    }
  })
  it("should write the generated docs data file", () => {
    const out = JSON.stringify(docs, null, 2)
    log(out)
    write(out)
  })
})
describe("Generate Expression Filter Function Docs", () => {
  it("should generate date expression filter function docs", () => {
    const docs: unknown[] = []
    for (const [k, fnInfo] of Object.entries(filterFunctions)) {
      docs.push(genFunctionDocs(k, fnInfo))
    }
    const out = JSON.stringify(docs, null, 2)
    log(out)
    write(out)
  })
})
