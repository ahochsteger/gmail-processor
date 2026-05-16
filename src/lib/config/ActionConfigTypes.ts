import { LogLevel } from "./SettingsConfig"

/**
 * The processing stage in which the action should run (during main processing stage or pre-main/post-main).
 */
export enum ProcessingStage {
  /** The stage before processing the main object (thread, message, attachment) */
  PRE_MAIN = "pre-main",
  /** The stage during processing the main object (thread, message, attachment) */
  MAIN = "main",
  /** The stage after processing the main object (thread, message, attachment) */
  POST_MAIN = "post-main",
}

export type ActionBaseConfig<TName extends string = string, TArgs = unknown> = {
  args?: TArgs
  description?: string
  name: TName
  processingStage?: ProcessingStage
}

export type GlobalActionLoggingBase = {
  /**
   * The level of the log message (default: `info`).
   */
  level?: LogLevel
  /**
   * The location of the log message
   */
  location?: string
  /**
   * The message to be logged.
   */
  message: string
}

export type GlobalActionConfigType =
  | ActionBaseConfig<"global.noop">
  | ActionBaseConfig<"global.log", GlobalActionLoggingBase>
  | ActionBaseConfig<"global.panic", GlobalActionLoggingBase>
  | ActionBaseConfig<"global.sheetLog", GlobalActionLoggingBase>

export type ThreadActionLabelArgs = {
  /** The name of the label. */
  name: string
}

export type ThreadActionConfigLabel<TName extends string = string> =
  ActionBaseConfig<TName, ThreadActionLabelArgs>

/**
 * Strategy that defines how to deal in case of conflicts with already existing files at the desired location in Google Drive.
 */
export enum ConflictStrategy {
  /** Create a backup of the existing file by renaming it. */
  BACKUP = "backup",
  /** Terminate processing with an error. */
  ERROR = "error",
  /** Increment the file name if a file already exists. */
  INCREMENT = "increment",
  /** Keep the existing file and create the new one with the same name. */
  KEEP = "keep",
  /** Replace the existing file with the new one. */
  REPLACE = "replace",
  /** Skip creating the new file and keep the existing one. */
  SKIP = "skip",
  /** Update the existing file with the contents of the new one (keep it's file ID). */
  UPDATE = "update",
}

export type StoreActionBaseArgs = {
  /**
   * The location (path + filename) of the Google Drive file.
   * For shared folders or Team Drives prepend the location with the folder ID like `{id:<folderId>}/...`.
   * Supports placeholder substitution.
   */
  location: string
  /**
   * The strategy to be used in case a file already exists at the desired location.
   */
  conflictStrategy: ConflictStrategy
  /**
   * The prefix to be used for the increment number in case of ConflictStrategy.INCREMENT.
   * Typical naming conventions: `_` for file_1.txt, ` (` for file (1).txt
   * Default: ` (`
   */
  incrementPrefix?: string
  /**
   * The suffix to be used for the increment number in case of ConflictStrategy.INCREMENT.
   * Typical naming conventions: empty string for file_1.txt, `)` for file (1).txt
   * Default: `)`
   */
  incrementSuffix?: string
  /**
   * The starting number to be used for the increment number in case of ConflictStrategy.INCREMENT.
   * Default: `1`
   */
  incrementStart?: number
  /**
   * The description to be attached to the Google Drive file.
   * Supports placeholder substitution.
   */
  description?: string
  /**
   * Convert to a Google file type using one of the [supported mime-types by Google Drive](https://developers.google.com/drive/api/guides/mime-types?hl=en), like:
   * * `application/vnd.google-apps.document`: Google Docs
   * * `application/vnd.google-apps.presentation`: Google Slides
   * * `application/vnd.google-apps.spreadsheet`: Google Sheets
   */
  toMimeType?: string
}

export type ExportOptionsType = {
  /** Embed attachments (default: `true`) */
  embedAttachments?: boolean
  /** Embed an avatar (from Gravatar) of the sender (default: `true`) */
  embedAvatar?: boolean
  /** Embed inline images (default: `true`) */
  embedInlineImages?: boolean
  /** Embed remote images (default: `true`) */
  embedRemoteImages?: boolean
  /** The message ID to start the export from (for thread exports). */
  fromMessageId?: string
  /** Include attachments (default: `true`) */
  includeAttachments?: boolean
  /** Include the message header (default: `true`) */
  includeHeader?: boolean
  /** The width (in px) of the message (default: `700`) */
  width?: number
}

export type ThreadActionExportArgs = StoreActionBaseArgs & ExportOptionsType
export type ThreadActionConfigExport<TName extends string = string> =
  ActionBaseConfig<TName, ThreadActionExportArgs>

export type ThreadActionArgsStorePDF = StoreActionBaseArgs & {
  /** Skip the header if `true`. */
  skipHeader?: boolean
}
export type ThreadActionConfigStorePDF<TName extends string = string> =
  ActionBaseConfig<TName, ThreadActionArgsStorePDF>

export type ThreadActionConfigType =
  | ActionBaseConfig<"thread.noop">
  | ThreadActionConfigLabel<"thread.addLabel">
  | ThreadActionConfigExport<"thread.exportAsHtml">
  | ThreadActionConfigExport<"thread.exportAsPdf">
  | ThreadActionConfigLabel<"thread.removeLabel">
  | ThreadActionConfigStorePDF<"thread.storePDF">
  | ActionBaseConfig<"thread.markImportant">
  | ActionBaseConfig<"thread.markRead">
  | ActionBaseConfig<"thread.markUnimportant">
  | ActionBaseConfig<"thread.markUnread">
  | ActionBaseConfig<"thread.moveToArchive">
  | ActionBaseConfig<"thread.moveToInbox">
  | ActionBaseConfig<"thread.moveToSpam">
  | ActionBaseConfig<"thread.moveToTrash">

export type MessageActionForwardArgs = {
  /** The recipient of the forwarded message. */
  to: string
}
export type MessageActionConfigForward<TName extends string = string> =
  ActionBaseConfig<TName, MessageActionForwardArgs>
export type MessageActionStorePDFArgs = StoreActionBaseArgs & {
  /**
   * Skip the header if `true`.
   */
  skipHeader?: boolean
}
export type MessageActionConfigStorePDF<TName extends string = string> =
  ActionBaseConfig<TName, MessageActionStorePDFArgs>
export type MessageActionExportArgs = StoreActionBaseArgs & ExportOptionsType
export type MessageActionConfigExport<TName extends string = string> =
  ActionBaseConfig<TName, MessageActionExportArgs>
export type MessageActionStoreFromUrlArgs = StoreActionBaseArgs & {
  /**
   * The URL to download the content from.
   * Supports placeholder substitution.
   */
  url: string
  /**
   * Optional headers to include in the request.
   */
  headers?: Record<string, string>
}
export type MessageActionConfigStoreFromURL<TName extends string = string> =
  ActionBaseConfig<TName, MessageActionStoreFromUrlArgs>

export type MessageActionConfigType =
  | ActionBaseConfig<"message.noop">
  | MessageActionConfigForward<"message.forward">
  | MessageActionConfigStoreFromURL<"message.storeFromURL">
  | MessageActionConfigExport<"message.exportAsHtml">
  | MessageActionConfigExport<"message.exportAsPdf">
  | MessageActionConfigStorePDF<"message.storePDF">
  | ActionBaseConfig<"message.markRead">
  | ActionBaseConfig<"message.markUnread">
  | ActionBaseConfig<"message.moveToTrash">
  | ActionBaseConfig<"message.star">
  | ActionBaseConfig<"message.unstar">

export type AttachmentExtractTextArgs = {
  /**
   * Hints at the language to use for OCR. Valid values are BCP 47 codes.
   * Default: (unset, auto-detects the language)
   */
  language?: string
  /**
   * The location of the (temporary) Google Docs file containing the extracted OCR text, in case it should be stored in addition to further processing.
   * Supports placeholder substitution.
   * Default: (unset)
   */
  docsFileLocation?: string
  /**
   * A regular expression that defines which values should be extracted.
   * It is recommended to use the named group syntax `(?<name>...)` to reference the extracted values using names like `{{attachment.extracted.name}}`.
   */
  extract?: string
}

export type StoreDecryptedPdfActionArgs = StoreActionBaseArgs & {
  /**
   * The password to be used for PDF decryption.
   */
  password: string
}

export type AttachmentActionConfigType =
  | ActionBaseConfig<"attachment.noop">
  | ActionBaseConfig<"attachment.extractText", AttachmentExtractTextArgs>
  | ActionBaseConfig<"attachment.store", StoreActionBaseArgs>
  | ActionBaseConfig<
      "attachment.storeDecryptedPdf",
      StoreDecryptedPdfActionArgs
    >

export type CustomActionConfigType = ActionBaseConfig<`custom.${string}`>

export type ProcessingContextActionConfigType =
  | CustomActionConfigType
  | GlobalActionConfigType
export type ThreadContextActionConfigType =
  | ProcessingContextActionConfigType
  | ThreadActionConfigType
export type MessageContextActionConfigType =
  | ThreadContextActionConfigType
  | MessageActionConfigType
export type AttachmentContextActionConfigType =
  | MessageContextActionConfigType
  | AttachmentActionConfigType
