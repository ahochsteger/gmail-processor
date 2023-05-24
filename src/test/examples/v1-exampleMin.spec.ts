import { V1Config } from "../../lib/config/v1/V1Config"
import { PartialDeep } from "type-fest"
import { ProcessingConfig } from "../../lib/config/Config"
import { GMail2GDrive } from "../mocks/Examples"
import { MockFactory } from "../mocks/MockFactory"

const exampleMinConfigV1 = {
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

it("should provide the effective config of v1 example exampleMin", () => {
  const effectiveConfig = GMail2GDrive.Lib.getEffectiveConfigV1(
    exampleMinConfigV1 as PartialDeep<V1Config>,
  )
  expect(effectiveConfig).toBeInstanceOf(ProcessingConfig)
})

it("should process a v1 config example", () => {
  const result = GMail2GDrive.Lib.runWithV1Config(
    exampleMinConfigV1 as PartialDeep<V1Config>,
    "dry-run",
    MockFactory.newEnvContextMock(),
  )
  expect(result.status).toEqual("ok")
})
