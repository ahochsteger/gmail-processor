import { PartialDeep } from "type-fest"
import { ThreadActionConfig } from "../../lib/config/ActionConfig"
import { AttachmentConfig } from "../../lib/config/AttachmentConfig"
import { Config, RequiredConfig, newConfig } from "../../lib/config/Config"
import { GlobalConfig } from "../../lib/config/GlobalConfig"
import { MessageConfig } from "../../lib/config/MessageConfig"
import { MessageFlag } from "../../lib/config/MessageFlag"
import { SettingsConfig } from "../../lib/config/SettingsConfig"
import { ThreadConfig } from "../../lib/config/ThreadConfig"
import { V1Config } from "../../lib/config/v1/V1Config"

export class ConfigMocks {
  public static newDefaultSettingsConfigJson(): PartialDeep<SettingsConfig> {
    return {
      maxBatchSize: 100,
      maxRuntime: 280,
      markProcessedLabel: "to-gdrive/processed",
      sleepTimeThreads: 100,
      sleepTimeMessages: 10,
      sleepTimeAttachments: 1,
      timezone: "UTC",
    }
  }

  public static newDefaultThreadActionConfigJson(): PartialDeep<ThreadActionConfig> {
    return {
      args: {
        folderType: "path",
        folder: "Folder2/Subfolder2/${message.subject.match.1}",
        filename: "${message.subject} - ${match.file.1}.jpg",
        onExists: "replace",
      },
      name: "thread.storePDF",
      description: "Default action config",
    }
  }

  public static newDefaultAttachmentConfigJson(): PartialDeep<AttachmentConfig> {
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

  public static newDefaultMessageConfigJson(): PartialDeep<MessageConfig> {
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
    includeCommands = false,
    includeMessages = false,
  ): PartialDeep<ThreadConfig> {
    return {
      name: "default-thread-config",
      description: "A sample thread config",
      actions: includeCommands
        ? [this.newDefaultThreadActionConfigJson() as ThreadActionConfig]
        : [],
      messages: includeMessages ? [this.newDefaultMessageConfigJson()] : [],
      match: {
        query: "has:attachment from:example@example.com",
        maxMessageCount: -1,
        minMessageCount: -1,
      },
      attachments: [],
    }
  }

  public static newDefaultGlobalConfigJson(): PartialDeep<GlobalConfig> {
    return {
      variables: [
        {
          key: "customVar",
          value: "Custom value",
        },
      ],
    }
  }

  public static newComplexThreadConfigList(): PartialDeep<ThreadConfig>[] {
    return [
      {
        match: {
          query: "has:attachment from:example4@example.com",
        },
        messages: [
          {
            match: {
              from: "(.+)@example.com",
              subject: "Message (?<myMatchGroup>.*)",
              to: "my\\.address\\+(.+)@gmail.com",
              is: [MessageFlag.READ],
            },
            actions: [{ name: "message.markRead" }],
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
                        "Folder2/Subfolder2/${message.subject.match.1}/${email.subject} - ${match.att.1}.jpg",
                      conflictStrategy: "replace",
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
                      conflictStrategy: "skip",
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
                  location: "/Folder1/Subfolder1/${message.subject}.pdf",
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
              location: "/Folder1/Subfolder1/${thread.firstMessageSubject}",
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

  public static newDefaultConfigJson(): PartialDeep<Config> {
    return {
      settings: this.newDefaultSettingsConfigJson(),
      threads: this.newComplexThreadConfigList(),
      global: this.newDefaultGlobalConfigJson(),
    }
  }

  public static newDefaultV1ConfigJson(): PartialDeep<V1Config> {
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
  }

  public static newDefaultConfig(
    configJson: PartialDeep<Config> = this.newDefaultConfigJson(),
  ): RequiredConfig {
    return newConfig(configJson)
  }
}
