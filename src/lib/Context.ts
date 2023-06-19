import { ActionRegistry } from "./actions/ActionRegistry"
import { GDriveAdapter } from "./adapter/GDriveAdapter"
import { GmailAdapter } from "./adapter/GmailAdapter"
import { SpreadsheetAdapter } from "./adapter/SpreadsheetAdapter"
import { ActionConfig } from "./config/ActionConfig"
import { RequiredAttachmentConfig } from "./config/AttachmentConfig"
import { RequiredConfig } from "./config/Config"
import { RequiredMessageConfig } from "./config/MessageConfig"
import { RequiredThreadConfig } from "./config/ThreadConfig"
import { Logger } from "./utils/Logger"
import { Timer } from "./utils/Timer"

export enum RunMode {
  /** Don't execute writing actions */
  DRY_RUN = "dry-run",
  /** Don't execute deleting actions */
  SAFE_MODE = "safe-mode",
  /** Execute all actions including deletes. I know exactly what I'm doing and won't complain if something goes wrong! */
  DANGEROUS = "dangerous",
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

type ProcessingInfo = {
  actionRegistry: ActionRegistry
  config: RequiredConfig
  gdriveAdapter: GDriveAdapter
  gmailAdapter: GmailAdapter
  spreadsheetAdapter: SpreadsheetAdapter
  timer: Timer
}

type ThreadInfo = {
  object: GoogleAppsScript.Gmail.GmailThread
  config: RequiredThreadConfig
  configIndex: number
  index: number
}

type MessageInfo = {
  object: GoogleAppsScript.Gmail.GmailMessage
  config: RequiredMessageConfig
  configIndex: number
  index: number
}

type AttachmentInfo = {
  object: GoogleAppsScript.Gmail.GmailAttachment
  config: RequiredAttachmentConfig
  configIndex: number
  index: number
}

export type EnvContext = { env: EnvInfo; log: Logger }
export type ProcessingContext = EnvContext & { proc: ProcessingInfo }
export type ThreadContext = ProcessingContext & { thread: ThreadInfo }
export type MessageContext = ThreadContext & { message: MessageInfo }
export type AttachmentContext = MessageContext & { attachment: AttachmentInfo }

export enum ProcessingStatus {
  ERROR = "error",
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
