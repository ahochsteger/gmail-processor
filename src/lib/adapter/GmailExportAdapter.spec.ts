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
