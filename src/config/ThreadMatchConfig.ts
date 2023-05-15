import { Expose, instanceToPlain, plainToInstance } from "class-transformer"
import "reflect-metadata"
import { RequiredDeep } from "../utils/UtilityTypes"

/**
 * Represents a config to match a certain GMail thread
 */
export class ThreadMatchConfig {
  /**
   * The GMail search query to find threads to be processed (see http://support.google.com/mail/bin/answer.py?hl=en&answer=7190 for details)
   */
  @Expose()
  query? = ""
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
   * Only process threads with message newer than (leave empty for no restriction; use d, m and y for day, month and year)
   */
  @Expose()
  newerThan? = ""
}

export type RequiredThreadMatchConfig = RequiredDeep<ThreadMatchConfig>

export function jsonToThreadMatchConfig(
  json: Record<string, unknown>,
): RequiredThreadMatchConfig {
  return plainToInstance(ThreadMatchConfig, json, {
    exposeDefaultValues: true,
    exposeUnsetFields: false,
  }) as RequiredThreadMatchConfig
}

export function threadMatchConfigToJson<T = ThreadMatchConfig>(
  config: T,
  withDefaults = false,
): Record<string, unknown> {
  return instanceToPlain(config, {
    exposeDefaultValues: withDefaults,
  })
}

export function newThreadMatchConfig(
  json: Record<string, unknown> = {},
): RequiredThreadMatchConfig {
  return jsonToThreadMatchConfig(json)
}
