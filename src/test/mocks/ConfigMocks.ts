import { PartialDeep } from "type-fest"
import {
  AttachmentActionConfig,
  MessageActionConfig,
  ThreadActionConfig,
} from "../../lib/config/ActionConfig"
import { AttachmentConfig } from "../../lib/config/AttachmentConfig"
import { Config, RequiredConfig, jsonToConfig } from "../../lib/config/Config"
import { MessageConfig } from "../../lib/config/MessageConfig"
import { MessageFlag } from "../../lib/config/MessageFlag"
import { SettingsConfig } from "../../lib/config/SettingsConfig"
import { ThreadConfig } from "../../lib/config/ThreadConfig"
import { V1Config } from "../../lib/config/v1/V1Config"
import { Mocks } from "./MockFactory"

export class ConfigMocks {
  public static setupAllMocks(mocks: Mocks): Mocks {
    // TODO: Setup all mocks here
    return mocks
  }

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
      name: "thread.storeAsPdfToGDrive",
      description: "Default action config",
    }
  }

  public static newDefaultMessageActionConfigJson(): PartialDeep<MessageActionConfig> {
    return {
      args: {
        folderType: "path",
        folder: "Folder2/Subfolder2/${message.subject.match.1}",
        filename: "${message.subject} - ${match.file.1}.jpg",
        onExists: "replace",
      },
      name: "message.storeAsPdfToGDrive",
      description: "Default action config",
    }
  }

  public static newDefaultAttachmentActionConfigJson(): PartialDeep<AttachmentActionConfig> {
    return {
      args: {
        folderType: "path",
        folder: "Folder2/Subfolder2/${message.subject.match.1}",
        filename: "${message.subject} - ${match.file.1}.jpg",
        onExists: "replace",
      },
      name: "attachment.storeToGDrive",
      description: "Default action config",
    }
  }

  public static newDefaultAttachmentConfigJson(
    includeCommands = false,
  ): PartialDeep<AttachmentConfig> {
    return {
      name: "default-attachment-config",
      description: "Default attachment config",
      actions: includeCommands
        ? [
            this.newDefaultAttachmentActionConfigJson() as AttachmentActionConfig,
          ]
        : [],
      match: {
        name: "Image-([0-9]+)\\.jpg",
        contentTypeRegex: "image/.+",
        includeAttachments: true,
        includeInlineImages: true,
        largerThan: -1,
        smallerThan: -1,
      },
    }
  }

  public static newDefaultMessageConfigJson(
    includeCommands = false,
    includeAttachmentConfigs = false,
  ): PartialDeep<MessageConfig> {
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
      actions: includeCommands
        ? [this.newDefaultMessageActionConfigJson() as MessageActionConfig]
        : [],
      attachments: includeAttachmentConfigs
        ? [this.newDefaultAttachmentConfigJson()]
        : [],
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
        newerThan: "",
      },
      attachments: [],
    }
  }

  public static newComplexThreadConfigList(): PartialDeep<ThreadConfig>[] {
    return [
      {
        actions: [
          {
            name: "thread.storeAsPdfToGDrive",
            args: {
              location: "Folder1/Subfolder1/${thread.firstMessageSubject}",
            },
          },
        ],
        description:
          "Example that stores all attachments of all found threads to a certain GDrive folder",
        match: {
          query: "has:attachment from:example@example.com",
        },
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
                name: "message.storeAsPdfToGDrive",
                args: { location: "Folder1/Subfolder1/${message.subject}.pdf" },
              },
            ],
            match: {
              from: "(.+)@example.com",
              subject: "Prefix - (.*) - Suffix(.*)",
              to: "my\\.address\\+(.+)@gmail.com",
            },
          },
        ],
      },
      {
        match: {
          query: "has:attachment from:example4@example.com",
        },
        messages: [
          {
            match: {
              from: "(.+)@example.com",
              subject: "Prefix - (.*) - Suffix(.*)",
              to: "my\\.address\\+(.+)@gmail.com",
              is: [MessageFlag.READ],
              // TODO: Find out how to match only read/unread or starred/unstarred messages?
            },
            actions: [
              // TODO: Decide if only actions of a certain type (thread, message, attachment) are allowed?
              // Pro: More flexible (e.g. forward message, if a certain attachment rule matches)
              { name: "message.markRead" },
            ],
            attachments: [
              {
                match: { name: "Image-([0-9]+)\\.jpg" },
                actions: [
                  {
                    name: "attachment.storeToGDrive",
                    args: {
                      location:
                        "Folder2/Subfolder2/${message.subject.match.1}/${email.subject} - ${match.att.1}.jpg",
                      conflictStrategy: "replace",
                    },
                  },
                ],
              },
              {
                match: { name: ".+\\..+" },
                actions: [
                  {
                    name: "attachment.storeToGDrive",
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
    ]
  }

  public static newDefaultConfigJson(): PartialDeep<Config> {
    return {
      settings: this.newDefaultSettingsConfigJson(),
      threads: this.newComplexThreadConfigList(),
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

  public static newDefaultConfig(): RequiredConfig {
    return jsonToConfig({
      threads: this.newComplexThreadConfigList(),
    })
  }
}
