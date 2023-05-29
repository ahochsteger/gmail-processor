import { PartialDeep } from "type-fest"
import { Config } from "../Config"
import { V1Config, newV1Config } from "./V1Config"
import { V1ToV2Converter } from "./V1ToV2Converter"

it("should convert settings", () => {
  const v1config: PartialDeep<V1Config> = {
    maxRuntime: 234,
    processedLabel: "gmail2gdrive/client-test",
    sleepTime: 123,
    timezone: "Europe/Vienna",
  }
  const expected: PartialDeep<Config> = {
    settings: {
      maxRuntime: 234,
      markProcessedLabel: "gmail2gdrive/client-test",
      sleepTimeThreads: 123,
      timezone: "Europe/Vienna",
    },
  }
  const actual = V1ToV2Converter.v1ConfigToV2Config(v1config)
  expect(actual).toMatchObject(expected)
})

it("should create default gobal config", () => {
  const v1config: PartialDeep<V1Config> = {}
  const expected: PartialDeep<Config> = {
    global: {
      thread: {
        match: {
          query: "has:attachment -in:trash -in:drafts -in:spam",
          newerThan: "2m",
        },
      },
    },
  }
  const actual = V1ToV2Converter.v1ConfigToV2Config(v1config)
  expect(actual).toMatchObject(expected)
})

it("should convert global config", () => {
  const v1config: PartialDeep<V1Config> = {
    globalFilter:
      "has:attachment -in:trash -in:drafts -in:spam -label:some-label",
    newerThan: "3d",
  }
  const expected: PartialDeep<Config> = {
    global: {
      thread: {
        match: {
          query:
            "has:attachment -in:trash -in:drafts -in:spam -label:some-label",
          newerThan: "3d",
        },
      },
    },
  }
  const actual = V1ToV2Converter.v1ConfigToV2Config(v1config)
  expect(actual).toMatchObject(expected)
})

it("should convert rule with filter and folder", () => {
  const v1config: PartialDeep<V1Config> = {
    rules: [
      {
        filter: "from:example1@example.com",
        folder: "'Examples/example1'",
      },
    ],
  }
  const expected: PartialDeep<Config> = {
    threads: [
      {
        match: {
          query: "from:example1@example.com",
        },
        attachments: [
          {
            actions: [
              {
                args: {
                  location: "Examples/example1/${attachment.name}",
                },
                name: "attachment.storeToGDrive",
              },
            ],
          },
        ],
      },
    ],
  }
  const actual = V1ToV2Converter.v1ConfigToV2Config(v1config)
  expect(actual).toMatchObject(expected)
})

it("should convert rule with filter and folder containing a date format", () => {
  const v1config: PartialDeep<V1Config> = {
    rules: [
      {
        filter: "to:my.name+scans@gmail.com",
        folder: "'Scans-'yyyy-MM-dd",
      },
    ],
  }
  const expected: PartialDeep<Config> = {
    threads: [
      {
        match: {
          query: "to:my.name+scans@gmail.com",
        },
        attachments: [
          {
            actions: [
              {
                args: {
                  location:
                    "Scans-${message.date:dateformat:YYYY-MM-DD}/${attachment.name}",
                },
                name: "attachment.storeToGDrive",
              },
            ],
          },
        ],
      },
    ],
  }
  const actual = V1ToV2Converter.v1ConfigToV2Config(v1config)
  expect(actual).toMatchObject(expected)
})

it("should convert rule with filter, folder and filenameFromRegexp", () => {
  const v1config: PartialDeep<V1Config> = newV1Config({
    rules: [
      {
        filter: "from:example2@example.com",
        folder: "'Examples/example2'",
        filenameFromRegexp: "(.*\\.pdf)$",
      },
    ],
  })
  const expected: PartialDeep<Config> = {
    threads: [
      {
        match: {
          query: "from:example2@example.com",
        },
        attachments: [
          {
            actions: [
              {
                args: {
                  location: "Examples/example2/${attachment.name.match.1}",
                },
                name: "attachment.storeToGDrive",
              },
            ],
            match: {
              name: "(.*\\.pdf)$",
            },
          },
        ],
      },
    ],
  }
  const actual = V1ToV2Converter.v1ConfigToV2Config(v1config)
  expect(actual).toMatchObject(expected)
})

it("should convert rule with filter, folder, filenameTo and archive", () => {
  const v1config: PartialDeep<V1Config> = newV1Config({
    rules: [
      {
        filter: "(from:example3a@example.com OR from:example3b@example.com)",
        folder: "'Examples/example3ab'",
        filenameTo: "'file-'yyyy-MM-dd-'%s.txt'",
        archive: true,
      },
    ],
  })
  const expected: PartialDeep<Config> = {
    threads: [
      {
        match: {
          query: "(from:example3a@example.com OR from:example3b@example.com)",
        },
        attachments: [
          {
            actions: [
              {
                args: {
                  location:
                    "Examples/example3ab/file-${message.date:dateformat:YYYY-MM-DD-}${message.subject}.txt",
                },
                name: "attachment.storeToGDrive",
              },
            ],
          },
        ],
        actions: [
          {
            name: "thread.moveToArchive",
          },
        ],
      },
    ],
  }
  const actual = V1ToV2Converter.v1ConfigToV2Config(v1config)
  expect(actual).toMatchObject(expected)
})

it("should convert rule with filter, folder and parentFolderId", () => {
  const v1config: PartialDeep<V1Config> = {
    rules: [
      {
        // Store all attachments from example1@example.com to the SHARED Drive folder "Shared Drives/Lambda/Examples/example1"
        parentFolderId: "FOLDER_ID_FOR_Examples_FOLDER", // This approach is with the ID of "Examples"
        filter: "from:example1@example.com",
        folder: "'example1'", // Note: We omited the folder path "Examples" since it's the direct parent
      },
    ],
  }
  const expected: PartialDeep<Config> = {
    threads: [
      {
        match: {
          query: "from:example1@example.com",
        },
        attachments: [
          {
            actions: [
              {
                args: {
                  location:
                    "${folderId:FOLDER_ID_FOR_Examples_FOLDER}/example1/${attachment.name}",
                },
                name: "attachment.storeToGDrive",
              },
            ],
          },
        ],
      },
    ],
  }
  const actual = V1ToV2Converter.v1ConfigToV2Config(v1config)
  expect(actual).toMatchObject(expected)
})

it("should convert rule with filter, folder, filenameTo and archive", () => {
  const v1config: PartialDeep<V1Config> = {
    rules: [
      {
        // Store all attachments from example3a@example.com OR from:example3b@example.com
        // to the folder "Examples/example3ab" while renaming all attachments to the pattern
        // defined in 'filenameTo' and archive the thread.
        // filenameTo supports the following printf style substitutions:
        // %s - The subject of the message/thread
        // %o - The original filename of the attachement
        filter:
          "has:attachment (from:example3a@example.com OR from:example3b@example.com)",
        folder: "'Examples/example3ab'",
        filenameTo: "'file-'yyyy-MM-dd-'%s.txt'",
        archive: true,
      },
    ],
  }
  const expected: PartialDeep<Config> = {
    threads: [
      {
        match: {
          query:
            "has:attachment (from:example3a@example.com OR from:example3b@example.com)",
        },
        attachments: [
          {
            actions: [
              {
                args: {
                  location:
                    "Examples/example3ab/file-${message.date:dateformat:YYYY-MM-DD-}${message.subject}.txt",
                },
                name: "attachment.storeToGDrive",
              },
            ],
          },
        ],
      },
    ],
  }
  const actual = V1ToV2Converter.v1ConfigToV2Config(v1config)
  expect(actual).toMatchObject(expected)
})

it("should convert rule with filter, saveThreadPDF and folder", () => {
  const v1config: PartialDeep<V1Config> = {
    rules: [
      {
        // Store threads marked with label "PDF" in the folder "PDF Emails" as PDF document.
        filter: "label:PDF",
        saveThreadPDF: true,
        folder: "'PDF Emails'",
      },
    ],
  }
  const expected: PartialDeep<Config> = {
    threads: [
      {
        match: {
          query: "label:PDF",
        },
        actions: [
          {
            args: {
              location: "PDF Emails/${thread.firstMessageSubject}.pdf",
            },
            name: "thread.storeAsPdfToGDrive",
          },
        ],
        attachments: [
          {
            actions: [
              {
                args: {
                  location: "PDF Emails/${attachment.name}",
                },
                name: "attachment.storeToGDrive",
              },
            ],
          },
        ],
      },
    ],
  }
  const actual = V1ToV2Converter.v1ConfigToV2Config(v1config)
  expect(actual).toMatchObject(expected)
})

it("should convert rule with filter, saveMessagePDF, skipPDFHeader and folder", () => {
  const v1config: PartialDeep<V1Config> = {
    rules: [
      {
        // Store each INDIVIDUAL email as "PDF" instead of an entire thread, in the folder "PDF Emails"
        filter: "from:no_reply@email-invoice.example.com",
        saveMessagePDF: true,
        skipPDFHeader: true, // Skip Email Header
        folder: "'PDF Emails'",
      },
    ],
  }
  const expected: PartialDeep<Config> = {
    threads: [
      {
        match: {
          query: "from:no_reply@email-invoice.example.com",
        },
        messages: [
          {
            actions: [
              {
                args: {
                  location: "PDF Emails/${message.subject}.pdf",
                  skipHeader: true,
                },
                name: "message.storeAsPdfToGDrive",
              },
            ],
          },
        ],
      },
    ],
  }
  const actual = V1ToV2Converter.v1ConfigToV2Config(v1config)
  expect(actual).toMatchObject(expected)
})

it("should convert rule with filter, saveMessagePDF, skipPDFHeader and folder", () => {
  const v1config: PartialDeep<V1Config> = {
    rules: [
      {
        // Store each INDIVIDUAL email as "PDF" instead of an entire thread, in the folder "PDF Emails"
        filter: "from:no_reply@email-invoice.example.com",
        saveMessagePDF: true,
        skipPDFHeader: true, // Skip Email Header
        folder: "'PDF Emails'",
      },
    ],
  }
  const expected: PartialDeep<Config> = {
    threads: [
      {
        match: {
          query: "from:no_reply@email-invoice.example.com",
        },
        messages: [
          {
            actions: [
              {
                args: {
                  location: "PDF Emails/${message.subject}.pdf",
                  skipHeader: true,
                },
                name: "message.storeAsPdfToGDrive",
              },
            ],
          },
        ],
      },
    ],
  }
  const actual = V1ToV2Converter.v1ConfigToV2Config(v1config)
  expect(actual).toMatchObject(expected)
})

it("should convert rule with filter, saveThreadPDF, folder and filenameTo", () => {
  const v1config: PartialDeep<V1Config> = {
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
        filenameTo: "'file-'yyyy-MM-dd-'%s'",
      },
    ],
  }
  const expected: PartialDeep<Config> = {
    threads: [
      {
        match: {
          query: "label:PDF",
        },
        actions: [
          {
            args: {
              location:
                "PDF Emails/file-${message.date:dateformat:YYYY-MM-DD-}${message.subject}",
            },
            name: "thread.storeAsPdfToGDrive",
          },
        ],
      },
    ],
  }
  const actual = V1ToV2Converter.v1ConfigToV2Config(v1config)
  expect(actual).toMatchObject(expected)
})

it("should convert rule with filter, folder filenameFrom and filenameTo", () => {
  const v1config: PartialDeep<V1Config> = {
    rules: [
      {
        // Store all attachments named "file.txt" from example4@example.com to the
        // folder "Examples/example4" and rename the attachment to the pattern
        // defined in 'filenameTo' and archive the thread.
        // filenameTo supports the following printf style substitutions:
        // %s - The subject of the message/thread
        // %o - The original filename of the attachement
        // %d - A running counter from 1 for each match of this rule.
        filter: "has:attachment from:example4@example.com",
        folder: "'Examples/example4'",
        filenameFrom: "file.txt",
        filenameTo: "'file-'yyyy-MM-dd-'%s.txt'",
      },
    ],
  }
  const expected: PartialDeep<Config> = {
    threads: [
      {
        match: {
          query: "has:attachment from:example4@example.com",
        },
        attachments: [
          {
            match: {
              name: "file\\.txt",
            },
            actions: [
              {
                args: {
                  location:
                    "Examples/example4/file-${message.date:dateformat:YYYY-MM-DD-}${message.subject}.txt",
                },
                name: "attachment.storeToGDrive",
              },
            ],
          },
        ],
      },
    ],
  }
  const actual = V1ToV2Converter.v1ConfigToV2Config(v1config)
  expect(actual).toMatchObject(expected)
})

it("should convert rule with filter, folder filenameFrom and filenameTo", () => {
  const v1config: PartialDeep<V1Config> = {
    rules: [
      {
        // Store all of the emails with the text "receipt" from billing@zoom.us
        // into the folder "Examples/example5" and rename the filenames to be zoom-1.pdf, zoom-2.pdf...
        filter: "receipt from:billing@zoom.us",
        folder: "'Examples/example5'",
        filenameFrom: "zoom.pdf",
        filenameTo: "'zoom-%d.pdf'",
      },
    ],
  }
  const expected: PartialDeep<Config> = {
    threads: [
      {
        match: {
          query: "receipt from:billing@zoom.us",
        },
        attachments: [
          {
            match: {
              name: "zoom\\.pdf",
            },
            actions: [
              {
                args: {
                  location: "Examples/example5/zoom-${threadConfig.index}.pdf",
                },
                name: "attachment.storeToGDrive",
              },
            ],
          },
        ],
      },
    ],
  }
  const actual = V1ToV2Converter.v1ConfigToV2Config(v1config)
  expect(actual).toMatchObject(expected)
})

it("should convert rule with filter, saveThreadPDF, ruleLabel and folder", () => {
  const v1config: PartialDeep<V1Config> = {
    rules: [
      {
        // Store threads marked with label "PDF" in the folder "PDF Emails" as PDF document and add "addPDFlabel" to the processed thread.
        filter: "label:PDF",
        saveThreadPDF: true,
        ruleLabel: "addPDFlabel",
        folder: "'PDF Emails'",
      },
    ],
  }
  const expected: PartialDeep<Config> = {
    threads: [
      {
        match: {
          query: "label:PDF",
        },
        actions: [
          {
            args: {
              location: "PDF Emails/${thread.firstMessageSubject}.pdf",
            },
            name: "thread.storeAsPdfToGDrive",
          },
          {
            args: {
              label: "addPDFlabel",
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
