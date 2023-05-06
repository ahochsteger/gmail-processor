import { RunMode } from "../../src/Context"
import { Config } from "../../src/config/Config"
import { GmailProcessor } from "../../src/processors/GmailProcessor"
import { MockFactory, Mocks } from "../mocks/MockFactory"

let mocks: Mocks
let gmailProcessor: GmailProcessor

beforeEach(() => {
  mocks = MockFactory.newMocks(new Config(), RunMode.SAFE_MODE)
  gmailProcessor = new GmailProcessor()
})

describe("v1config", () => {
  it("should process v1 config", () => {
    const configJson = {
      globalFilter: "has:attachment -in:trash -in:drafts -in:spam",
      processedLabel: "gmail2gdrive/client-test",
      sleepTime: 100,
      maxRuntime: 280,
      newerThan: "1d",
      timezone: "UTC",
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
    gmailProcessor.runWithV1ConfigJson(
      mocks.envContext,
      configJson,
      RunMode.DRY_RUN,
    )
  })
})