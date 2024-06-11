import { Expose, plainToInstance } from "class-transformer"
import "reflect-metadata"
import { essentialObject } from "../utils/ConfigUtils"
import { RequiredDeep } from "../utils/UtilityTypes"

export const DEFAULT_GLOBAL_QUERY_PREFIX =
  "has:attachment -in:trash -in:drafts -in:spam"
export const DEFAULT_GLOBAL_QUERY_NEWER_THAN = "1d"
export const DEFAULT_GLOBAL_QUERY = `${DEFAULT_GLOBAL_QUERY_PREFIX} newer_than:${DEFAULT_GLOBAL_QUERY_NEWER_THAN}`

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
   * The maximum number of messages a matching thread is allowed to have.
   * Set to `-1` to ignore it.
   */
  @Expose()
  maxMessageCount? = -1

  /**
   * The minimum number of messages a matching thread must have.
   * Set to `-1` to ignore it.
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
  json: ThreadMatchConfig = {},
): RequiredThreadMatchConfig {
  json.query = json.query ?? DEFAULT_GLOBAL_QUERY // TODO: Move to normalizeThreadMatchConfig()
  return plainToInstance(ThreadMatchConfig, json, {
    exposeDefaultValues: true,
    exposeUnsetFields: false,
  }) as RequiredThreadMatchConfig
}

export function essentialThreadMatchConfig(
  config: ThreadMatchConfig,
): ThreadMatchConfig {
  config = essentialObject(config, newThreadMatchConfig())
  return config
}
