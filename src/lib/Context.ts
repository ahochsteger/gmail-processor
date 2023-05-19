import { ActionArgsType, ActionRegistry } from "./actions/ActionRegistry"
import { GDriveAdapter } from "./adapter/GDriveAdapter"
import { GmailAdapter } from "./adapter/GmailAdapter"
import { SpreadsheetAdapter } from "./adapter/SpreadsheetAdapter"
import { RequiredAttachmentConfig } from "./config/AttachmentConfig"
import { RequiredConfig } from "./config/Config"
import { RequiredMessageConfig } from "./config/MessageConfig"
import { RequiredThreadConfig } from "./config/ThreadConfig"
import { Logger } from "./utils/Logging"
import { Timer } from "./utils/Timer"

export enum RunMode {
  /** Don't execute writing actions */
  DRY_RUN = "dry-run",
  /** Don't execute deleting actions */
  SAFE_MODE = "safe-mode",
  /** Execute all actions including deletes. I know exactly what I'm doing and won't complain if something goes wrong! */
  DANGEROUS = "dangerous",
}

export type EnvInfo = {
  gmailApp: GoogleAppsScript.Gmail.GmailApp
  gdriveApp: GoogleAppsScript.Drive.DriveApp
  utilities: GoogleAppsScript.Utilities.Utilities
  spreadsheetApp: GoogleAppsScript.Spreadsheet.SpreadsheetApp
  cacheService: GoogleAppsScript.Cache.CacheService
  runMode: RunMode
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

export type EnvContext = { env: EnvInfo; log: Logger }
export type ProcessingContext = EnvContext & { proc: ProcessingInfo }
export type ThreadContext = ProcessingContext & { thread: ThreadInfo }
export type MessageContext = ThreadContext & { message: MessageInfo }
export type AttachmentContext = MessageContext & { attachment: AttachmentInfo }

export type PerformedAction = {
  name: string
  args: ActionArgsType
}
export type ProcessingResult = {
  status: "ok" | "error"
  performedActions: PerformedAction[]
}
