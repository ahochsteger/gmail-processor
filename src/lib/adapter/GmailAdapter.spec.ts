import { MockFactory, Mocks } from "../../test/mocks/MockFactory"
import { GmailAdapter } from "./GmailAdapter"

let mocks: Mocks
let adapter: GmailAdapter

beforeAll(() => {
  mocks = MockFactory.newMocks()
  adapter = new GmailAdapter(
    mocks.envContext,
    mocks.processingContext.proc.config.settings,
  )
})

beforeEach(() => {
  jest.clearAllMocks()
})

it("should export a message as HTML document", () => {
  const actual = adapter.messageAsHtml(mocks.message, {})
  expect(actual).toBeDefined()
  expect(actual.getContentType()).toEqual("text/html")
})

it("should export a message as PDF document", () => {
  const actual = adapter.messageAsPdf(mocks.message, {})
  expect(actual).toBeDefined()
  expect(actual.getContentType()).toEqual("application/pdf")
})

it("should export a thread as HTML document", () => {
  const actual = adapter.threadAsHtml(mocks.thread, {})
  expect(actual).toBeDefined()
  expect(actual.getContentType()).toEqual("text/html")
})

it("should export a thread as PDF document", () => {
  const actual = adapter.threadAsPdf(mocks.thread, {})
  expect(actual).toBeDefined()
  expect(actual.getContentType()).toEqual("application/pdf")
})
