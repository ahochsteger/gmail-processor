import { Mocks } from "../../test/mocks/Mocks"
import { anyString } from "jest-mock-extended"
import { MockFactory } from "../../test/mocks/MockFactory"
import { GmailProcessor } from "./GmailProcessor"

it("should process the thread rules", () => {
  const config = MockFactory.newDefaultConfig()
  const mocks = new Mocks(config, true)
  const gmailProcessor = new GmailProcessor(mocks.gasContext)
  mocks.gmailApp.search
    .calledWith(anyString(), 1, config.settings.maxBatchSize)
    .mockReturnValue([])
  gmailProcessor.run(config, true)
  expect(mocks.gasContext.gmailApp.search).toHaveBeenCalledTimes(
    config.threadHandler.length,
  )
})
