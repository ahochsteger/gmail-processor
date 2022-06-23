import { anyString } from "jest-mock-extended"
import { MockFactory } from "../test/mocks/MockFactory"

const config = MockFactory.newDefaultConfig()
const md = MockFactory.newMockObjects()
const gasContext = MockFactory.newGasContextMock(md)
const gmailProcessor = MockFactory.newGmailProcessorMock(config, gasContext)

describe("GmailProcessor", () => {
  it("should process the thread rules", () => {
    // Prepare fake result for search() in substitute:
    // mockedGmailApp.search(Arg.any(), 1, config.maxBatchSize).returns([])
    md.gmailApp.search
      .calledWith(anyString(), 1, config.maxBatchSize)
      .mockReturnValue([])
    gmailProcessor.run()
    expect(md.gmailApp.search).toHaveBeenCalledTimes(
      config.threadRules.length,
    )
    // mockedGmailApp.received(config.threadRules.length).search(anyString(), 1, config.maxBatchSize)
  })
  test.todo("should support date filter (newerThan) at rule level (PR #60)")
  test.todo("should support writing logs to Google Spreadsheet (PR #40)")
  test.todo("should not handle messages in trash (PR #39)")
})
