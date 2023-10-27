import { ConflictStrategy } from "../../lib/adapter/GDriveAdapter"
import { ThreadContextActionConfigType } from "../../lib/config/ActionConfig"
import { AttachmentConfig } from "../../lib/config/AttachmentConfig"
import { Config, RequiredConfig, newConfig } from "../../lib/config/Config"
import { GlobalConfig } from "../../lib/config/GlobalConfig"
import { MessageConfig } from "../../lib/config/MessageConfig"
import { MessageFlag } from "../../lib/config/MessageFlag"
import {
  MarkProcessedMethod,
  SettingsConfig,
} from "../../lib/config/SettingsConfig"
import { ThreadConfig } from "../../lib/config/ThreadConfig"
import { V1Config } from "../../lib/config/v1/V1Config"
import {
  E2E_BASE_FOLDER_NAME,
  EXISTING_FILE_NAME,
  EXISTING_FOLDER_NAME,
  LOGSHEET_FILE_PATH,
} from "./GDriveMocks"

export class ConfigMocks {
  public static newDefaultSettingsConfigJson(): SettingsConfig {
    return {
      logSheetLocation: LOGSHEET_FILE_PATH,
      markProcessedMethod: MarkProcessedMethod.MARK_MESSAGE_READ,
      maxBatchSize: 100,
      maxRuntime: 280,
      sleepTimeAttachments: 1,
      sleepTimeMessages: 10,
      sleepTimeThreads: 100,
      timezone: "UTC",
    }
  }

  public static newDefaultThreadActionConfigJson(): ThreadContextActionConfigType {
    return {
      args: {
        location: `/${E2E_BASE_FOLDER_NAME}/example-\${message.subject}.pdf`,
        conflictStrategy: ConflictStrategy.REPLACE,
      },
      name: "thread.storePDF",
      description: "Default action config",
    }
  }

  public static newDefaultAttachmentConfigJson(): AttachmentConfig {
    return {
      name: "default-attachment-config",
      description: "Default attachment config",
      match: {
        name: "Image-([0-9]+)\\.jpg",
        contentType: "image/.+",
        includeAttachments: true,
        includeInlineImages: true,
        largerThan: -1,
        smallerThan: -1,
      },
    }
  }

  public static newDefaultMessageConfigJson(): MessageConfig {
    return {
      name: "default-message-config",
      description: "Default message config",
      match: {
        from: "(.+)@example.com",
        subject: "Prefix - (.*) - Suffix(.*)",
        to: "my\\.address\\+(.+)@gmail.com",
        is: [MessageFlag.UNREAD],
        newerThan: "",
        olderThan: "",
      },
    }
  }

  public static newDefaultThreadConfigJson(
    includeActions = false,
    includeMessages = false,
  ): ThreadConfig {
    return {
      name: "default-thread-config",
      description: "A sample thread config",
      actions: includeActions ? [this.newDefaultThreadActionConfigJson()] : [],
      messages: includeMessages
        ? [
            {
              ...this.newDefaultMessageConfigJson(),
              attachments: [this.newDefaultAttachmentConfigJson()],
            },
          ]
        : [],
      match: {
        query: "has:attachment from:example@example.com",
        maxMessageCount: -1,
        minMessageCount: -1,
      },
      attachments: [],
    }
  }

  public static newDefaultGlobalConfigJson(): GlobalConfig {
    return {
      variables: [
        {
          key: "customVar",
          value: "Custom value",
        },
      ],
    }
  }

  public static newComplexThreadConfigList(): ThreadConfig[] {
    return [
      {
        match: {
          query: "has:attachment from:example4@example.com",
        },
        messages: [
          {
            match: {
              body: "(?<url>https://raw\\.githubusercontent\\.com/ahochsteger/gmail-processor/main/src/e2e-test/files/(?<filename>[0-9A-Za-z_-]+\\.txt))",
              from: "(.+)@example.com",
              subject: "Message (?<myMatchGroup>.*)",
              to: "message-to@example\\.com",
              is: [MessageFlag.UNREAD],
            },
            actions: [{ name: "message.star" }],
            attachments: [
              {
                match: {
                  contentType: "application/(?<appType>.*)",
                  name: "attachment(?<attNr>[0-9]+)\\.pdf",
                },
                actions: [
                  {
                    name: "attachment.store",
                    args: {
                      location:
                        EXISTING_FOLDER_NAME +
                        "/${message.subject.match.1}/example-${attachment.name.match.attNr}.pdf",
                      conflictStrategy: ConflictStrategy.REPLACE,
                    },
                  },
                ],
              },
              {
                match: { name: "Image-([0-9]+)\\.jpg" },
                actions: [
                  {
                    name: "attachment.store",
                    args: {
                      location:
                        "Folder3/Subfolder3/${att.basename}-${date:yyyy-MM-dd}.${att.ext}",
                      conflictStrategy: ConflictStrategy.SKIP,
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        description:
          "Example that stores all attachments of matching messages to a certain GDrive folder",
        match: {
          query: "has:attachment from:example@example.com",
        },
        messages: [
          {
            actions: [
              {
                name: "message.storePDF",
                args: {
                  location: `/${EXISTING_FOLDER_NAME}/${EXISTING_FILE_NAME}`,
                  conflictStrategy: ConflictStrategy.REPLACE,
                },
              },
            ],
            match: {
              from: "(.+)@example.com",
              subject: "Prefix - (?<prefix>.*) - Suffix(?<suffix>.*)",
              to: "my\\.address\\+(.+)@gmail.com",
            },
          },
        ],
      },
      {
        actions: [
          {
            name: "thread.storePDF",
            args: {
              location: `/${EXISTING_FOLDER_NAME}/${EXISTING_FILE_NAME}`,
              conflictStrategy: ConflictStrategy.REPLACE,
            },
          },
        ],
        description:
          "Example that stores all attachments of all found threads to a certain GDrive folder",
        match: {
          query: "has:attachment from:example@example.com",
        },
      },
    ]
  }

  public static newComplexConfigJson(): Config {
    return {
      settings: this.newDefaultSettingsConfigJson(),
      threads: this.newComplexThreadConfigList(),
      global: this.newDefaultGlobalConfigJson(),
    }
  }

  public static newDefaultConfigJson(): Config {
    return {
      settings: this.newDefaultSettingsConfigJson(),
      threads: [this.newDefaultThreadConfigJson(true, true)],
      global: this.newDefaultGlobalConfigJson(),
    }
  }

  public static newDefaultV1ConfigJson(): V1Config {
    return {
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
  }

  public static newDefaultConfig(
    configJson: Config = this.newDefaultConfigJson(),
  ): RequiredConfig {
    return newConfig(configJson)
  }
}
