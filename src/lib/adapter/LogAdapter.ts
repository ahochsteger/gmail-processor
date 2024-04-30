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

export const LOG_MESSAGE_NAME = "log.message"
export const LOG_LEVEL_NAME = "log.level"
export const defaultLogFields = [
  "log.timestamp",
  "entity.date",
  "entity.subject",
  "entity.from",
  "entity.url",
  "attachment.name",
  "attachment.size",
  "attachment.contentType",
  "stored.location",
  "stored.url",
  "stored.downloadUrl",
  "log.message",
]
export const defaultLogConfig: LogFieldConfig[] = [
  {
    name: "log.timestamp",
    title: "Timestamp",
    value: "${date.now:date::yyyy-MM-dd HH:mm:ss.SSS}",
  },
  {
    name: LOG_LEVEL_NAME,
    title: "Log Level",
  },
  {
    // Special entry that represents the log message
    name: LOG_MESSAGE_NAME,
    title: "Log Message",
  },
  // TODO: Move title to meta info and use from there.
  { name: "context.type", title: "Context Type", value: "${context.type}" },
  {
    name: "entity.id",
    title: "ID",
    ctxValues: {
      attachment: "${attachment.hash}",
      message: "${message.id}",
      thread: "${thread.id}",
    },
  },
  {
    name: "entity.url",
    title: "GMail URL",
    ctxValues: {
      attachment: "${message.url}",
      message: "${message.url}",
      thread: "${thread.url}",
    },
  },
  {
    name: "entity.date",
    title: "Message Date",
    ctxValues: {
      attachment: "${message.date}",
      message: "${message.date}",
      thread: "${thread.lastMessageDate}",
    },
  },
  {
    name: "entity.subject",
    title: "Subject",
    ctxValues: {
      attachment: "${message.subject}",
      message: "${message.subject}",
      thread: "${thread.firstMessageSubject}",
    },
  },
  {
    name: "entity.from",
    title: "From",
    ctxValues: {
      attachment: "${message.from}",
      message: "${message.from}",
    },
  },
  {
    name: "attachment.name",
    title: "Attachment Name",
  },
  {
    name: "attachment.contentType",
    title: "Content Type",
  },
  {
    name: "attachment.size",
    title: "Attachment Size",
  },
  {
    name: "stored.location",
    title: "Stored Location",
    ctxValues: { attachment: "${attachment.stored.location}" },
  },
  {
    name: "stored.url",
    title: "Stored URL",
    ctxValues: { attachment: "${attachment.stored.url}" },
  },
  {
    name: "stored.downloadUrl",
    title: "Download URL",
    ctxValues: { attachment: "${attachment.stored.downloadUrl}" },
  },
]

export class LogAdapter extends BaseAdapter {
  constructor(
    public ctx: EnvContext,
    public settings: SettingsConfig,
  ) {
    super(ctx, settings)
  }

  public getLogConfig(): LogFieldConfig[] {
    return defaultLogConfig.concat(this.settings.logConfig ?? [])
  }

  public getLogFieldNames(): string[] {
    return this.settings.logFields ?? defaultLogFields
  }

  public getField(
    ctx: Context,
    fieldConfig: LogFieldConfig[],
    name: string,
  ): LogFieldConfig | undefined {
    let field: LogFieldConfig | undefined
    const logConfigField = fieldConfig.find((f) => f.name == name)
    if (logConfigField) {
      field = logConfigField
    } else {
      const contextField = ctx.meta[name]?.value
      if (contextField) {
        field = {
          name: name,
          title: name,
          value: `\${${name}}`,
        } as LogFieldConfig
      }
    }
    return field
  }

  public getLogFields(ctx: Context): LogFieldConfig[] {
    const fieldNames = this.getLogFieldNames()
    const fieldConfig = this.getLogConfig()
    const fields: LogFieldConfig[] = []
    fieldNames.forEach((k) => {
      const field = this.getField(ctx, fieldConfig, k)
      if (field) {
        fields.push(field)
      }
    })
    return fields
  }

  public getLogHeaders(ctx: Context): string[] {
    return this.getLogFields(ctx).map((f) => f.title)
  }

  public getLogFieldValue(
    ctx: Context,
    field: LogFieldConfig,
    message: string,
    level: LogLevel = LogLevel.INFO,
  ): string {
    let value = ""
    if (field.name === LOG_MESSAGE_NAME) {
      value = message
    } else if (field.name === LOG_LEVEL_NAME) {
      value = level
    } else if (field.ctxValues && field.ctxValues[ctx.type]) {
      value = field.ctxValues[ctx.type] as string
    } else if (field.value !== undefined) {
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
    this.getLogFields(ctx).map(
      (f) => (data[f.name] = this.getLogFieldValue(ctx, f, message, level)),
    )
    return data
  }

  public getLogValues(
    ctx: Context,
    message: string,
    level: LogLevel = LogLevel.INFO,
  ): string[] {
    return this.getLogFields(ctx).map((f) =>
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
