import { Config } from "../../lib/config/Config"
import { PartialDeep } from "type-fest"
import { ProcessingConfig } from "../../lib/config/Config"
import { GMail2GDrive } from "../mocks/Examples"
import { MockFactory } from "../mocks/MockFactory"

const exampleMinConfigV2 = {}

it("should provide the effective config of v2 example exampleMin", () => {
  const effectiveConfig = GMail2GDrive.Lib.getEffectiveConfig(
    exampleMinConfigV2 as PartialDeep<Config>,
  )
  expect(effectiveConfig).toBeInstanceOf(ProcessingConfig)
})

it("should process a v2 config example", () => {
  const result = GMail2GDrive.Lib.run(
    exampleMinConfigV2 as PartialDeep<Config>,
    "dry-run",
    MockFactory.newEnvContextMock(),
  )
  expect(result.status).toEqual("ok")
})
