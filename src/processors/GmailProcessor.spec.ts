import { Mocks } from "../../test/mocks/Mocks"
import { Config } from "../config/Config"
import { anyString } from "jest-mock-extended"
import { MockFactory } from "../../test/mocks/MockFactory"
import { plainToClass } from "class-transformer"

const config = plainToClass(Config, MockFactory.newDefaultConfig())
const mocks = new Mocks()
const gasContext = MockFactory.newGasContextMock(mocks)
const gmailProcessor = MockFactory.newGmailProcessorMock(config, gasContext)

it("should process the thread rules", () => {
  // Prepare fake result for search() in substitute:
  // mockedGmailApp.search(Arg.any(), 1, config.maxBatchSize).returns([])
  mocks.gmailApp.search
    .calledWith(anyString(), 1, config.settings.maxBatchSize)
    .mockReturnValue([])
  gmailProcessor.run()
  expect(gasContext.gmailApp.search).toHaveBeenCalledTimes(
    config.handler.length,
  )
  // mockedGmailApp.received(config.threadRules.length).search(anyString(), 1, config.maxBatchSize)
})
