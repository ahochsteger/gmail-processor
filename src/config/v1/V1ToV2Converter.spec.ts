import { V1ToV2Converter } from "./V1ToV2Converter"
import { plainToClass } from "class-transformer"
import { V1Config } from "./V1Config"

it("should convert filenameTo patterns", () => {
  const actual = V1ToV2Converter.v1ConfigToV2Config(
    plainToClass(V1Config, {
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
    }),
  )
  const expected = {
    description: "",
    global: {
      match: {
        query: "has:attachment -in:trash -in:drafts -in:spam",
        maxMessageCount: -1,
        minMessageCount: 1,
        newerThan: "2m",
      },
      actions: [],
      type: "global",
    },
    handler: [
      {
        actions: [],
        description: "",
        handler: [
          {
            actions: [],
            description: "",
            handler: [
              {
                actions: [
                  {
                    args: {
                      folderType: "path",
                      folder: "Scans${message.date:dateformat:-YYYY-MM-DD}",
                      filename: "${attachment.name.match.1}",
                    },
                    description: "",
                    name: "file.storeToGDrive",
                  },
                ],
                description: "",
                match: {
                  contentType: ".*",
                  includeAttachments: true,
                  includeInlineImages: true,
                  largerThan: -1,
                  name: "(.*)",
                  smallerThan: -1,
                },
                name: "",
                type: "attachments",
              },
            ],
            match: {
              from: ".*",
              is: [],
              newerThan: "",
              olderThan: "",
              subject: ".*",
              to: ".*",
            },
            name: "",
            type: "messages",
          },
        ],
        match: {
          query: "",
          maxMessageCount: -1,
          minMessageCount: 1,
          newerThan: "",
        },
        name: "",
        type: "threads",
      },
      {
        actions: [],
        description: "",
        handler: [
          {
            actions: [],
            description: "",
            handler: [
              {
                actions: [
                  {
                    args: {
                      folderType: "path",
                      folder: "Examples/example1",
                      filename: "${attachment.name.match.1}",
                    },
                    description: "",
                    name: "file.storeToGDrive",
                  },
                ],
                description: "",
                match: {
                  contentType: ".*",
                  includeAttachments: true,
                  includeInlineImages: true,
                  largerThan: -1,
                  name: "(.*)",
                  smallerThan: -1,
                },
                name: "",
                type: "attachments",
              },
            ],
            match: {
              from: ".*",
              is: [],
              newerThan: "",
              olderThan: "",
              subject: ".*",
              to: ".*",
            },
            name: "",
            type: "messages",
          },
        ],
        match: {
          query: "",
          maxMessageCount: -1,
          minMessageCount: 1,
          newerThan: "",
        },
        name: "",
        type: "threads",
      },
      {
        actions: [],
        description: "",
        handler: [
          {
            actions: [],
            description: "",
            handler: [
              {
                actions: [
                  {
                    args: {
                      folderType: "path",
                      folder: "Examples/example2",
                      filename: "${attachment.name.match.1}",
                    },
                    description: "",
                    name: "file.storeToGDrive",
                  },
                ],
                description: "",
                match: {
                  contentType: ".*",
                  includeAttachments: true,
                  includeInlineImages: true,
                  largerThan: -1,
                  name: "(.*\\.pdf)$",
                  smallerThan: -1,
                },
                name: "",
                type: "attachments",
              },
            ],
            match: {
              from: ".*",
              is: [],
              newerThan: "",
              olderThan: "",
              subject: ".*",
              to: ".*",
            },
            name: "",
            type: "messages",
          },
        ],
        match: {
          query: "",
          maxMessageCount: -1,
          minMessageCount: 1,
          newerThan: "",
        },
        name: "",
        type: "threads",
      },
      {
        actions: [
          {
            args: {},
            description: "",
            name: "thread.archive",
          },
        ],
        description: "",
        handler: [
          {
            actions: [],
            description: "",
            handler: [
              {
                actions: [
                  {
                    args: {
                      folderType: "path",
                      folder: "Examples/example3ab",
                      filename: "'file-'yyyy-MM-dd-'%s.txt'",
                    },
                    description: "",
                    name: "file.storeToGDrive",
                  },
                ],
                description: "",
                match: {
                  contentType: ".*",
                  includeAttachments: true,
                  includeInlineImages: true,
                  largerThan: -1,
                  name: "(.*)",
                  smallerThan: -1,
                },
                name: "",
                type: "attachments",
              },
            ],
            match: {
              from: ".*",
              is: [],
              newerThan: "",
              olderThan: "",
              subject: ".*",
              to: ".*",
            },
            name: "",
            type: "messages",
          },
        ],
        match: {
          query: "",
          maxMessageCount: -1,
          minMessageCount: 1,
          newerThan: "",
        },
        name: "",
        type: "threads",
      },
    ],
    settings: {
      logSheetFile: "Gmail2GDrive/Gmail2GDrive-logs",
      logSheetFolderId: "",
      maxBatchSize: 10,
      maxRuntime: 280,
      processedLabel: "to-gdrive/processed",
      processedMode: "read",
      sleepTimeThreads: 100,
      sleepTimeMessages: 0,
      sleepTimeAttachments: 0,
      timezone: "GMT",
    },
  }

  expect(JSON.stringify(actual, null, 2)).toEqual(
    JSON.stringify(expected, null, 2),
  )

  // expect(actual).toEqual(
  //   expect.objectContaining({
  //     handler: expect.arrayContaining([
  //       expect.objectContaining({
  //         type: "threads",
  //         handler: expect.arrayContaining([
  //           expect.objectContaining({
  //             type: "messages",
  //             handler: expect.arrayContaining([
  //               expect.objectContaining({
  //                 type: "attachments",
  //                 actions: expect.arrayContaining([
  //                   expect.objectContaining({
  //                     name: "file.storeToGDrive"
  //                   })
  //                 ])
  //               })
  //             ])
  //           })
  //         ])
  //       })
  //     ])
  //   })
  // )
})
