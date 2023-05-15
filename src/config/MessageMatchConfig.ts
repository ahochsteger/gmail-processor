import { instanceToPlain, plainToInstance } from "class-transformer"
import { RequiredDeep } from "../utils/UtilityTypes"
import { MessageFlag } from "./MessageFlag"

/**
 * Represents a config to match a certain GMail message
 */
export class MessageMatchConfig {
  from? = ".*"
  /**
   * A list of properties matching messages should have
   */
  is?: MessageFlag[] = []
  /**
   * A relative date/time according to https://github.com/cmaurer/relative.time.parser#readme or an RFC 3339 date/time format matching messages newer than the given date/time
   */
  newerThan? = ""
  /**
   * An RFC 3339 date/time format matching messages older than the given date/time
   */
  olderThan? = ""
  /**
   * A RegEx matching the subject of messages
   */
  subject? = ".*"
  /**
   * A RegEx matching the recipient email address of messages
   */
  to? = ".*"
}

export type RequiredMessageMatchConfig = RequiredDeep<MessageMatchConfig>

export function jsonToMessageMatchConfig(
  json: Record<string, unknown>,
): RequiredMessageMatchConfig {
  return plainToInstance(MessageMatchConfig, json, {
    exposeDefaultValues: true,
    exposeUnsetFields: false,
  }) as RequiredMessageMatchConfig
}

export function messageMatchConfigToJson<T = MessageMatchConfig>(
  config: T,
  withDefaults = false,
): Record<string, unknown> {
  return instanceToPlain(config, {
    exposeDefaultValues: withDefaults,
  })
}

export function newMessageMatchConfig(
  json: Record<string, unknown> = {},
): RequiredMessageMatchConfig {
  return jsonToMessageMatchConfig(json)
}
