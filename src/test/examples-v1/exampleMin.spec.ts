import { convertV1ConfigToV2Config } from "../../lib"
import { V1Config } from "../../lib/config/v1/V1Config"
import { PartialDeep } from "type-fest"
import { RunMode } from "../../lib/Context"
import { ProcessingConfig } from "../../lib/config/Config"
import { GmailProcessor } from "../mocks/Examples"
import { MockFactory, Mocks } from "../mocks/MockFactory"

const exampleMinConfigV1: PartialDeep<V1Config> = {
  processedLabel: "gmail2gdrive/client-test",
  sleepTime: 100,
  maxRuntime: 280,
  newerThan: "2m",
  timezone: "GMT",
  rules: [
    {
      filter: "to:my.name+scans@gmail.com",
      folder: "'Scans'-yyyy-MM-dd",
    },
  ],
}

let mocks: Mocks
beforeEach(() => {
  mocks = MockFactory.newMocks(
    GmailProcessor.Lib.getEffectiveConfigV1(exampleMinConfigV1),
    RunMode.DANGEROUS,
  )
})

it("should provide the effective config of v1 example exampleMin", () => {
  const effectiveConfig =
    GmailProcessor.Lib.getEffectiveConfigV1(exampleMinConfigV1)
  expect(effectiveConfig).toBeInstanceOf(ProcessingConfig)
})

it("should process a v1 config example", () => {
  const result = GmailProcessor.Lib.runWithV1Config(
    exampleMinConfigV1,
    "dry-run",
    mocks.envContext,
  )
  expect(result.status).toEqual("ok")
})

it("should convert a v1 config example", () => {
  const config = convertV1ConfigToV2Config(exampleMinConfigV1)
  console.log(JSON.stringify(config, null, 2))
})
