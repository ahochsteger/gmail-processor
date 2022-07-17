import { ConfigBase, Model } from "./ConfigBase"

/**
 * Represents a config to match a certain GMail thread
 */
@Model
export class ThreadMatchConfig extends ConfigBase<ThreadMatchConfig> {
  /**
   * The GMail search query to find threads to be processed (see http://support.google.com/mail/bin/answer.py?hl=en&answer=7190 for details)
   */
  query = ""
  /**
   * The maximum number of messages a matching thread is allowed to have
   */
  maxMessageCount = -1
  /**
   * The minimum number of messages a matching thread must have
   */
  minMessageCount = 1
  /**
   * Only process threads with message newer than (leave empty for no restriction; use d, m and y for day, month and year)
   */
  newerThan = "1m"
}
