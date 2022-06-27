import { ThreadRule } from "./ThreadRule"
import "reflect-metadata"
import { Type } from "class-transformer"

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
  public globalFilter = "has:attachment -in:trash -in:drafts -in:spam"
  /** Maximum batch size for thread search results */
  public maxBatchSize = 10
  /** Maximum script runtime in seconds (google scripts will be killed automatically after 6 minutes) */
  public maxRuntime = 280
  /** Only process message newer than (leave empty for no restriction; use d, m and y for day, month and year) */
  public newerThan = "1m"
  /** Gmail label for processed threads (will be created, if not existing) */
  public processedLabel = "to-gdrive/processed"
  /** Sleep time in milli seconds between processed messages */
  public sleepTime = 100
  /** Timezone for date/time operations */
  public timezone = "GMT"
  /** List of thread processing rules */
  @Type(() => ThreadRule)
  public threadRules: ThreadRule[] = []
}
