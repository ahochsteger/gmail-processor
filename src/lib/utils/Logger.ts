import {
  AttachmentContext,
  EnvContext,
  MessageContext,
  ProcessingContext,
  ThreadContext,
} from "../Context"

/** Levels of log messages used for marking and filtering. */
export enum LogLevel {
  /** Log level for debugging messages. */
  DEBUG = "debug",
  /** Log level for info messages. */
  INFO = "info",
  /** Log level for warning messages. */
  WARN = "warn",
  /** Log level for error messages. */
  ERROR = "error",
}

export class Logger {
  getMessage(message?: unknown, level: LogLevel = LogLevel.INFO) {
    return `[${new Date().toISOString()}] ${level.toUpperCase()}: ${message}`
  }
  log(
    message?: unknown,
    level: LogLevel = LogLevel.INFO,
    ...optionalParams: unknown[]
  ) {
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
  logEnvContext(ctx: EnvContext, level: LogLevel = LogLevel.DEBUG) {
    const logObj = {
      runMode: ctx.env.runMode,
      timezone: ctx.env.timezone,
    }
    this.debug(`EnvContext: ${JSON.stringify(logObj, null, 2)}`, level)
  }
  logProcessingContext(
    ctx: ProcessingContext,
    level: LogLevel = LogLevel.DEBUG,
  ) {
    const logObj = {
      config: ctx.proc.config,
    }
    this.debug(`ProcessingContext: ${JSON.stringify(logObj, null, 2)}`, level)
  }
  logThreadContext(ctx: ThreadContext, level: LogLevel = LogLevel.DEBUG) {
    const logObj = {
      config: ctx.thread.config,
      object: {
        id: ctx.thread.object.getId(),
        firstMessageSubject: ctx.thread.object.getFirstMessageSubject(),
      },
    }
    this.debug(`ThreadContext: ${JSON.stringify(logObj, null, 2)}`, level)
  }
  logMessageContext(ctx: MessageContext, level: LogLevel = LogLevel.DEBUG) {
    const logObj = {
      config: ctx.message.config,
      object: {
        from: ctx.message.object.getFrom(),
        id: ctx.message.object.getId(),
        subject: ctx.message.object.getSubject(),
        to: ctx.message.object.getTo(),
      },
    }
    this.debug(`MessageContext: ${JSON.stringify(logObj, null, 2)}`, level)
  }
  logAttachmentContext(
    ctx: AttachmentContext,
    level: LogLevel = LogLevel.DEBUG,
  ) {
    const logObj = {
      config: ctx.attachment.config,
      object: {
        contentType: ctx.attachment.object.getContentType(),
        name: ctx.attachment.object.getName(),
        size: ctx.attachment.object.getSize(),
      },
    }
    this.debug(`AttachmentContext: ${JSON.stringify(logObj, null, 2)}`, level)
  }
}
