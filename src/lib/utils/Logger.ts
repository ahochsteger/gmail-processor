/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProcessingContext } from "../Context"
import { GlobalActionLoggingBase } from "../actions/GlobalActions"
import { LogRedactionMode } from "../config/SettingsConfig"

/** Levels of log messages used for marking and filtering. */
export enum LogLevel {
  /** Log level for execution tracing */
  TRACE = "trace",
  /** Log level for debugging messages. */
  DEBUG = "debug",
  /** Log level for info messages. */
  INFO = "info",
  /** Log level for warning messages. */
  WARN = "warn",
  /** Log level for error messages. */
  ERROR = "error",
}
const levels = Object.values(LogLevel)

function levelIndex(level: LogLevel): number {
  return levels.indexOf(level)
}

export class Logger {
  logLevelIndex: number
  constructor(public logLevel: LogLevel = LogLevel.TRACE) {
    this.logLevelIndex = levelIndex(logLevel)
  }
  shouldLog(level: LogLevel): boolean {
    return this.logLevelIndex <= levelIndex(level)
  }
  getMessage(message?: unknown, level: LogLevel = LogLevel.INFO) {
    return `${new Date().toISOString()} ${level.toUpperCase()} ${message}`
  }
  log(
    message?: unknown,
    level: LogLevel = LogLevel.INFO,
    ...optionalParams: unknown[]
  ) {
    if (!this.shouldLog(level)) return
    if ([LogLevel.WARN, LogLevel.ERROR].includes(level)) {
      console.error(this.getMessage(message, level), ...optionalParams)
    } else {
      console.log(this.getMessage(message, level), ...optionalParams)
    }
  }
  debug(message?: unknown, ...optionalParams: unknown[]) {
    this.log(message, LogLevel.DEBUG, ...optionalParams)
  }
  info(message?: unknown, ...optionalParams: unknown[]) {
    this.log(message, LogLevel.INFO, ...optionalParams)
  }
  warn(message?: unknown, ...optionalParams: unknown[]) {
    this.log(message, LogLevel.WARN, ...optionalParams)
  }
  error(message?: unknown, ...optionalParams: unknown[]) {
    this.log(message, LogLevel.ERROR, ...optionalParams)
  }
  trace(ctx: ProcessingContext, args: GlobalActionLoggingBase) {
    const { logSheetTracing, logSheetLocation } = ctx.proc.config.settings
    ctx.log.log(`[${args.location}] ${args.message}`, LogLevel.TRACE)
    if (logSheetTracing === true && logSheetLocation) {
      ctx.proc.spreadsheetAdapter.log(ctx, args)
    }
  }
  redact(ctx: ProcessingContext, value?: string | null): string {
    if (value === null || value === undefined) {
      return ""
    }
    switch (ctx.proc.config.settings.logSensitiveRedactionMode) {
      case LogRedactionMode.ALL:
        value = "(redacted)"
        break
      case LogRedactionMode.AUTO:
        if (value.length < 8) {
          value = "(redacted)"
        } else {
          value = `${value.slice(0, 3)}...${value.slice(-3)}`
        }
        break
    }
    return value
  }
}
