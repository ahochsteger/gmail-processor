/**
 * Represents a settings config that affect the way GMail2GDrive works.
 */
export class SettingsConfig {
  /**
   * Path of the spreadsheet log file
   */
  logSheetFile = "Gmail2GDrive/Gmail2GDrive-logs"
  /**
   * Folder ID in case of a shared drive
   */
  logSheetFolderId = ""
  /**
   * The maximum batch size of threads to process in a single run to respect Google processing limits
   */
  maxBatchSize = 10
  /**
   * The maximum runtime in seconds for a single run to respect Google processing limits
   */
  maxRuntime = 280
  /**
   * The label to be added to processed GMail threads (only for markProcessedMode="label", deprecated - only for compatibility to v1)
   */
  processedLabel = "to-gdrive/processed"
  /**
   * The mode to mark processed threads/messages.
   * * `label`: Add the label from `processedLabel` to the thread. This is just for compatibility to v1 and is limited to one message per thread.
   * * `read`: Mark the message as read. This is the new default since it provides more flexibility esp. when threads contain multiple messages.
   */
  processedMode: "label" | "read" = "read"
  /**
   * The sleep time in milliseconds between processing each thread
   */
  sleepTimeThreads = 100
  /**
   * The sleep time in milliseconds between processing each message
   */
  sleepTimeMessages = 0
  /**
   * The sleep time in milliseconds between processing each attachment
   */
  sleepTimeAttachments = 0
  /**
   * The timezone used for formatting file and folder names
   */
  timezone = "UTC"
}