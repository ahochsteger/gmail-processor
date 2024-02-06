import {
  NEW_HTML_FILE_NAME,
  NEW_PDF_FILE_NAME,
} from "../../test/mocks/GDriveMocks"
import { MockFactory, Mocks } from "../../test/mocks/MockFactory"
import { GmailAdapter } from "./GmailAdapter"

let mocks: Mocks
let adapter: GmailAdapter

beforeEach(() => {
  mocks = MockFactory.newMocks()
  adapter = new GmailAdapter(
    mocks.envContext,
    mocks.processingContext.proc.config.settings,
  )
})

it("should export a message as HTML document", () => {
  const actual = adapter.messageAsHtml(mocks.message, NEW_HTML_FILE_NAME, {})
  expect(actual).toBeDefined()
  expect(actual.getContentType()).toEqual("text/html")
})

it("should export a message as PDF document", () => {
  const actual = adapter.messageAsPdf(mocks.message, NEW_PDF_FILE_NAME, {})
  expect(actual).toBeDefined()
  expect(actual.getContentType()).toEqual("application/pdf")
})

it("should export a thread as HTML document", () => {
  const actual = adapter.threadAsHtml(mocks.thread, NEW_HTML_FILE_NAME, {})
  expect(actual).toBeDefined()
  expect(actual.getContentType()).toEqual("text/html")
})

it("should export a thread as PDF document", () => {
  const actual = adapter.threadAsPdf(mocks.thread, NEW_PDF_FILE_NAME, {})
  expect(actual).toBeDefined()
  expect(actual.getContentType()).toEqual("application/pdf")
})
