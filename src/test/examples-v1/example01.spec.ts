import { convertV1Config } from "../../lib"
import { V1Config } from "../../lib/config/v1/V1Config"
import { PartialDeep } from "type-fest"

const example01ConfigV1: PartialDeep<V1Config> = {
  globalFilter: "has:attachment -in:trash -in:drafts -in:spam",
  processedLabel: "gmail2gdrive/client-test",
  sleepTime: 100,
  maxRuntime: 280,
  newerThan: "1d",
  timezone: "GMT",
  rules: [
    {
      filter: "to:my.name+scans@gmail.com",
      folder: "'Scans'-yyyy-MM-dd",
    },
    {
      filter: "from:example1@example.com",
      folder: "'Examples/example1'",
    },
    {
      filter: "from:example2@example.com",
      folder: "'Examples/example2'",
      filenameFromRegexp: ".*.pdf$",
    },
    {
      filter: "(from:example3a@example.com OR from:example3b@example.com)",
      folder: "'Examples/example3ab'",
      filenameTo: "'file-'yyyy-MM-dd-'%s.txt'",
      archive: true,
    },
    {
      filter: "label:PDF",
      saveThreadPDF: true,
      folder: "'PDF Emails'",
    },
    {
      filter: "from:example4@example.com",
      folder: "'Examples/example4'",
      filenameFrom: "file.txt",
      filenameTo: "'file-'yyyy-MM-dd-'%s.txt'",
    },
  ],
}

it("should convert a v1 config example", () => {
  const config = convertV1Config(example01ConfigV1)
  console.log(JSON.stringify(config, null, 2))
})