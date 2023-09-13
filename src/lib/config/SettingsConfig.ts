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

/**
 * The method to mark processed threads/messages/attachments.
 */
export enum MarkProcessedMethod {
  /**
   * Adds the label defined in the setting `markProcessedLabel` to each processed thread.
   *
   * **NOTE:**
   * - Automatically appends the action `thread.addLabel` to the list of global thread actions
   * - Automatically appends `-label:<markProcessedLabel>` to the global thread match query config
   *
   * **Limitations:**
   * - It cannot handle multiple messages per thread properly.
   */
  ADD_THREAD_LABEL = "add-label",
  /**
   * Doesn't do anything to mark threads, messages or attachments as processed and leaves this task to the user.
   *
   * **NOTE:**
   * - Use actions on the desired level (threads, messages or attachments) to mark them as processed.
   * - Take care to exclude them from queries in the thread match config, to prevent re-processing over and over again.
   *
   * **Limitations:**
   * - Is more complex since you have to take care to
   */
  CUSTOM = "custom",
  /**
   * Marks processed messages as read, which is more flexible than adding a thread label.
   * But it comes at the cost of marking messages as read, which may not be expected.
   *
   * **NOTE:**
   * - Automatically appends the action `message.markRead` to the list of global message actions
   * - Automatically appends `-is:read` to the global thread match query config
   * - Automatically adds `is: ["unread"]` to the global message match config
   *
   * **Limitations:**
   * - Since it marks messages as read it may not be applicable in all cases.
   */
  MARK_MESSAGE_READ = "mark-read",
  // /**
  //  * (Experimental) Adds labels to threads that track processed threads, messages or attachments.
  //  * This is the most flexible method, since it can track each state in a label.
  //  */
  // ADD_LABEL_METADATA = "add-label-metadata",
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
  logSheetLocation? = ""
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
   * The timezone to be used for date/time operations.
   * Value `default` uses the <a href="https://developers.google.com/apps-script/reference/base/session#getscripttimezone">script timezone</a>.
   */
  @Expose()
  timezone?: string = "default"
}

export function newSettingsConfig(
  json: SettingsConfig = {},
): RequiredDeep<SettingsConfig> {
  return plainToInstance(SettingsConfig, json, {
    exposeDefaultValues: true,
    exposeUnsetFields: false,
  }) as RequiredDeep<SettingsConfig>
}

export function essentialSettingsConfig(
  config: PartialDeep<SettingsConfig>,
): PartialDeep<SettingsConfig> {
  config = essentialObject(
    config,
    newSettingsConfig(),
    {},
    ["markProcessedMethod"], // TODO: Extract from class definition
  )
  return config
}
