import {
  AttachmentContext,
  Context,
  EnvContext,
  MessageContext,
  ProcessingContext,
  ThreadContext,
} from "../Context"
import { GlobalActionLoggingBase } from "../actions/GlobalActions"
import {
  LOG_LEVEL_NAME,
  LOG_LOCATION_NAME,
  LOG_MESSAGE_NAME,
  LogFieldConfig,
  LogLevel,
  SettingsConfig,
  newSettingsConfig,
} from "../config/SettingsConfig"
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
    const logConfigField = fieldConfig.find((f) => f.name === name)
    const contextField = ctx.meta[name]
    const field: LogFieldConfig = {
      name: name,
      title: logConfigField?.title ?? contextField?.title ?? name,
      value:
        logConfigField?.ctxValues?.[ctx.type] ??
        logConfigField?.value ??
        `\${${name}}`,
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
    args: GlobalActionLoggingBase,
  ): string {
    let value = ""
    if (field.name === LOG_MESSAGE_NAME) {
      value = args.message
    } else if (field.name === LOG_LEVEL_NAME) {
      value = args.level ?? LogLevel.INFO
    } else if (field.name === LOG_LOCATION_NAME) {
      value = args.location ?? ""
    } else if (field?.ctxValues?.[ctx.type]) {
      value = field.ctxValues[ctx.type] as string
    } else if (field.value !== undefined) {
      value = field.value ?? ""
    }
    return PatternUtil.substitute(ctx, value)
  }

  public getLogObject(
    ctx: Context,
    args: GlobalActionLoggingBase,
  ): Record<string, string> {
    const data: Record<string, string> = {}
    this.getLogFields(ctx).map(
      (f) => (data[f.name] = this.getLogFieldValue(ctx, f, args)),
    )
    return data
  }

  public getLogValues(ctx: Context, args: GlobalActionLoggingBase): string[] {
    return this.getLogFields(ctx).map((f) =>
      this.getLogFieldValue(ctx, f, args),
    )
  }

  public logJSON(
    ctx: ProcessingContext | ThreadContext | MessageContext | AttachmentContext,
    args: GlobalActionLoggingBase,
  ): Record<string, string> {
    const logObject = this.getLogObject(ctx, args)
    ctx.log.log(`JSON: ${JSON.stringify(logObject)}`, args.level)
    return logObject
  }
}
