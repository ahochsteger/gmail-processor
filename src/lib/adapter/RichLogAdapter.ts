import {
  AttachmentContext,
  Context,
  EnvContext,
  MessageContext,
  ProcessingContext,
  ThreadContext,
} from "../Context"
import { LogFieldConfig, SettingsConfig } from "../config/SettingsConfig"
import { LogLevel } from "../utils/Logger"
import { PatternUtil } from "../utils/PatternUtil"
import { BaseAdapter } from "./BaseAdapter"

export const LOG_MESSAGE_KEY = "log.message"
export const LOG_LEVEL_KEY = "log.level"
const defaultLogConfig: LogFieldConfig[] = [
  {
    key: "log.timestamp",
    title: "Timestamp",
    value: "${date.now:date::yyyy-MM-dd HH:mm:ss.SSS}",
  },
  {
    key: LOG_LEVEL_KEY,
    title: "Log Level",
  },
  { key: "context", title: "Context", value: "${context.type}" },
  {
    key: "id",
    title: "ID",
    context: {
      attachment: "${attachment.hash}",
      message: "${message.id}",
      thread: "${thread.id}",
    },
  },
  {
    key: "gmailUrl",
    title: "GMail URL",
    context: {
      attachment: "${message.url}",
      message: "${message.url}",
      thread: "${thread.url}",
    },
  },
  {
    key: "date",
    title: "Message Date",
    context: {
      attachment: "${message.date}",
      message: "${message.date}",
      thread: "${thread.lastMessageDate}",
    },
  },
  {
    key: "subject",
    title: "Subject",
    context: {
      attachment: "${message.subject}",
      message: "${message.subject}",
      thread: "${thread.firstMessageSubject}",
    },
  },
  {
    key: "from",
    title: "From",
    context: {
      attachment: "${message.from}",
      message: "${message.from}",
    },
  },
  {
    key: "attName",
    title: "Attachment Name",
    context: { attachment: "${attachment.name}" },
  },
  {
    key: "attContentType",
    title: "Content Type",
    context: { attachment: "${attachment.contentType}" },
  },
  {
    key: "attSize",
    title: "Size",
    context: { attachment: "${attachment.size}" },
  },
  {
    key: "gdriveLocation",
    title: "GDrive Location",
    context: { attachment: "${attachment.stored.location}" },
  },
  {
    key: "gdriveUrl",
    title: "Drive URL",
    context: { attachment: "${attachment.stored.url}" },
  },
  {
    key: "gdriveDownloadUrl",
    title: "Download URL",
    context: { attachment: "${attachment.stored.downloadUrl}" },
  },
  {
    // Special entry that represents the log message
    key: LOG_MESSAGE_KEY,
    title: "Log Message",
  },
]

export class RichLogAdapter extends BaseAdapter {
  constructor(
    public ctx: EnvContext,
    public settings: SettingsConfig,
  ) {
    super(ctx, settings)
  }

  public getLogConfig(): LogFieldConfig[] {
    return defaultLogConfig.concat(this.settings.richLogConfig ?? [])
  }

  public getLogFieldKeys(): string[] {
    return this.settings.richLogFields ?? this.getLogConfig().map((f) => f.key)
  }

  public getLogFields(): LogFieldConfig[] {
    const fieldKeys = this.getLogFieldKeys()
    const fieldConfig = this.getLogConfig()
    const fields: LogFieldConfig[] = []
    fieldKeys.forEach((k) => {
      const field = fieldConfig.find((f) => f.key == k)
      if (field) {
        fields.push(field)
      }
    })
    return fields
  }

  public getLogHeaders(): string[] {
    return this.getLogFields().map((f) => f.title)
  }

  public getLogFieldValue(
    ctx: Context,
    field: LogFieldConfig,
    message: string,
    level: LogLevel = LogLevel.INFO,
  ): string {
    let value = ""
    if (field.key === LOG_MESSAGE_KEY) {
      value = message
    } else if (field.key === LOG_LEVEL_KEY) {
      value = level
    } else if (field.context && field.context[ctx.type]) {
      value = field.context[ctx.type] as string
    } else {
      value = field.value ?? ""
    }
    return PatternUtil.substitute(ctx, value)
  }

  public getLogObject(
    ctx: Context,
    message: string,
    level: LogLevel = LogLevel.INFO,
  ): Record<string, string> {
    const data: Record<string, string> = {}
    this.getLogFields().map(
      (f) => (data[f.key] = this.getLogFieldValue(ctx, f, message, level)),
    )
    return data
  }

  public getLogValues(
    ctx: Context,
    message: string,
    level: LogLevel = LogLevel.INFO,
  ): string[] {
    return this.getLogFields().map((f) =>
      this.getLogFieldValue(ctx, f, message, level),
    )
  }

  public logJSON(
    ctx: ProcessingContext | ThreadContext | MessageContext | AttachmentContext,
    message: string,
    level: LogLevel = LogLevel.INFO,
  ): Record<string, string> {
    const logObject = this.getLogObject(ctx, message, level)
    ctx.log.log(`JSON: ${JSON.stringify(logObject)}`, level)
    return logObject
  }
}
