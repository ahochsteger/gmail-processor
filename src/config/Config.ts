import { ThreadRule } from "./ThreadRule"

/**
 * @example
 * {
 *     globalFilter: "-in:trash -in:drafts -in:spam",
 *     maxRuntime: 280,
 *     newerThan: "1m",
 *     processedLabel: "to-gdrive/processed",
 *     sleepTime: 100,
 *     timezone: "GMT",
 *     threadRules: [ ... ],
 * }
 */
export class Config {
  /** Global Gmail search filter */
  public globalFilter = "-in:trash -in:drafts -in:spam"
  /** Maximum batch size for thread search results */
  public maxBatchSize = 10
  /** Maximum script runtime in seconds (google scripts will be killed automatically after 6 minutes) */
  public maxRuntime = 300
  /** Only process message newer than (leave empty for no restriction; use d, m and y for day, month and year) */
  public newerThan = "1m"
  /** Gmail label for processed threads (will be created, if not existing) */
  public processedLabel = "to-gdrive/processed"
  /** Sleep time in milli seconds between processed messages */
  public sleepTime = 100
  /** Timezone for date/time operations */
  public timezone = "GMT"
  /** List of thread processing rules */
  public threadRules: ThreadRule[] = []

  constructor(settings: any, ruleConfigs: any[]) {
    this.globalFilter = settings.globalFilter
      ? settings.globalFilter
      : this.globalFilter
    this.maxRuntime = settings.maxRuntime
      ? settings.maxRuntime
      : this.maxRuntime
    this.newerThan = settings.newerThan ? settings.newerThan : this.newerThan
    this.processedLabel = settings.processedLabel
      ? settings.processedLabel
      : this.processedLabel
    this.sleepTime = settings.sleepTime ? settings.sleepTime : this.sleepTime
    this.timezone = settings.timezone ? settings.timezone : this.timezone
    for (const ruleConfig of ruleConfigs) {
      this.threadRules.push(new ThreadRule(ruleConfig))
    }
  }
}
