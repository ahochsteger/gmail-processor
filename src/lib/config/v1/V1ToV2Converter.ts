import { ConflictStrategy } from "../../adapter/GDriveAdapter"
import { AttachmentConfig } from "../AttachmentConfig"
import { Config, RequiredConfig, newConfig } from "../Config"
import {
  DEFAULT_GLOBAL_QUERY_NEWER_THAN,
  DEFAULT_GLOBAL_QUERY_PREFIX,
} from "../GlobalConfig"
import { MessageConfig } from "../MessageConfig"
import { MarkProcessedMethod } from "../SettingsConfig"
import {
  RequiredThreadConfig,
  ThreadConfig,
  newThreadConfig,
} from "../ThreadConfig"
import { V1Config, newV1Config } from "./V1Config"
import { RequiredV1Rule } from "./V1Rule"

export class V1ToV2Converter {
  public static convertDateFormat(format: string): string {
    // old format (from Google Apps Script Utilities): yyyy-MM-dd_HH-mm-ss
    // See https://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html
    // new format (from date-fns): yyyy-MM-dd_HH-mm-ss
    // See https://date-fns.org/v2.30.0/docs/format
    const convertedFormat = format.replace(/u/g, "i")
    const unsupportedFormatStrings = /[Fa]/
    const matches = RegExp(unsupportedFormatStrings).exec(convertedFormat)
    if (matches) {
      throw new Error(
        `Conversion of date format not possible - unsupported date format '${matches[0]}' in format string '${format}'!`,
      )
    }
    return convertedFormat
  }

  public static sanitizeLocation(location: string, isPath: boolean): string {
    // Normalize path to form `/path1/path2`
    if (isPath && location !== "" && !location.startsWith("/")) {
      location = `/${location}`
    }
    if (isPath && location.endsWith("/")) {
      location = location.slice(0, -1)
    }
    return location
  }

  public static convertFromV1Pattern(s: string, dateKey: string) {
    const containsSingleQuotedStringRegex = /^'([^'\n]+)'$/g
    const legacyDateFormatRegex = /('([^']+)')?([^']+)('([^']+)')?/g
    if (!s.match(containsSingleQuotedStringRegex)) {
      // Support original date format
      s = s.replace(
        legacyDateFormatRegex,
        `$2\${${dateKey}:oldDateFormat:$3}$5`,
      )
      const regexp = /:oldDateFormat:([^}]+)}/g
      const matches = s.matchAll(regexp)
      for (const match of matches) {
        if (match.length > 1) {
          const convertedFormat = this.convertDateFormat(match[1])
          s = s.replace(/:oldDateFormat:[^}]+}/g, `:date::${convertedFormat}}`)
        }
      }
    } else {
      s = s.replace(/'/g, "") // Eliminate all single quotes
    }
    s = s
      .replace(/%s/g, "${message.subject}") // Original subject syntax
      .replace(/%o/g, "${attachment.name}") // Alternative syntax (from PR #61)
      .replace(/%filename/g, "${attachment.name}") // Alternative syntax from issue #50
      .replace(/#SUBJECT#/g, "${message.subject}") // Alternative syntax (from PR #22)
      .replace(/#FILE#/g, "${attachment.name}") // Alternative syntax (from PR #22)
      .replace(/%d/g, "${threadConfig.index}") // Original subject syntax

    return s
  }

  static getLocationFromRule(
    rule: RequiredV1Rule,
    defaultFilename: string,
  ): string {
    let filename
    if (rule.filenameFromRegexp) {
      filename = "${attachment.name.match.1}"
    } else if (rule.filenameTo) {
      filename = this.sanitizeLocation(
        this.convertFromV1Pattern(rule.filenameTo, "message.date"),
        false,
      )
    } else {
      filename = defaultFilename
    }
    let folder = ""
    folder +=
      rule.folder.indexOf("'") >= 0
        ? this.convertFromV1Pattern(rule.folder, "message.date")
        : rule.folder
    folder = this.sanitizeLocation(folder, true)
    if (rule.parentFolderId) {
      folder = `{id:${rule.parentFolderId}}${folder}`
    }
    return `${folder}/${filename}`
  }

  static v1RuleToV2ThreadConfig(rule: RequiredV1Rule): RequiredThreadConfig {
    const threadConfig: ThreadConfig = {}
    threadConfig.actions = []
    threadConfig.attachments = []
    threadConfig.messages = []
    threadConfig.match = {}
    const attachmentConfig: AttachmentConfig = {}
    const messageConfig: MessageConfig = {}
    messageConfig.actions = []
    attachmentConfig.match = {}
    attachmentConfig.actions = []

    if (rule.filter) {
      threadConfig.match.query = rule.filter
    }
    if (rule.newerThan && rule.newerThan != "") {
      threadConfig.match.query =
        (threadConfig.match.query ?? "") + ` newer_than:${rule.newerThan}`
    }
    if (rule.saveMessagePDF) {
      messageConfig.actions.push({
        name: "message.storePDF",
        args: {
          location: this.getLocationFromRule(rule, "${message.subject}.pdf"),
          conflictStrategy: ConflictStrategy.KEEP,
          skipHeader: rule.skipPDFHeader === true,
        },
      })
      threadConfig.messages.push(messageConfig)
    } else {
      if (rule.filenameFromRegexp) {
        attachmentConfig.match.name = rule.filenameFromRegexp
      }
      if (rule.filenameFrom && rule.filenameTo) {
        attachmentConfig.match.name = String(rule.filenameFrom).replace(
          /[\\^$*+?.()|[\]{}]/g,
          "\\$&",
        ) // TODO: Validate this regex!
      }
      attachmentConfig.actions.push({
        name: "attachment.store",
        args: {
          conflictStrategy: ConflictStrategy.KEEP,
          description:
            "Mail title: ${message.subject}\nMail date: ${message.date}\nMail link: https://mail.google.com/mail/u/0/#inbox/${message.id}",
          location: this.getLocationFromRule(rule, "${attachment.name}"),
        },
      })
      threadConfig.attachments.push(attachmentConfig)
    }
    if (rule.saveThreadPDF) {
      threadConfig.actions.push({
        name: "thread.storePDF",
        args: {
          location: this.getLocationFromRule(
            rule,
            "${thread.firstMessageSubject}.pdf",
          ),
          conflictStrategy: ConflictStrategy.KEEP,
        },
      })
    }
    if (rule.ruleLabel && rule.ruleLabel != "") {
      threadConfig.actions.push({
        name: "thread.addLabel",
        args: {
          name: rule.ruleLabel,
        },
      })
    }
    if (rule.archive) {
      threadConfig.actions.push({
        name: "thread.moveToArchive",
      })
    }
    return newThreadConfig(threadConfig)
  }

  static v1ConfigToV2ConfigJson(partialV1Config: V1Config): Config {
    const v1Config = newV1Config(partialV1Config)
    const threadConfigs = v1Config.rules.map((rule) =>
      this.v1RuleToV2ThreadConfig(rule),
    )
    const globalFilter = v1Config.globalFilter || DEFAULT_GLOBAL_QUERY_PREFIX
    const newerThan = v1Config.newerThan || DEFAULT_GLOBAL_QUERY_NEWER_THAN
    const configJson: Config = {
      global: {
        thread: {
          match: {
            query: `${globalFilter} newer_than:${newerThan}`,
          },
        },
      },
      settings: {
        markProcessedMethod: MarkProcessedMethod.ADD_THREAD_LABEL,
        markProcessedLabel: v1Config.processedLabel,
        sleepTimeThreads: v1Config.sleepTime,
        maxRuntime: v1Config.maxRuntime,
        timezone: v1Config.timezone,
      },
      threads: threadConfigs,
    }
    return configJson
  }

  static v1ConfigToV2Config(v1ConfigJson: V1Config): RequiredConfig {
    const configJson = this.v1ConfigToV2ConfigJson(v1ConfigJson)
    const config = newConfig(configJson)
    return config
  }
}
