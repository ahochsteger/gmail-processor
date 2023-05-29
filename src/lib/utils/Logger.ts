import {
  AttachmentContext,
  EnvContext,
  MessageContext,
  ProcessingContext,
  ThreadContext,
} from "../Context"

export class Logger {
  debug(message?: unknown, ...optionalParams: unknown[]) {
    console.debug(`DEBUG: ${message}`, ...optionalParams)
  }
  info(message?: unknown, ...optionalParams: unknown[]) {
    console.info(`INFO: ${message}`, ...optionalParams)
  }
  warn(message?: unknown, ...optionalParams: unknown[]) {
    console.warn(`WARNING: ${message}`, ...optionalParams)
  }
  error(message?: unknown, ...optionalParams: unknown[]) {
    console.error(`ERROR: ${message}`, ...optionalParams)
  }
  logEnvContext(ctx: EnvContext) {
    const logObj = {
      runMode: ctx.env.runMode,
      timezone: ctx.env.timezone,
    }
    this.info(`EnvContext: ${JSON.stringify(logObj, null, 2)}`)
  }
  logProcessingContext(ctx: ProcessingContext) {
    const logObj = {
      config: ctx.proc.config,
    }
    this.logEnvContext(ctx)
    this.info(`ProcessingContext: ${JSON.stringify(logObj, null, 2)}`)
  }
  logThreadContext(ctx: ThreadContext) {
    const logObj = {
      config: ctx.thread.config,
      object: {
        id: ctx.thread.object.getId(),
        firstMessageSubject: ctx.thread.object.getFirstMessageSubject(),
      },
    }
    this.logProcessingContext(ctx)
    this.info(`ThreadContext: ${JSON.stringify(logObj, null, 2)}`)
  }
  logMessageContext(ctx: MessageContext) {
    const logObj = {
      config: ctx.message.config,
      object: {
        from: ctx.message.object.getFrom(),
        id: ctx.message.object.getId(),
        subject: ctx.message.object.getSubject(),
        to: ctx.message.object.getTo(),
      },
    }
    this.logThreadContext(ctx)
    this.info(`MessageContext: ${JSON.stringify(logObj, null, 2)}`)
  }
  logAttachmentContext(ctx: AttachmentContext) {
    const logObj = {
      config: ctx.attachment.config,
      object: {
        contentType: ctx.attachment.object.getContentType(),
        name: ctx.attachment.object.getName(),
        size: ctx.attachment.object.getSize(),
      },
    }
    this.logMessageContext(ctx)
    this.info(`AttachmentContext: ${JSON.stringify(logObj, null, 2)}`)
  }
}
