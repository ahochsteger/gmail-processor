import {
  AttachmentContext,
  Context,
  EnvContext,
  MessageContext,
  ProcessingContext,
  ThreadContext,
} from "../Context"
import {
  LOG_LEVEL_NAME,
  LOG_MESSAGE_NAME,
  LogFieldConfig,
  SettingsConfig,
  newSettingsConfig,
} from "../config/SettingsConfig"
import { LogLevel } from "../utils/Logger"
import { PatternUtil } from "../utils/PatternUtil"
import { BaseAdapter } from "./BaseAdapter"

export class LogAdapter extends BaseAdapter {
  constructor(
    public ctx: EnvContext,
    public settings: SettingsConfig,
  ) {
    super(ctx, settings)
  }

  public getLogConfig(): LogFieldConfig[] {
    return newSettingsConfig(this.settings).logConfig
  }

  public getLogFieldNames(): string[] {
    return newSettingsConfig(this.settings).logFields
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
