import { ActionRegistry } from "./actions/ActionRegistry"
import { AttachmentActions } from "./actions/AttachmentActions"
import { MessageActions } from "./actions/MessageActions"
import { ThreadActions } from "./actions/ThreadActions"
import { GDriveAdapter } from "./adapter/GDriveAdapter"
import { GmailAdapter } from "./adapter/GmailAdapter"
import { SpreadsheetAdapter } from "./adapter/SpreadsheetAdapter"
import { AttachmentConfig } from "./config/AttachmentConfig"
import { Config } from "./config/Config"
import { MessageConfig } from "./config/MessageConfig"
import { ThreadConfig } from "./config/ThreadConfig"
import { Timer } from "./utils/Timer"

export interface EnvContext {
  gmailApp: GoogleAppsScript.Gmail.GmailApp
  gdriveApp: GoogleAppsScript.Drive.DriveApp
  utilities: GoogleAppsScript.Utilities.Utilities
  spreadsheetApp: GoogleAppsScript.Spreadsheet.SpreadsheetApp
  cacheService: GoogleAppsScript.Cache.CacheService
  dryRun: boolean
  timer: Timer
}

export interface ProcessingContext extends EnvContext {
  actionRegistry: ActionRegistry
  config: Config
  gdriveAdapter: GDriveAdapter
  gmailAdapter: GmailAdapter
  spreadsheetAdapter: SpreadsheetAdapter
}

export interface ThreadContext extends ProcessingContext {
  thread: GoogleAppsScript.Gmail.GmailThread
  threadActions: ThreadActions
  threadConfig: ThreadConfig
  threadConfigIndex: number // TODO: Really required?
  threadIndex: number // TODO: Really required?
}

export interface MessageContext extends ThreadContext {
  message: GoogleAppsScript.Gmail.GmailMessage
  messageActions: MessageActions
  messageConfig: MessageConfig
  messageConfigIndex: number // TODO: Really required?
  messageIndex: number // TODO: Really required?
}

export interface AttachmentContext extends MessageContext {
  attachment: GoogleAppsScript.Gmail.GmailAttachment
  attachmentActions: AttachmentActions
  attachmentConfig: AttachmentConfig
  attachmentConfigIndex: number // TODO: Really required?
  attachmentIndex: number // TODO: Really required?
}
