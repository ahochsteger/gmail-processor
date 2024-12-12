import { ConflictStrategy } from "../../adapter/GDriveAdapter"
import { AttachmentActionConfig, ThreadActionConfig } from "../ActionConfig"
import { Config } from "../Config"
import { ThreadConfig } from "../ThreadConfig"
import {
  RequiredV1Config,
  V1Config,
  defaultV1Config,
  newV1Config,
} from "./V1Config"
import { V1ToV2Converter } from "./V1ToV2Converter"

it("should convert settings", () => {
  const v1config: V1Config = {
    maxRuntime: 234,
    newerThan: "2m",
    processedLabel: "gmail2gdrive/client-test",
    sleepTime: 123,
    timezone: "Europe/Vienna",
    rules: [
      {
        filter: "",
        folder: "",
      },
    ],
  }
  const expected: Config = {
    settings: {
      maxRuntime: 234,
      markProcessedLabel: "gmail2gdrive/client-test",
      sleepTimeThreads: 123,
      timezone: "Europe/Vienna",
    },
    threads: [{}],
  }
  const actual = V1ToV2Converter.v1ConfigToV2Config(v1config)
  expect(actual).toMatchObject(expected)
})

it("should create default global config", () => {
  const v1config: V1Config = {
    ...defaultV1Config,
    rules: [
      {
        filter: "",
        folder: "",
      },
    ],
  }
  const expected: Config = {
    global: {
      thread: {
        match: {
          query:
            "has:attachment -in:trash -in:drafts -in:spam newer_than:2m -label:to-gdrive/processed",
        },
      },
    },
    threads: [{}],
  }
  const actual = V1ToV2Converter.v1ConfigToV2Config(v1config)
  expect(actual).toMatchObject(expected)
})

it("should convert global config", () => {
  const v1config: V1Config = {
    ...defaultV1Config,
    globalFilter:
      "has:attachment -in:trash -in:drafts -in:spam -label:some-label",
    newerThan: "3d",
    rules: [
      {
        filter: "",
        folder: "",
      },
    ],
  }
  const expected: Config = {
    global: {
      thread: {
        match: {
          query:
            "has:attachment -in:trash -in:drafts -in:spam -label:some-label newer_than:3d -label:to-gdrive/processed",
        },
      },
    },
    threads: [{}],
  }
  const actual = V1ToV2Converter.v1ConfigToV2Config(v1config)
  expect(actual).toMatchObject(expected)
})

it("should convert rule with filter and folder", () => {
  const v1config: V1Config = {
    ...defaultV1Config,
    rules: [
      {
        filter: "from:example1@example.com",
        folder: "Examples/example1",
      },
    ],
  }
  const actual = V1ToV2Converter.v1ConfigToV2Config(v1config)
  const actualThread = actual.threads[0]
  expect(actualThread.match).toMatchObject({
    query: "from:example1@example.com",
  })
  expect(actualThread.messages[0].attachments[0].actions[0]).toMatchObject({
    args: {
      location: "/Examples/example1/{{attachment.name}}",
    },
    name: "attachment.store",
  })
})

it("should convert rule with filter and folder containing a date format", () => {
  const v1config: V1Config = {
    ...defaultV1Config,
    rules: [
      {
        filter: "to:my.name+scans@gmail.com",
        folder: "'Scans-'yyyy-MM-dd",
      },
    ],
  }
  const actual = V1ToV2Converter.v1ConfigToV2Config(v1config)
  const actualThread = actual.threads[0]
  expect(actualThread.match).toMatchObject({
    query: "to:my.name+scans@gmail.com",
  })
  expect(actualThread.messages[0].attachments[0].actions[0]).toMatchObject({
    args: {
      location:
        "/Scans-{{message.date|formatDate('yyyy-MM-dd')}}/{{attachment.name}}",
    },
    name: "attachment.store",
  })
})

it("should convert rule with filter, folder and filenameFromRegexp", () => {
  const v1config: RequiredV1Config = newV1Config({
    rules: [
      {
        filter: "from:example2@example.com",
        folder: "Examples/example2",
        filenameFromRegexp: "(.*\\.pdf)$",
      },
    ],
  })
  const expectedThreadConfig: ThreadConfig = {
    match: {
      query: "from:example2@example.com",
    },
  }
  const expectedAttachmentActionConfig = {
    args: {
      location: "/Examples/example2/{{attachment.name.match.1}}",
    },
    name: "attachment.store",
  }
  const expectedAttachmentConfig = {
    match: {
      name: "(.*\\.pdf)$",
    },
  }
  const actual = V1ToV2Converter.v1ConfigToV2Config(v1config)
  expect(actual.threads[0]).toMatchObject(expectedThreadConfig)
  expect(actual.threads[0].messages[0].attachments[0]).toMatchObject(
    expectedAttachmentConfig,
  )
  expect(actual.threads[0].messages[0].attachments[0].actions[0]).toMatchObject(
    expectedAttachmentActionConfig,
  )
})

it("should convert rule with filter, folder, filenameTo and archive", () => {
  const v1config: V1Config = newV1Config({
    ...defaultV1Config,
    rules: [
      {
        filter: "(from:example3a@example.com OR from:example3b@example.com)",
        folder: "Examples/example3ab",
        filenameTo: "'file-'yyyy-MM-dd'-%s.txt'",
        archive: true,
      },
    ],
  })

  const expectedAttachmentActionConfig: AttachmentActionConfig = {
    args: {
      location:
        "/Examples/example3ab/file-{{message.date|formatDate('yyyy-MM-dd')}}-{{message.subject}}.txt",
      conflictStrategy: ConflictStrategy.KEEP,
    },
    name: "attachment.store",
  }
  const expectedThreadActionConfig: ThreadActionConfig = {
    name: "thread.moveToArchive",
  }
  const expectedThreadConfig: ThreadConfig = {
    match: {
      query: "(from:example3a@example.com OR from:example3b@example.com)",
    },
  }
  const actual = V1ToV2Converter.v1ConfigToV2Config(v1config)
  expect(actual.threads[0]).toMatchObject(expectedThreadConfig)
  expect(actual.threads[0].actions[0]).toMatchObject(expectedThreadActionConfig)
  expect(actual.threads[0].messages[0].attachments[0].actions[0]).toMatchObject(
    expectedAttachmentActionConfig,
  )
})

it("should convert rule with filter, folder and parentFolderId", () => {
  const v1config: V1Config = {
    ...defaultV1Config,
    rules: [
      {
        // Store all attachments from example1@example.com to the SHARED Drive folder "Shared Drives/Lambda/Examples/example1"
        parentFolderId: "FOLDER_ID_FOR_Examples_FOLDER", // This approach is with the ID of "Examples"
        filter: "from:example1@example.com",
        folder: "example1", // Note: We omitted the folder path "Examples" since it's the direct parent
      },
    ],
  }
  const actual = V1ToV2Converter.v1ConfigToV2Config(v1config)
  expect(actual.threads[0].match.query).toEqual("from:example1@example.com")
  expect(actual.threads[0].messages[0].attachments[0].actions[0]).toMatchObject(
    {
      args: {
        location:
          "{id:FOLDER_ID_FOR_Examples_FOLDER}/example1/{{attachment.name}}",
      },
      name: "attachment.store",
    },
  )
})

it("should convert rule with filter, folder, filenameTo and archive", () => {
  const v1config: V1Config = {
    ...defaultV1Config,
    rules: [
      {
        // Store all attachments from example3a@example.com OR from:example3b@example.com
        // to the folder "Examples/example3ab" while renaming all attachments to the pattern
        // defined in 'filenameTo' and archive the thread.
        // filenameTo supports the following printf style substitutions:
        // %s - The subject of the message/thread
        // %o - The original filename of the attachment
        filter:
          "has:attachment (from:example3a@example.com OR from:example3b@example.com)",
        folder: "Examples/example3ab",
        filenameTo: "'file-'yyyy-MM-dd'-%s.txt'",
        archive: true,
      },
    ],
  }
  const actual = V1ToV2Converter.v1ConfigToV2Config(v1config)
  expect(actual.threads[0].match.query).toEqual(
    "has:attachment (from:example3a@example.com OR from:example3b@example.com)",
  )
  expect(actual.threads[0].messages[0].attachments[0].actions[0]).toMatchObject(
    {
      args: {
        location:
          "/Examples/example3ab/file-{{message.date|formatDate('yyyy-MM-dd')}}-{{message.subject}}.txt",
      },
      name: "attachment.store",
    },
  )
})

it("should convert rule with filter, saveThreadPDF and folder", () => {
  const v1config: V1Config = {
    ...defaultV1Config,
    rules: [
      {
        // Store threads marked with label "PDF" in the folder "PDF Emails" as PDF document.
        filter: "label:PDF",
        saveThreadPDF: true,
        folder: "PDF Emails",
      },
    ],
  }
  const actual = V1ToV2Converter.v1ConfigToV2Config(v1config)
  expect(actual.threads[0].match.query).toEqual("label:PDF")
  expect(actual.threads[0].actions[0]).toMatchObject({
    args: {
      location: "/PDF Emails/{{thread.firstMessageSubject}}.pdf",
    },
    name: "thread.storePDF",
  })
  expect(actual.threads[0].messages[0].attachments[0].actions[0]).toMatchObject(
    {
      args: {
        location: "/PDF Emails/{{attachment.name}}",
      },
      name: "attachment.store",
    },
  )
})

it("should convert rule with filter, saveMessagePDF, skipPDFHeader and folder", () => {
  const v1config: V1Config = {
    ...defaultV1Config,
    rules: [
      {
        // Store each INDIVIDUAL email as "PDF" instead of an entire thread, in the folder "PDF Emails"
        filter: "from:no_reply@email-invoice.example.com",
        saveMessagePDF: true,
        skipPDFHeader: true, // Skip Email Header
        folder: "PDF Emails",
      },
    ],
  }
  const actual = V1ToV2Converter.v1ConfigToV2Config(v1config)
  expect(actual.threads[0].match.query).toEqual(
    "from:no_reply@email-invoice.example.com",
  )
  expect(actual.threads[0].messages[0].actions[0]).toMatchObject({
    args: {
      location: "/PDF Emails/{{message.subject}}.pdf",
      skipHeader: true,
    },
    name: "message.storePDF",
  })
})

it("should convert rule with filter, saveMessagePDF, skipPDFHeader and folder", () => {
  const v1config: V1Config = {
    ...defaultV1Config,
    rules: [
      {
        // Store each INDIVIDUAL email as "PDF" instead of an entire thread, in the folder "PDF Emails"
        filter: "from:no_reply@email-invoice.example.com",
        saveMessagePDF: true,
        skipPDFHeader: true, // Skip Email Header
        folder: "PDF Emails",
      },
    ],
  }
  const actual = V1ToV2Converter.v1ConfigToV2Config(v1config)
  expect(actual.threads[0].match.query).toEqual(
    "from:no_reply@email-invoice.example.com",
  )
  expect(actual.threads[0].messages[0].actions[0]).toMatchObject({
    args: {
      location: "/PDF Emails/{{message.subject}}.pdf",
      skipHeader: true,
    },
    name: "message.storePDF",
  })
})

it("should convert rule with filter, saveThreadPDF, folder and filenameTo", () => {
  const v1config: V1Config = {
    ...defaultV1Config,
    rules: [
      {
        // Store threads marked with label "PDF" in the folder "PDF Emails" as PDF document.
        // while renaming the PDFs to the pattern defined in 'filenameTo'.
        // filenameTo supports the following printf style substitutions:
        // %s - The subject of the message/thread
        // NOTE: .pdf will automatically be added to the file name
        filter: "label:PDF",
        saveThreadPDF: true,
        folder: "'PDF Emails'",
        filenameTo: "'file-'yyyy-MM-dd'-%s'",
      },
    ],
  }
  const expected: Config = {
    threads: [
      {
        match: {
          query: "label:PDF",
        },
        actions: [
          {
            args: {
              location:
                "/PDF Emails/file-{{message.date|formatDate('yyyy-MM-dd')}}-{{message.subject}}",
              conflictStrategy: ConflictStrategy.KEEP,
            },
            name: "thread.storePDF",
          },
        ],
      },
    ],
  }
  const actual = V1ToV2Converter.v1ConfigToV2Config(v1config)
  expect(actual).toMatchObject(expected)
})

it("should convert rule with filter, folder filenameFrom and filenameTo", () => {
  const v1config: V1Config = {
    ...defaultV1Config,
    rules: [
      {
        // Store all attachments named "file.txt" from example4@example.com to the
        // folder "Examples/example4" and rename the attachment to the pattern
        // defined in 'filenameTo' and archive the thread.
        // filenameTo supports the following printf style substitutions:
        // %s - The subject of the message/thread
        // %o - The original filename of the attachment
        // %d - A running counter from 1 for each match of this rule.
        filter: "has:attachment from:example4@example.com",
        folder: "Examples/example4",
        filenameFrom: "file.txt",
        filenameTo: "'file-'yyyy-MM-dd'-%s.txt'",
      },
    ],
  }
  const actual = V1ToV2Converter.v1ConfigToV2Config(v1config)
  expect(actual.threads[0].match.query).toEqual(
    "has:attachment from:example4@example.com",
  )
  expect(actual.threads[0].messages[0].attachments[0]).toMatchObject({
    match: {
      name: "file\\.txt",
    },
  })
  expect(actual.threads[0].messages[0].attachments[0].actions[0]).toMatchObject(
    {
      args: {
        location:
          "/Examples/example4/file-{{message.date|formatDate('yyyy-MM-dd')}}-{{message.subject}}.txt",
      },
      name: "attachment.store",
    },
  )
})

it("should convert rule with filter, folder filenameFrom and filenameTo", () => {
  const v1config: V1Config = {
    ...defaultV1Config,
    rules: [
      {
        // Store all of the emails with the text "receipt" from billing@zoom.us
        // into the folder "Examples/example5" and rename the filenames to be zoom-1.pdf, zoom-2.pdf...
        filter: "receipt from:billing@zoom.us",
        folder: "Examples/example5",
        filenameFrom: "zoom.pdf",
        filenameTo: "'zoom-%d.pdf'",
      },
    ],
  }
  const actual = V1ToV2Converter.v1ConfigToV2Config(v1config)
  expect(actual.threads[0].match.query).toEqual("receipt from:billing@zoom.us")
  expect(actual.threads[0].messages[0].attachments[0]).toMatchObject({
    match: {
      name: "zoom\\.pdf",
    },
  })
  expect(actual.threads[0].messages[0].attachments[0].actions[0]).toMatchObject(
    {
      args: {
        location: "/Examples/example5/zoom-{{threadConfig.index}}.pdf",
      },
      name: "attachment.store",
    },
  )
})

it("should convert rule with filter, saveThreadPDF, ruleLabel and folder", () => {
  const v1config: V1Config = {
    ...defaultV1Config,
    rules: [
      {
        // Store threads marked with label "PDF" in the folder "PDF Emails" as PDF document and add "addPDFlabel" to the processed thread.
        filter: "label:PDF",
        saveThreadPDF: true,
        ruleLabel: "addPDFlabel",
        folder: "PDF Emails",
      },
    ],
  }
  const expected: Config = {
    threads: [
      {
        match: {
          query: "label:PDF",
        },
        actions: [
          {
            args: {
              location: "/PDF Emails/{{thread.firstMessageSubject}}.pdf",
              conflictStrategy: ConflictStrategy.KEEP,
            },
            name: "thread.storePDF",
          },
          {
            args: {
              name: "addPDFlabel",
            },
            name: "thread.addLabel",
          },
        ],
      },
    ],
  }
  const actual = V1ToV2Converter.v1ConfigToV2Config(v1config)
  expect(actual).toMatchObject(expected)
})
describe("V1 Format Conversion", () => {
  it("should support old date format", () => {
    expect(V1ToV2Converter.convertDateFormat("yyyy-MM-dd HH-mm-ss")).toBe(
      "yyyy-MM-dd HH-mm-ss",
    )
  })
  it("should fail on unsupported old date formats", () => {
    expect(() => V1ToV2Converter.convertDateFormat("F a")).toThrowError()
  })
  it("should support old filename pattern (type: 'string'format'string')", () => {
    expect(
      V1ToV2Converter.convertFromV1Pattern(
        "'file-'yyyy-MM-dd'-%s.txt'",
        "message.date",
      ),
    ).toBe(
      "file-{{message.date|formatDate('yyyy-MM-dd')}}-{{message.subject}}.txt",
    )
  })
  it("should support old filename pattern (type: 'string'format)", () => {
    expect(
      V1ToV2Converter.convertFromV1Pattern("'file-'yyyy-MM-dd", "message.date"),
    ).toBe("file-{{message.date|formatDate('yyyy-MM-dd')}}")
  })
  it("should support old filename pattern (type: format'string')", () => {
    expect(
      V1ToV2Converter.convertFromV1Pattern(
        "yyyy-MM-dd'-%s.txt'",
        "message.date",
      ),
    ).toBe("{{message.date|formatDate('yyyy-MM-dd')}}-{{message.subject}}.txt")
  })
  it("should support old filename pattern (type: format)", () => {
    expect(
      V1ToV2Converter.convertFromV1Pattern("yyyy-MM-dd", "message.date"),
    ).toBe("{{message.date|formatDate('yyyy-MM-dd')}}")
  })
  it("should support old filename pattern (type: 'string')", () => {
    expect(
      V1ToV2Converter.convertFromV1Pattern("'%s.txt'", "message.date"),
    ).toBe("{{message.subject}}.txt")
  })
  it("should support all old filename substitution parameters (type: '%s','%o','%filename','#SUBJECT#','#FILE#',yyyy-mm-dd)", () => {
    expect(
      V1ToV2Converter.sanitizeLocation(
        V1ToV2Converter.convertFromV1Pattern(
          "'%s,%o,%filename,#SUBJECT#,#FILE#,'yyyy-MM-dd",
          "message.date",
        ),
        true,
      ),
    ).toBe(
      "/{{message.subject}},{{attachment.name}},{{attachment.name}},{{message.subject}},{{attachment.name}},{{message.date|formatDate('yyyy-MM-dd')}}",
    )
  })
})
