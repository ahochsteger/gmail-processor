import { Mocks } from "../../test/mocks/Mocks"
import { anyString } from "jest-mock-extended"
import { MockFactory } from "../../test/mocks/MockFactory"
import { GmailProcessor } from "./GmailProcessor"

function getMocks() {
  const mocks = new Mocks()
  return {
    ...mocks,
  }
}

it("should process the thread rules", () => {
  // Prepare fake result for search() in substitute:
  const config = MockFactory.newDefaultConfig()
  const mocks = getMocks()
  const gmailProcessor = new GmailProcessor(mocks.gasContext)
  mocks.gmailApp.search
    .calledWith(anyString(), 1, config.settings.maxBatchSize)
    .mockReturnValue([])
  gmailProcessor.run(config, true)
  expect(mocks.gasContext.gmailApp.search).toHaveBeenCalledTimes(
    config.handler.length,
  )
})
