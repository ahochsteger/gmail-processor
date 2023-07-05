import { MockFactory, Mocks } from "../../test/mocks/MockFactory"
import { GmailAdapter } from "./GmailAdapter"

let mocks: Mocks
let gmailAdapter: GmailAdapter

beforeEach(() => {
  mocks = MockFactory.newMocks()
  gmailAdapter = new GmailAdapter(mocks.envContext)
})

it("should generate a HTML message with header", () => {
  const actual = gmailAdapter.messageAsHtml(mocks.message, false)
  expect(actual).toContain("From: ")
})

it("should generate a HTML message without header", () => {
  const actual = gmailAdapter.messageAsHtml(mocks.message, true)
  expect(actual).not.toContain("From: ")
})
