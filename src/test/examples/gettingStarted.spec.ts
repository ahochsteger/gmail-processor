import { PartialDeep } from "type-fest"
import { RunMode } from "../../lib/Context"
import { Config, ProcessingConfig } from "../../lib/config/Config"
import { GmailProcessor } from "../mocks/Examples"
import { MockFactory, Mocks } from "../mocks/MockFactory"

const gettingStartedConfigV2: PartialDeep<Config> = {
  settings: {
    // Place settings here
  },
  global: {
    // Place global thread, message or attachment configuration here
  },
  threads: [
    // Place thread processing config here
    {
      match: {
        query: "from:some.email@gmail.com",
      },
      attachments: [
        {
          match: {
            name: "^my-file-.+.pdf$",
          },
          actions: [
            {
              name: "thread.storePDF",
              args: {
                folder:
                  "folder/${message.date:format:yyyy-MM-dd}/${attachment.name}",
              },
            },
          ],
        },
      ],
    },
  ],
}

let mocks: Mocks
beforeEach(() => {
  mocks = MockFactory.newMocks(
    GmailProcessor.Lib.getEffectiveConfig(gettingStartedConfigV2),
    RunMode.DANGEROUS,
  )
})

it("should provide the effective config of v2 example gettingStarted", () => {
  const effectiveConfig = GmailProcessor.Lib.getEffectiveConfig(
    gettingStartedConfigV2,
  )
  expect(effectiveConfig).toBeInstanceOf(ProcessingConfig)
})

it("should process a v2 config example", () => {
  const result = GmailProcessor.Lib.run(
    gettingStartedConfigV2,
    "dry-run",
    mocks.envContext,
  )
  expect(result.status).toEqual("ok")
})
