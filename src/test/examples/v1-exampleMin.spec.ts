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
  const effectiveConfig =
    GMail2GDrive.Lib.getEffectiveConfigV1(exampleMinConfigV1)
  expect(effectiveConfig).toBeInstanceOf(ProcessingConfig)
})

it("should process a v1 config example", () => {
  const result = GMail2GDrive.Lib.run(
    exampleMinConfigV1,
    "dry-run",
    MockFactory.newEnvContextMock(),
  )
  expect(result.status).toEqual("ok")
})
