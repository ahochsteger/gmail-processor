import { z } from "zod"
import { essentialObject } from "../utils/ConfigUtils"
import { MessageFlag } from "./MessageFlag"

/**
 * Represents a config to match a certain GMail message
 */
export const MessageMatchConfigSchema = z.object({
  /**
   * A RegEx matching the body of messages.
   * Use `(?s)` at the beginning of the regex if you want `.` to match a newline.
   */
  body: z
    .string()
    .default(".*")
    .describe(
      "A RegEx matching the body of messages. Use `(?s)` at the beginning of the regex if you want `.` to match a newline.",
    ),
  /**
   * A RegEx matching the sender email address of messages
   */
  from: z
    .string()
    .default(".*")
    .describe("A RegEx matching the sender email address of messages"),
  /**
   * A list of properties matching messages should have
   */
  is: z
    .array(z.nativeEnum(MessageFlag))
    .default([])
    .describe("A list of properties matching messages should have"),
  /**
   * An RFC 3339 date/time format matching messages older than the given date/time
   */
  newerThan: z
    .string()
    .default("")
    .describe(
      "An RFC 3339 date/time format matching messages older than the given date/time",
    ),
  /**
   * An RFC 3339 date/time format matching messages older than the given date/time
   */
  olderThan: z
    .string()
    .default("")
    .describe(
      "An RFC 3339 date/time format matching messages older than the given date/time",
    ),
  /**
   * A RegEx matching the plain body of messages.
   * Use `(?s)` at the beginning of the regex if you want `.` to match a newline.
   */
  plainBody: z
    .string()
    .default(".*")
    .describe(
      "A RegEx matching the plain body of messages. Use `(?s)` at the beginning of the regex if you want `.` to match a newline.",
    ),
  /**
   * A RegEx matching the raw headers of messages.
   * Use `(?s)` at the beginning of the regex if you want `.` to match a newline.
   */
  rawHeaders: z
    .string()
    .default(".*")
    .describe(
      "A RegEx matching the raw headers of messages. Use `(?s)` at the beginning of the regex if you want `.` to match a newline.",
    ),
  /**
   * A RegEx matching the subject of messages
   */
  subject: z
    .string()
    .default(".*")
    .describe("A RegEx matching the subject of messages"),
  /**
   * A RegEx matching the recipient email address of messages
   */
  to: z
    .string()
    .default(".*")
    .describe("A RegEx matching the recipient email address of messages"),
})

export type MessageMatchConfig = z.input<typeof MessageMatchConfigSchema>
export type RequiredMessageMatchConfig = z.output<
  typeof MessageMatchConfigSchema
>

export function newMessageMatchConfig(
  json: MessageMatchConfig = {},
): RequiredMessageMatchConfig {
  return MessageMatchConfigSchema.parse(json)
}

export function essentialMessageMatchConfig(
  config: MessageMatchConfig,
): MessageMatchConfig {
  config = essentialObject(config, newMessageMatchConfig())
  return config
}
