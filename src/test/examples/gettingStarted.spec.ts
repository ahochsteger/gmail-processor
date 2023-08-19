import { PartialDeep } from "type-fest"
import { RunMode } from "../../lib/Context"
import { Config } from "../../lib/config/Config"
import { GmailProcessorLib } from "../mocks/Examples"
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
  mocks = MockFactory.newMocks(gettingStartedConfigV2, RunMode.DANGEROUS)
})

it("should process a v2 config example", () => {
  const result = GmailProcessorLib.run(
    gettingStartedConfigV2,
    "dry-run",
    mocks.envContext,
  )
  expect(result.status).toEqual("ok")
})
