import { ProcessingConfig } from "../../lib/config/Config"
import { GMail2GDrive } from "../mocks/Examples"
import { MockFactory } from "../mocks/MockFactory"

const example01ConfigV1 = {
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
      folder: "PDF Emails",
    },
    {
      filter: "from:example4@example.com",
      folder: "'Examples/example4'",
      filenameFrom: "file.txt",
      filenameTo: "'file-'yyyy-MM-dd-'%s.txt'",
    },
  ],
}

it("should provide the effective config of v1 example example01", () => {
  const effectiveConfig =
    GMail2GDrive.Lib.getEffectiveConfigV1(example01ConfigV1)
  expect(effectiveConfig).toBeInstanceOf(ProcessingConfig)
})

it("should process a v1 config example", () => {
  const result = GMail2GDrive.Lib.run(
    example01ConfigV1,
    "dry-run",
    MockFactory.newEnvContextMock(),
  )
  expect(result.status).toEqual("ok")
})
