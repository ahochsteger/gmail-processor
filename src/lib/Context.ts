import { ActionRegistry, ActionReturnType } from "./actions/ActionRegistry"
import { GDriveAdapter } from "./adapter/GDriveAdapter"
import { GmailAdapter } from "./adapter/GmailAdapter"
import { LogAdapter } from "./adapter/LogAdapter"
import { SpreadsheetAdapter } from "./adapter/SpreadsheetAdapter"
import { ActionConfig } from "./config/ActionConfig"
import { RequiredAttachmentConfig } from "./config/AttachmentConfig"
import { AttachmentMatchConfig } from "./config/AttachmentMatchConfig"
import { RequiredConfig } from "./config/Config"
import { RequiredMessageConfig } from "./config/MessageConfig"
import { MessageMatchConfig } from "./config/MessageMatchConfig"
import { RequiredThreadConfig } from "./config/ThreadConfig"
import { Logger } from "./utils/Logger"
import { Timer } from "./utils/Timer"

export type Attachment = GoogleAppsScript.Gmail.GmailAttachment
export type Message = GoogleAppsScript.Gmail.GmailMessage
export type Thread = GoogleAppsScript.Gmail.GmailThread

/** The runtime mode in which processing takes place. */
export enum RunMode {
  /** This run-mode skips execution of writing actions. Use this for testing config changes or library upgrades. */
  DRY_RUN = "dry-run",
  /** This run-mode can be used for normal operation but will skip possibly destructive actions like overwriting files or removing threads or messages. */
  SAFE_MODE = "safe-mode",
  /**
   * This run-mode will execute all configured actions including possibly destructive actions like overwriting files or removing threads or messages.
   * ATTENTION: Use this only if you know exactly what you're doing and won't complain if something goes wrong!
   */
  DANGEROUS = "dangerous",
}

/** The type of meta information used for context substitution placeholders. */
export enum MetaInfoType {
  /** Boolean type substituted to `true` or `false`. */
  BOOLEAN = "boolean",
  /** Date/time type. For substitution a format string can be given using `${<placeholder>:date:<expression>:<format>}`. */
  DATE = "date",
  /** A numeric data type. */
  NUMBER = "number",
  /** A string data type. */
  STRING = "string",
  /** A custom configuration variable. */
  VARIABLE = "variable",
}
type MetaInfoValueType =
  | unknown
  | ((
      obj: Message | Attachment,
      cfg: MessageMatchConfig | AttachmentMatchConfig,
    ) => unknown)
export type MetaInfoEntry = {
  deprecationInfo?: string
  description: string
  title: string
  type: MetaInfoType
  value: MetaInfoValueType
}
export function newMetaInfo(
  type: MetaInfoType,
  value: MetaInfoValueType,
  title: string,
  description: string,
  deprecationInfo?: string,
): MetaInfoEntry {
  return {
    deprecationInfo,
    description,
    title,
    type,
    value,
  }
}
export type MetaInfo = {
  [k: string]: MetaInfoEntry | undefined
}

type EnvInfo = {
  documentApp: GoogleAppsScript.Document.DocumentApp
  gmailApp: GoogleAppsScript.Gmail.GmailApp
  gdriveApp: GoogleAppsScript.Drive.DriveApp
  driveApi: GoogleAppsScript.Drive
  mailApp: GoogleAppsScript.Mail.MailApp
  utilities: GoogleAppsScript.Utilities.Utilities
  spreadsheetApp: GoogleAppsScript.Spreadsheet.SpreadsheetApp
  cacheService: GoogleAppsScript.Cache.CacheService
  runMode: RunMode
  session: GoogleAppsScript.Base.Session
  timezone: string
  urlFetchApp: typeof UrlFetchApp
}

export type ProcessingInfo = {
  actionRegistry: ActionRegistry
  config: RequiredConfig
  gdriveAdapter: GDriveAdapter
  gmailAdapter: GmailAdapter
  logAdapter: LogAdapter
  spreadsheetAdapter: SpreadsheetAdapter
  timer: Timer
}

export type ThreadInfo = {
  object: GoogleAppsScript.Gmail.GmailThread
  config: RequiredThreadConfig
  configIndex: number
  index: number
}

export type MessageInfo = {
  object: GoogleAppsScript.Gmail.GmailMessage
  config: RequiredMessageConfig
  configIndex: number
  index: number
}

export type AttachmentInfo = {
  object: GoogleAppsScript.Gmail.GmailAttachment
  config: RequiredAttachmentConfig
  configIndex: number
  index: number
}

/** A type of context. */
export enum ContextType {
  /** A context holding all environment information and references to environment objects. */
  ENV = "env",
  /** A context holding all processing information like the configuration, integration adapters, action registry and timer. */
  PROCESSING = "proc",
  /** A context holding the thread configuration and information about the currently processed thread. */
  THREAD = "thread",
  /** A context holding the message configuration and information about the currently processed message. */
  MESSAGE = "message",
  /** A context holding the attachment configuration and information about the currently processed attachment. */
  ATTACHMENT = "attachment",
}

export type EnvContext = {
  type: ContextType
  env: EnvInfo
  envMeta: MetaInfo
  log: Logger
  meta: MetaInfo
}
export type ProcessingContext = EnvContext & {
  proc: ProcessingInfo
  procMeta: MetaInfo
}
export type ThreadContext = ProcessingContext & {
  thread: ThreadInfo
  threadMeta: MetaInfo
}
export type MessageContext = ThreadContext & {
  message: MessageInfo
  messageMeta: MetaInfo
}
export type AttachmentContext = MessageContext & {
  attachment: AttachmentInfo
  attachmentMeta: MetaInfo
}

/** The result status of processing a config or an action. */
export enum ProcessingStatus {
  /** An error has occurred. */
  ERROR = "error",
  /** The processing was successful. */
  OK = "ok",
}

export class ProcessingError extends Error {
  constructor(
    message: string,
    public cause: ProcessingResult,
  ) {
    super(message)
  }
}

export type ActionExecution = {
  config: ActionConfig
  result?: ActionReturnType
}

export class ProcessingResult {
  error?: Error
  failedAction?: ActionExecution
  executedActions: ActionExecution[] = []
  processedAttachmentConfigs: number = 0
  processedAttachments: number = 0
  processedMessageConfigs: number = 0
  processedMessages: number = 0
  processedThreadConfigs: number = 0
  processedThreads: number = 0
  status: ProcessingStatus = ProcessingStatus.OK
}

export function newProcessingResult(): ProcessingResult {
  return new ProcessingResult()
}

export type Context =
  | EnvContext
  | ProcessingContext
  | ThreadContext
  | MessageContext
  | AttachmentContext
