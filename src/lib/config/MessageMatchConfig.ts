import { plainToInstance } from "class-transformer"
import { PartialDeep } from "type-fest"
import { essentialObject } from "../utils/ConfigUtils"
import { RequiredDeep } from "../utils/UtilityTypes"
import { MessageFlag } from "./MessageFlag"

/**
 * Represents a config to match a certain GMail message
 */
export class MessageMatchConfig {
  /**
   * A RegEx matching the body of messages.
   * Use `(?s)` at the beginning of the regex if you want `.` to match a newline.
   */
  body? = ".*"
  /**
   * A RegEx matching the sender email address of messages
   */
  from? = ".*"
  /**
   * A list of properties matching messages should have
   */
  is?: MessageFlag[] = []
  /**
   * An RFC 3339 date/time format matching messages older than the given date/time
   */
  newerThan? = ""
  /**
   * An RFC 3339 date/time format matching messages older than the given date/time
   */
  olderThan? = ""
  /**
   * A RegEx matching the plain body of messages.
   * Use `(?s)` at the beginning of the regex if you want `.` to match a newline.
   */
  plainBody? = ".*"
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

export function newMessageMatchConfig(
  json: PartialDeep<MessageMatchConfig> = {},
): RequiredMessageMatchConfig {
  return plainToInstance(MessageMatchConfig, json, {
    exposeDefaultValues: true,
    exposeUnsetFields: false,
  }) as RequiredMessageMatchConfig
}

export function essentialMessageMatchConfig(
  config: PartialDeep<MessageMatchConfig>,
): PartialDeep<MessageMatchConfig> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config = essentialObject(config as any, newMessageMatchConfig() as any)
  return config
}
