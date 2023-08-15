import { PartialDeep } from "type-fest"
import { RunMode } from "../../lib/Context"
import { Config, ProcessingConfig } from "../../lib/config/Config"
import { GmailProcessor } from "../mocks/Examples"
import { MockFactory, Mocks } from "../mocks/MockFactory"

const exampleMinConfigV2: PartialDeep<Config> = {
  threads: [{}],
}

let mocks: Mocks
beforeEach(() => {
  mocks = MockFactory.newMocks(
    GmailProcessor.Lib.getEffectiveConfig(exampleMinConfigV2),
    RunMode.DANGEROUS,
  )
})

it("should provide the effective config of v2 example exampleMin", () => {
  const effectiveConfig =
    GmailProcessor.Lib.getEffectiveConfig(exampleMinConfigV2)
  expect(effectiveConfig).toBeInstanceOf(ProcessingConfig)
})

it("should process a v2 config example", () => {
  const result = GmailProcessor.Lib.run(
    exampleMinConfigV2,
    "dry-run",
    mocks.envContext,
  )
  expect(result.status).toEqual("ok")
})
