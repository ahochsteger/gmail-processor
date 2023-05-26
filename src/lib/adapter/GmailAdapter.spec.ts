import { MockFactory, Mocks } from "../../test/mocks/MockFactory"
import { RunMode } from "../Context"
import { newConfig } from "../config/Config"
import { GmailAdapter } from "./GmailAdapter"

let mocks: Mocks
let gmailAdapter: GmailAdapter

beforeEach(() => {
  mocks = MockFactory.newMocks(newConfig(), RunMode.DANGEROUS)
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
