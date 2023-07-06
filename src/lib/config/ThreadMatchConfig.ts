import { Expose, plainToInstance } from "class-transformer"
import "reflect-metadata"
import { PartialDeep } from "type-fest"
import { RequiredDeep } from "../utils/UtilityTypes"
import { DEFAULT_GLOBAL_QUERY } from "./GlobalConfig"

/**
 * Represents a config to match a certain GMail thread
 */
export class ThreadMatchConfig {
  /** The regex to match `firstMessageSubject` */
  @Expose()
  firstMessageSubject? = ".*"

  /** The regex to match at least one label */
  @Expose()
  labels? = ".*"

  /**
   * The maximum number of messages a matching thread is allowed to have
   */
  @Expose()
  maxMessageCount? = -1

  /**
   * The minimum number of messages a matching thread must have
   */
  @Expose()
  minMessageCount? = 1

  /**
   * The GMail search query additional to the global query to find threads to be processed.
   * See [Search operators you can use with Gmail](https://support.google.com/mail/answer/7190?hl=en) for more information.
   */
  @Expose()
  query? = ""
}

export type RequiredThreadMatchConfig = RequiredDeep<ThreadMatchConfig>

export function newThreadMatchConfig(
  json: PartialDeep<ThreadMatchConfig> = {},
): RequiredThreadMatchConfig {
  json.query = json.query ?? DEFAULT_GLOBAL_QUERY // TODO: Move to normalizeThreadMatchConfig()
  return plainToInstance(ThreadMatchConfig, json, {
    exposeDefaultValues: true,
    exposeUnsetFields: false,
  }) as RequiredThreadMatchConfig
}
