import { GMailMocks } from "../../test/mocks/GMailMocks"
import { MockFactory, Mocks } from "../../test/mocks/MockFactory"
import { GmailExportAdapter } from "./GmailExportAdapter"

let mocks: Mocks
let adapter: GmailExportAdapter

beforeEach(() => {
  mocks = MockFactory.newMocks()
  adapter = new GmailExportAdapter(
    mocks.envContext,
    mocks.processingContext.proc.config.settings,
  )
})

const emailHeader =
  '<dt>From:</dt><dd class="strong"><a href="mailto:message-from@example.com">message-from@example.com</a></dd>'

it("should generate a HTML message with header", () => {
  const actual = adapter.generateMessagesHtml([mocks.message], {
    includeHeader: true,
  })
  expect(actual).toContain(emailHeader)
})

it("should generate a HTML message without header", () => {
  const actual = adapter.generateMessagesHtml([mocks.message], {
    includeHeader: false,
  })
  expect(actual).not.toContain(emailHeader)
})

it("should process data urls in HTML", () => {
  const img =
    '<img width="16" height="16" alt="tick" src="data:image/gif;base64,R0lGODdhEAAQAMwAAPj7+FmhUYjNfGuxYYDJdYTIeanOpT+DOTuANXi/bGOrWj6CONzv2sPjv2CmV1unU4zPgISg6DJnJ3ImTh8Mtbs00aNP1CZSGy0YqLEn47RgXW8amasW7XWsmmvX2iuXiwAAAAAEAAQAAAFVyAgjmRpnihqGCkpDQPbGkNUOFk6DZqgHCNGg2T4QAQBoIiRSAwBE4VA4FACKgkB5NGReASFZEmxsQ0whPDi9BiACYQAInXhwOUtgCUQoORFCGt/g4QAIQA7">'
  const messages = GMailMocks.getMessages({
    messages: [
      {
        body: img,
      },
    ],
  })
  const actual = adapter.generateMessagesHtml(messages, {
    includeHeader: false,
  })
  expect(actual).toContain(img)
})
