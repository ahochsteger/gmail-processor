import { Expose, plainToInstance } from "class-transformer"
import "reflect-metadata"
import { AttachmentActionConfigType } from "../actions/AttachmentActions"
import { GlobalActionConfigType } from "../actions/GlobalActions"
import { MessageActionConfigType } from "../actions/MessageActions"
import { ThreadActionConfigType } from "../actions/ThreadActions"
import { ConflictStrategy } from "../adapter/GDriveAdapter"
import { essentialObject } from "../utils/ConfigUtils"
import { RequiredDeep } from "../utils/UtilityTypes"

/**
 * The stage of action processing
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

export abstract class ActionConfig<
  TActionConfig extends ActionBaseConfig = ActionBaseConfig,
> {
  /**
   * The arguments for a certain action
   */
  @Expose()
  args?: TActionConfig["args"]

  /**
   * The description for the action
   */
  @Expose()
  description? = ""

  /**
   * The name of the action to be executed
   */
  @Expose()
  name: TActionConfig["name"] = ""

  /**
   * The processing stage in which the action should run (during main processing stage or pre-main/post-main)
   */
  @Expose()
  processingStage? = ProcessingStage.POST_MAIN
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
   * The description to be attached to the Google Drive file.
   * Supports placeholder substitution.
   */
  description?: string
  /**
   * Convert to a Google file type using one of the <a href="https://developers.google.com/drive/api/guides/mime-types?hl=en">supported mime-types by Google Drive</a>, like:
   * * `application/vnd.google-apps.document`: Google Docs
   * * `application/vnd.google-apps.presentation`: Google Slides
   * * `application/vnd.google-apps.spreadsheet`: Google Sheets
   */
  toMimeType?: string
}

export type StoreAndDecryptActionBaseArgs = StoreActionBaseArgs & {
  /**
   * The password to be used for password-protected PDFs.
   */
  password: string
  /**
   * The location (path + filename) of the decrypted Google Drive file.
   * For shared folders or Team Drives prepend the location with the folder ID like `{id:<folderId>}/...`.
   * Supports placeholder substitution.
   */
  decryptedPdfLocation: string
  /**
   * The description to be attached to the decrypted Google Drive file.
   * Supports placeholder substitution.
   */
  decryptedPdfDescription?: string
  /**
   * Whether to save the original file after decryption.
   */
  saveOriginal?: boolean
}

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

type CustomActionConfigType = ActionBaseConfig<`custom.${string}`>

type ProcessingContextActionConfigType =
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

/**
 * Represents a config to perform a actions for a GMail thread.
 */
export class ThreadActionConfig extends ActionConfig<ThreadContextActionConfigType> {}
export type RequiredThreadActionConfig = RequiredDeep<ThreadActionConfig>

/**
 * Represents a config to perform a actions for a GMail message.
 */
export class MessageActionConfig extends ActionConfig<MessageContextActionConfigType> {}
export type RequiredMessageActionConfig = RequiredDeep<MessageActionConfig>

/**
 * Represents a config to perform a actions for a GMail attachment.
 */
export class AttachmentActionConfig extends ActionConfig<AttachmentContextActionConfigType> {}
export type RequiredAttachmentActionConfig =
  RequiredDeep<AttachmentActionConfig>

export type ActionConfigType =
  | ThreadActionConfig
  | MessageActionConfig
  | AttachmentActionConfig

function newThreadActionConfig(
  json: ThreadActionConfig,
): RequiredThreadActionConfig {
  return plainToInstance(ThreadActionConfig, json, {
    exposeDefaultValues: true,
    exposeUnsetFields: false,
  }) as RequiredThreadActionConfig
}

function newMessageActionConfig(
  json: MessageActionConfig,
): RequiredMessageActionConfig {
  return plainToInstance(MessageActionConfig, json, {
    exposeDefaultValues: true,
    exposeUnsetFields: false,
  }) as RequiredMessageActionConfig
}

function newAttachmentActionConfig(
  json: AttachmentActionConfig,
): RequiredAttachmentActionConfig {
  return plainToInstance(AttachmentActionConfig, json, {
    exposeDefaultValues: true,
    exposeUnsetFields: false,
  }) as RequiredAttachmentActionConfig
}

export function essentialThreadActionConfig(
  config: ThreadActionConfig,
): ThreadActionConfig {
  config = essentialObject<ThreadActionConfig>(
    config,
    newThreadActionConfig({
      name: "thread.noop",
    }),
  )
  return config
}

export function essentialMessageActionConfig(
  config: MessageActionConfig,
): MessageActionConfig {
  config = essentialObject<MessageActionConfig>(
    config,
    newMessageActionConfig({ name: "message.noop" }),
  )
  return config
}

export function essentialAttachmentActionConfig(
  config: AttachmentActionConfig,
): AttachmentActionConfig {
  config = essentialObject<AttachmentActionConfig>(
    config,
    newAttachmentActionConfig({ name: "attachment.noop" }),
  )
  return config
}
