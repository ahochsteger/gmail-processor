import { ActionRegistry } from "./actions/ActionRegistry"
import { GDriveAdapter } from "./adapter/GDriveAdapter"
import { GmailAdapter } from "./adapter/GmailAdapter"
import { SpreadsheetAdapter } from "./adapter/SpreadsheetAdapter"
import { AttachmentConfig } from "./config/AttachmentConfig"
import { Config } from "./config/Config"
import { MessageConfig } from "./config/MessageConfig"
import { ThreadConfig } from "./config/ThreadConfig"
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
  config: Config
  gdriveAdapter: GDriveAdapter
  gmailAdapter: GmailAdapter
  spreadsheetAdapter: SpreadsheetAdapter
  timer: Timer
}

export type ThreadInfo = {
  object: GoogleAppsScript.Gmail.GmailThread
  config: ThreadConfig
  configIndex: number
  index: number
}

export type MessageInfo = {
  object: GoogleAppsScript.Gmail.GmailMessage
  config: MessageConfig
  configIndex: number
  index: number
}

export type AttachmentInfo = {
  object: GoogleAppsScript.Gmail.GmailAttachment
  config: AttachmentConfig
  configIndex: number
  index: number
}

export type EnvContext = { env: EnvInfo }
export type ProcessingContext = EnvContext & { proc: ProcessingInfo }
export type ThreadContext = ProcessingContext & { thread: ThreadInfo }
export type MessageContext = ThreadContext & { message: MessageInfo }
export type AttachmentContext = MessageContext & { attachment: AttachmentInfo }