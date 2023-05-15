import { Expose, instanceToPlain, plainToInstance } from "class-transformer"
import "reflect-metadata"
import { RequiredDeep } from "../utils/UtilityTypes"

// TODO: Use these constants in SettingsConfig below, when typescript-json-schema bug is resolved.
// See https://github.com/YousefED/typescript-json-schema/issues/336#issuecomment-1528969616
export const DEFAULT_SETTING_BATCH_SIZE = 10
export const DEFAULT_SETTING_MAX_RUNTIME = 280
export const DEFAULT_SETTING_SLEEP_TIME_THREADS = 100

/**
 * Represents a settings config that affect the way GMail2GDrive works.
 */
export class SettingsConfig {
  /**
   * Path of the spreadsheet log file
   */
  @Expose()
  logSheetFile? = "Gmail2GDrive/Gmail2GDrive-logs"
  /**
   * Folder ID of the spreadsheet log file in case of a shared drive (instead of logSheetFile)
   */
  @Expose()
  logSheetFolderId? = ""
  /**
   * The maximum batch size of threads to process in a single run to respect Google processing limits
   */
  @Expose()
  maxBatchSize? = 10
  /**
   * The maximum runtime in seconds for a single run to respect Google processing limits
   */
  @Expose()
  maxRuntime? = 280
  /**
   * The label to be added to processed GMail threads (only for markProcessedMode="label", deprecated - only for compatibility to v1)
   */
  @Expose()
  processedLabel? = "to-gdrive/processed"
  /**
   * The mode to mark processed threads/messages.
   * * `label`: Add the label from `processedLabel` to the thread. This is just for compatibility to v1 and is limited to one message per thread.
   * * `read`: Mark the message as read. This is the new default since it provides more flexibility esp. when threads contain multiple messages.
   */
  @Expose()
  processedMode?: "label" | "read" = "read"
  /**
   * The sleep time in milliseconds between processing each thread
   */
  @Expose()
  sleepTimeThreads? = 100
  /**
   * The sleep time in milliseconds between processing each message
   */
  @Expose()
  sleepTimeMessages? = 0
  /**
   * The sleep time in milliseconds between processing each attachment
   */
  @Expose()
  sleepTimeAttachments? = 0
  /**
   * Overrides the <a href="https://developers.google.com/apps-script/reference/base/session#getscripttimezone">script timezone</a>, which is used by default.
   */
  @Expose()
  timezone?: string
}

export type RequiredSettingsConfig = RequiredDeep<SettingsConfig>

export function jsonToSettingsConfig(
  json: Record<string, unknown>,
): RequiredSettingsConfig {
  return plainToInstance(SettingsConfig, json, {
    exposeDefaultValues: true,
    exposeUnsetFields: false,
  }) as RequiredSettingsConfig
}

export function settingsConfigToJson<T = SettingsConfig>(
  config: T,
  withDefaults = false,
): Record<string, unknown> {
  return instanceToPlain(config, {
    exposeDefaultValues: withDefaults,
  })
}

export function newSettingsConfig(
  json: Record<string, unknown> = {},
): RequiredSettingsConfig {
  return jsonToSettingsConfig(json)
}