import { MockFactory, Mocks } from "../../test/mocks/MockFactory"
import { GmailAdapter } from "./GmailAdapter"

let mocks: Mocks
let gmailAdapter: GmailAdapter

beforeEach(() => {
  mocks = MockFactory.newMocks()
  gmailAdapter = new GmailAdapter(
    mocks.envContext,
    mocks.processingContext.proc.config.settings,
  )
})

const emailHeader =
  '<dt>From:</dt><dd class="strong"><a href="mailto:message-from@example.com">message-from@example.com</a></dd>'

it("should generate a HTML message with header", () => {
  const actual = gmailAdapter.messageAsHtml(mocks.message, {
    includeHeader: true,
  })
  expect(actual).toContain(emailHeader)
})

it("should generate a HTML message without header", () => {
  const actual = gmailAdapter.messageAsHtml(mocks.message, {
    includeHeader: false,
  })
  expect(actual).not.toContain(emailHeader)
})
