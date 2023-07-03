import { ActionRegistry } from "./actions/ActionRegistry"
import { GDriveAdapter } from "./adapter/GDriveAdapter"
import { GmailAdapter } from "./adapter/GmailAdapter"
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
  /** Don't execute writing actions */
  DRY_RUN = "dry-run",
  /** Don't execute deleting actions */
  SAFE_MODE = "safe-mode",
  /**
   * Execute all actions including deletes.
   * ATTENTION: I know exactly what I'm doing when using this mode and won't complain if something goes wrong!
   */
  DANGEROUS = "dangerous",
}

/** The type of meta information used for context substitution placerholders. */
export enum MetaInfoType {
  /** Boolean type substituted to `true` or `false`. */
  BOOLEAN = "boolean",
  /** Date/time type. For substitution a format string can be given using `${<placeholder>:format:<formatstring>}`. */
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
type MetaInfoEntry = {
  description: string
  type: MetaInfoType
  value: MetaInfoValueType
}
export function newMetaInfo(
  type: MetaInfoType,
  value: MetaInfoValueType,
  description: string,
) {
  return {
    description,
    type,
    value,
  }
}
// export class MetaInfo extends Map<string, MetaInfoEntry> {}
export type MetaInfo = {
  [k: string]: MetaInfoEntry
}

type EnvInfo = {
  gmailApp: GoogleAppsScript.Gmail.GmailApp
  gdriveApp: GoogleAppsScript.Drive.DriveApp
  utilities: GoogleAppsScript.Utilities.Utilities
  spreadsheetApp: GoogleAppsScript.Spreadsheet.SpreadsheetApp
  cacheService: GoogleAppsScript.Cache.CacheService
  runMode: RunMode
  session: GoogleAppsScript.Base.Session
  timezone?: string
}

export type ProcessingInfo = {
  actionRegistry: ActionRegistry
  config: RequiredConfig
  gdriveAdapter: GDriveAdapter
  gmailAdapter: GmailAdapter
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
  ENV,
  /** A context holding all processing information like the configuration, integration adapters, action registry and timer. */
  PROCESSING,
  /** A context holding the thread configuration and information about the currently processed thread. */
  THREAD,
  /** A context holding the message configuration and information about the currently processed message. */
  MESSAGE,
  /** A context holding the attachment configuration and information about the currently processed attachment. */
  ATTACHMENT,
}

export type EnvContext = {
  type: ContextType
  env: EnvInfo
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
  /** An error has occured. */
  ERROR = "error",
  /** The processing was successful. */
  OK = "ok",
}

export class ProcessingError extends Error {
  constructor(message: string, public cause: ProcessingResult) {
    super(message)
  }
}

export type ProcessingResult = {
  status: ProcessingStatus
  performedActions: ActionConfig[]
  failedAction?: ActionConfig
  error?: Error
}
export function newProcessingResult(): ProcessingResult {
  return {
    status: ProcessingStatus.OK,
    performedActions: [],
  }
}
