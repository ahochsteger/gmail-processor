/**
 * Represents a settings config that affect the way GMail2GDrive works.
 */
export class SettingsConfig {
  /**
   * The maximum batch size of threads to process in a single run to respect Google processing limits
   */
  maxBatchSize = 10
  /**
   * The maximum runtime in seconds for a single run to respect Google processing limits
   */
  maxRuntime = 280
  /**
   * The label to be added to processed GMail threads
   */
  processedLabel = "to-gdrive/processed"
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
