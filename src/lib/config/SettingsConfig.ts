import { Expose, plainToInstance } from "class-transformer"
import "reflect-metadata"
import { PartialDeep } from "type-fest"
import { essentialObject } from "../utils/ConfigUtils"
import { RequiredDeep } from "../utils/UtilityTypes"

// TODO: Use these constants in SettingsConfig below, when typescript-json-schema bug is resolved.
// See https://github.com/YousefED/typescript-json-schema/issues/336#issuecomment-1528969616
export const DEFAULT_SETTING_MAX_BATCH_SIZE = 10
export const DEFAULT_SETTING_MAX_RUNTIME = 280
export const DEFAULT_SETTING_SLEEP_TIME_THREADS = 100

type LocationType = string

/**
 * The method to mark processed threads/messages.
 */
export enum MarkProcessedMethod {
  /** (deprecated): Adds the label set using `markProcessedLabel` to the thread.
   * ATTENTION: This method is just for compatibility with v1 configs and does not support multiple messages per thread!
   */
  ADD_THREAD_LABEL = "add-label",
  /**
   * Mark the message as read.
   * This is the new default since it provides more flexibility esp. when threads contain multiple messages.
   */
  MARK_MESSAGE_READ = "mark-read",
}

/**
 * Represents a settings config that affect the way GmailProcessor works.
 */
export class SettingsConfig {
  /**
   * Path of the spreadsheet log file. Enables logging to a spreadsheet if not empty.
   * Example: `GmailProcessor/logsheet-${date.now:format:yyyy-MM}`
   */
  @Expose()
  logSheetLocation?: LocationType = ""
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
  markProcessedLabel? = ""
  /**
   * The method to mark processed threads/messages.
   */
  @Expose()
  markProcessedMethod?: MarkProcessedMethod =
    MarkProcessedMethod.MARK_MESSAGE_READ
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

export function newSettingsConfig(
  json: PartialDeep<SettingsConfig> = {},
): RequiredDeep<SettingsConfig> {
  return plainToInstance(SettingsConfig, json, {
    exposeDefaultValues: true,
    exposeUnsetFields: false,
  }) as RequiredDeep<SettingsConfig>
}

export function essentialSettingsConfig(
  config: PartialDeep<SettingsConfig>,
): PartialDeep<SettingsConfig> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config = essentialObject(config as any, newSettingsConfig() as any)
  return config
}
