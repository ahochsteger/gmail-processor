import { z } from "zod"
import { essentialObject } from "../utils/ConfigUtils"

export const DEFAULT_SETTING_MAX_BATCH_SIZE = 10
export const DEFAULT_SETTING_MAX_RUNTIME = 280
export const DEFAULT_SETTING_SLEEP_TIME_THREADS = 100
export const LOG_MESSAGE_NAME = "log.message"
export const LOG_LEVEL_NAME = "log.level"
export const LOG_LOCATION_NAME = "log.location"

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

/**
 * The method to mark processed threads/messages/attachments.
 */
export enum MarkProcessedMethod {
  /**
   * Adds the label defined in the setting `markProcessedLabel` to each processed thread.
   *
   * **NOTE:**
   * - Automatically appends the action `thread.addLabel` to the list of global thread actions
   * - Automatically appends `-label:<markProcessedLabel>` to the global thread match query config
   *
   * **Limitations:**
   * - It cannot handle multiple messages per thread properly.
   */
  ADD_THREAD_LABEL = "add-label",
  /**
   * Doesn't do anything to mark threads, messages or attachments as processed and leaves this task to the user.
   *
   * **NOTE:**
   * - Use actions on the desired level (threads, messages or attachments) to mark them as processed.
   * - Take care to exclude them from queries in the thread match config, to prevent re-processing over and over again.
   *
   * **Limitations:**
   * - Is more complex since you have to take care to
   */
  CUSTOM = "custom",
  /**
   * Marks processed messages as read, which is more flexible than adding a thread label.
   * But it comes at the cost of marking messages as read, which may not be expected.
   *
   * **NOTE:**
   * - Automatically appends the action `message.markRead` to the list of global message actions
   * - Automatically appends `-is:read` to the global thread match query config
   * - Automatically adds `is: ["unread"]` to the global message match config
   *
   * **Limitations:**
   * - Since it marks messages as read it may not be applicable in all cases.
   */
  MARK_MESSAGE_READ = "mark-read",
}

/**
 * Represents the context-dependant value mapping.
 */
export const LogFieldContextConfigSchema = z.object({
  /** The value to be used for attachment context. Supports placeholder substitution. */
  attachment: z
    .string()
    .optional()
    .describe(
      "The value to be used for attachment context. Supports placeholder substitution.",
    ),
  /** The value to be used for environment context. Supports placeholder substitution. */
  env: z
    .string()
    .optional()
    .describe(
      "The value to be used for environment context. Supports placeholder substitution.",
    ),
  /** The value to be used for message context. Supports placeholder substitution. */
  message: z
    .string()
    .optional()
    .describe(
      "The value to be used for message context. Supports placeholder substitution.",
    ),
  /** The value to be used for processing context. Supports placeholder substitution. */
  proc: z
    .string()
    .optional()
    .describe(
      "The value to be used for processing context. Supports placeholder substitution.",
    ),
  /** The value to be used for thread context. Supports placeholder substitution. */
  thread: z
    .string()
    .optional()
    .describe(
      "The value to be used for thread context. Supports placeholder substitution.",
    ),
})
export type LogFieldContextConfig = z.infer<typeof LogFieldContextConfigSchema>

/**
 * Represents a log field configuration.
 */
export const LogFieldConfigSchema = z.object({
  /** The name of the log field that can be referenced from the list of log fields. */
  name: z
    .string()
    .default("")
    .describe(
      "The name of the log field that can be referenced from the list of log fields.",
    ),
  /** The title of the log field that is used as the headline of the log sheet. */
  title: z
    .string()
    .default("")
    .describe(
      "The title of the log field that is used as the headline of the log sheet.",
    ),
  /** The value of the log field. Supports placeholder substitution. */
  value: z
    .string()
    .optional()
    .describe("The value of the log field. Supports placeholder substitution."),
  /** The context-dependent values. It allows different values depending on the context type. */
  ctxValues: LogFieldContextConfigSchema.default({}).describe(
    "The context-dependent values. It allows different values depending on the context type.",
  ),
})
export type LogFieldConfig = z.infer<typeof LogFieldConfigSchema>

/**
 * Specifies how sensitive data should be redacted for logging.
 */
export enum LogRedactionMode {
  /** Do not redact sensitive data at all. */
  NONE = "none",
  /** Automatically detect sensitive data to be redacted */
  AUTO = "auto",
  /** Redact all possibly sensitive data */
  ALL = "all",
}

/**
 * Represents a settings config that affect the way GmailProcessor works.
 */
export const SettingsConfigSchema = z.object({
  /**
   * Default format string for timestamp formatting.
   * See [date-fns format strings](https://date-fns.org/docs/format).
   */
  defaultTimestampFormat: z
    .string()
    .default("yyyy-MM-dd HH:mm:ss")
    .describe(
      "Default format string for timestamp formatting. See [date-fns format strings](https://date-fns.org/docs/format).",
    ),
  /**
   * Default separator to be used when joining arrays in string substitution.
   */
  defaultArrayJoinSeparator: z
    .string()
    .default(",")
    .describe(
      "Default separator to be used when joining arrays in string substitution.",
    ),
  /**
   * Location of the spreadsheet log file. Enables logging to a spreadsheet if not empty.
   * Example: `GmailProcessor/logsheet-{{date.now|formatDate('yyyy-MM')}}`
   */
  logSheetLocation: z
    .string()
    .default("")
    .describe(
      "Location of the spreadsheet log file. Enables logging to a spreadsheet if not empty. Example: `GmailProcessor/logsheet-{{date.now|formatDate('yyyy-MM')}}`",
    ),
  /**
   * The list of field names to be used for log sheet logging.
   * All context placeholder names can be referenced as well as special fields defined for logging.
   */
  logFields: z
    .array(z.string())
    .default([
      "log.timestamp",
      "log.level",
      "log.location",
      "log.message",
      "object.id",
      "object.date",
      "object.subject",
      "object.from",
      "object.url",
      "attachment.name",
      "attachment.size",
      "attachment.contentType",
      "stored.location",
      "stored.url",
      "stored.downloadUrl",
    ])
    .describe(
      "The list of field names to be used for log sheet logging. All context placeholder names can be referenced as well as special fields defined for logging.",
    ),
  /**
   * Defines additional fields that can be used in addition to the built-in ones for log sheet logging.
   */
  logConfig: z
    .array(LogFieldConfigSchema)
    .default([
      {
        name: "log.timestamp",
        title: "Timestamp",
        value: "{{date.now|formatDate('yyyy-MM-dd HH:mm:ss.SSS')}}",
        ctxValues: {},
      },
      {
        name: "log.level",
        title: "Log Level",
        ctxValues: {},
      },
      {
        name: "log.message",
        title: "Log Message",
        ctxValues: {},
      },
      {
        name: "context.type",
        title: "Context Type",
        ctxValues: {},
      },
      {
        name: "object.id",
        title: "ID",
        ctxValues: {
          attachment: "{{attachment.hash}}",
          message: "{{message.id}}",
          thread: "{{thread.id}}",
        },
      },
      {
        name: "object.url",
        title: "GMail URL",
        ctxValues: {
          attachment: "{{message.url}}",
          message: "{{message.url}}",
          thread: "{{thread.url}}",
        },
      },
      {
        name: "object.date",
        title: "Message Date",
        ctxValues: {
          attachment: "{{message.date}}",
          message: "{{message.date}}",
          thread: "{{thread.lastMessageDate}}",
        },
      },
      {
        name: "object.subject",
        title: "Subject",
        ctxValues: {
          attachment: "{{message.subject}}",
          message: "{{message.subject}}",
          thread: "{{thread.firstMessageSubject}}",
        },
      },
      {
        name: "object.from",
        title: "From",
        ctxValues: {
          attachment: "{{message.from}}",
          message: "{{message.from}}",
        },
      },
      {
        name: "attachment.name",
        title: "Attachment Name",
        ctxValues: {},
      },
      {
        name: "attachment.contentType",
        title: "Content Type",
        ctxValues: {},
      },
      {
        name: "attachment.size",
        title: "Attachment Size",
        ctxValues: {},
      },
      {
        name: "stored.location",
        title: "Stored Location",
        ctxValues: {
          attachment: "{{attachment.stored.location}}",
        },
      },
      {
        name: "stored.url",
        title: "Stored URL",
        ctxValues: {
          attachment: "{{attachment.stored.url}}",
        },
      },
      {
        name: "stored.downloadUrl",
        title: "Download URL",
        ctxValues: {
          attachment: "{{attachment.stored.downloadUrl}}",
        },
      },
    ])
    .describe(
      "Defines additional fields that can be used in addition to the built-in ones for log sheet logging.",
    ),
  /**
   * Filter logs to given level or higher.
   */
  logLevel: z
    .nativeEnum(LogLevel)
    .default(LogLevel.INFO)
    .describe("Filter logs to given level or higher."),
  /**
   * Specifies how sensitive information should be redacted for logging.
   */
  logSensitiveRedactionMode: z
    .nativeEnum(LogRedactionMode)
    .default(LogRedactionMode.AUTO)
    .describe(
      "Specifies how sensitive information should be redacted for logging.",
    ),
  /**
   * Enables trace logging into the logsheet.
   * This automatically loggs useful information for debugging without placing `global.sheetLog`
   */
  logSheetTracing: z
    .boolean()
    .default(false)
    .describe(
      "Enables trace logging into the logsheet. This automatically loggs useful information for debugging without placing `global.sheetLog`.",
    ),
  /**
   * The maximum batch size of threads to process in a single run to respect Google processing limits
   */
  maxBatchSize: z
    .number()
    .default(DEFAULT_SETTING_MAX_BATCH_SIZE)
    .describe(
      "The maximum batch size of threads to process in a single run to respect Google processing limits",
    ),
  /**
   * The maximum runtime in seconds for a single run to respect Google processing limits
   */
  maxRuntime: z
    .number()
    .default(DEFAULT_SETTING_MAX_RUNTIME)
    .describe(
      "The maximum runtime in seconds for a single run to respect Google processing limits",
    ),
  /**
   * The label to be added to processed GMail threads (only for markProcessedMode="label").
   */
  markProcessedLabel: z
    .string()
    .default("")
    .describe(
      'The label to be added to processed GMail threads (only for markProcessedMode="label").',
    ),
  /**
   * The method to mark processed threads/messages.
   */
  markProcessedMethod: z
    .nativeEnum(MarkProcessedMethod)
    .default(MarkProcessedMethod.MARK_MESSAGE_READ)
    .describe("The method to mark processed threads/messages."),
  /**
   * The sleep time in milliseconds between processing each thread
   */
  sleepTimeThreads: z
    .number()
    .default(DEFAULT_SETTING_SLEEP_TIME_THREADS)
    .describe("The sleep time in milliseconds between processing each thread"),
  /**
   * The sleep time in milliseconds between processing each message
   */
  sleepTimeMessages: z
    .number()
    .default(0)
    .describe("The sleep time in milliseconds between processing each message"),
  /**
   * The sleep time in milliseconds between processing each attachment
   */
  sleepTimeAttachments: z
    .number()
    .default(0)
    .describe(
      "The sleep time in milliseconds between processing each attachment",
    ),
  /**
   * The timezone to be used for date/time operations.
   * Value `default` uses the <a href="https://developers.google.com/apps-script/reference/base/session#getscripttimezone">script timezone</a>.
   * @deprecated Timezone should be set in project settings or `appscript.json` of Google Apps Script instead. Will be removed in the future.
   */
  timezone: z
    .string()
    .default("default")
    .describe(
      "The timezone to be used for date/time operations. Value `default` uses the script timezone. @deprecated Timezone should be set in project settings or `appscript.json` of Google Apps Script instead. Will be removed in the future.",
    ),
})

export type SettingsConfig = z.input<typeof SettingsConfigSchema>
export type RequiredSettingsConfig = z.output<typeof SettingsConfigSchema>

export function newSettingsConfig(
  json: SettingsConfig = {},
): RequiredSettingsConfig {
  return SettingsConfigSchema.parse(json)
}

export function essentialSettingsConfig(
  config: SettingsConfig,
): SettingsConfig {
  config = essentialObject(
    config,
    newSettingsConfig(),
    {},
    ["markProcessedMethod"], // TODO: Extract required properties from class definition
  )
  return config
}
