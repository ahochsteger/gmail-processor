import { PartialDeep } from "type-fest"
import { RunMode } from "../../lib/Context"
import { Config } from "../../lib/config/Config"
import { GmailProcessorLib } from "../mocks/Examples"
import { MockFactory, Mocks } from "../mocks/MockFactory"

const exampleMinConfigV2: PartialDeep<Config> = {
  threads: [{}],
}

let mocks: Mocks
beforeEach(() => {
  mocks = MockFactory.newMocks(exampleMinConfigV2, RunMode.DANGEROUS)
})

it("should process a v2 config example", () => {
  const result = GmailProcessorLib.run(
    exampleMinConfigV2,
    "dry-run",
    mocks.envContext,
  )
  expect(result.status).toEqual("ok")
})
