import { convertV1Config } from "../../lib"
import { V1Config } from "../../lib/config/v1/V1Config"
import { PartialDeep } from "type-fest"

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

it("should convert a v1 config example", () => {
  const config = convertV1Config(exampleMinConfigV1)
  console.log(JSON.stringify(config, null, 2))
})
