import { RunMode } from "../../lib/Context"
import { GMail2GDrive } from "../mocks/Examples"
import { MockFactory } from "../mocks/MockFactory"

const config = {
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

it("should process a v1 config example", () => {
  GMail2GDrive.Lib.runWithV1Config(
    config,
    RunMode.DRY_RUN,
    MockFactory.newEnvContextMock(),
  )
})

it("should process a v1 config example", () => {
  const actualConfig = GMail2GDrive.Lib.getEffectiveConfigV1(config)
  expect(actualConfig.settings.processedLabel).toEqual(config.processedLabel)
})
