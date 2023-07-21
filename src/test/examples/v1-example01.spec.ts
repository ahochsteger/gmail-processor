import { convertV1ConfigToV2Config } from "../../lib"
import { V1Config } from "../../lib/config/v1/V1Config"
import { PartialDeep } from "type-fest"
import { RunMode } from "../../lib/Context"
import { ProcessingConfig } from "../../lib/config/Config"
import { GMail2GDrive } from "../mocks/Examples"
import { MockFactory, Mocks } from "../mocks/MockFactory"

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

let mocks: Mocks
beforeEach(() => {
  mocks = MockFactory.newMocks(
    GMail2GDrive.Lib.getEffectiveConfigV1(example01ConfigV1),
    RunMode.DANGEROUS,
  )
})

it("should provide the effective config of v1 example example01", () => {
  const effectiveConfig =
    GMail2GDrive.Lib.getEffectiveConfigV1(example01ConfigV1)
  expect(effectiveConfig).toBeInstanceOf(ProcessingConfig)
})

it("should process a v1 config example", () => {
  const result = GMail2GDrive.Lib.runWithV1Config(
    example01ConfigV1,
    "dry-run",
    mocks.envContext,
  )
  expect(result.status).toEqual("ok")
})

it("should convert a v1 config example", () => {
  const config = convertV1ConfigToV2Config(example01ConfigV1)
  console.log(JSON.stringify(config, null, 2))
})
