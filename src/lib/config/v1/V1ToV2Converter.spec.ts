import { jsonToV1Config, newV1Config } from "./V1Config"
import { V1ToV2Converter } from "./V1ToV2Converter"

it("should convert settings", () => {
  const v1config = newV1Config({
    maxRuntime: 234,
    processedLabel: "gmail2gdrive/client-test",
    sleepTime: 123,
    timezone: "Europe/Vienna",
  })
  const actual = V1ToV2Converter.v1ConfigToV2Config(v1config)
  const expected = {
    settings: {
      maxRuntime: 234,
      processedLabel: "gmail2gdrive/client-test",
      sleepTimeThreads: 123,
      timezone: "Europe/Vienna",
    },
  }
  expect(actual).toMatchObject(expected)
})

it("should convert global config", () => {
  const v1config = newV1Config({
    newerThan: "3d",
  })
  const actual = V1ToV2Converter.v1ConfigToV2Config(v1config)
  const expected = {
    global: {
      match: {
        newerThan: "3d",
      },
    },
  }
  expect(actual).toMatchObject(expected)
})

it("should convert filenameTo patterns", () => {
  const v1config = jsonToV1Config({
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
        filenameFromRegexp: "(.*\\.pdf)$",
      },
      {
        filter: "(from:example3a@example.com OR from:example3b@example.com)",
        folder: "'Examples/example3ab'",
        filenameTo: "'file-'yyyy-MM-dd-'%s.txt'",
        archive: true,
      },
    ],
  })
  const actual = V1ToV2Converter.v1ConfigToV2Config(v1config)
  const expected = {
    global: {
      match: {
        query: "has:attachment -in:trash -in:drafts -in:spam",
        newerThan: "2m",
      },
    },
    threads: [
      {
        attachments: [
          {
            actions: [
              {
                args: {
                  folderType: "path",
                  folder: "Scans${message.date:dateformat:-YYYY-MM-DD}",
                  filename: "${attachment.name.match.1}",
                },
                name: "file.storeToGDrive",
              },
            ],
          },
        ],
      },
      {
        attachments: [
          {
            actions: [
              {
                args: {
                  folderType: "path",
                  folder: "Examples/example1",
                  filename: "${attachment.name.match.1}",
                },
                name: "file.storeToGDrive",
              },
            ],
          },
        ],
      },
      {
        attachments: [
          {
            actions: [
              {
                args: {
                  folderType: "path",
                  folder: "Examples/example2",
                  filename: "${attachment.name.match.1}",
                },
                name: "file.storeToGDrive",
              },
            ],
            match: {
              name: "(.*\\.pdf)$",
            },
          },
        ],
      },
      {
        actions: [
          {
            name: "thread.archive",
          },
        ],
        attachments: [
          {
            actions: [
              {
                args: {
                  folderType: "path",
                  folder: "Examples/example3ab",
                  filename: "'file-'yyyy-MM-dd-'%s.txt'",
                },
                name: "file.storeToGDrive",
              },
            ],
          },
        ],
      },
    ],
  }
  expect(actual).toMatchObject(expected)
})
