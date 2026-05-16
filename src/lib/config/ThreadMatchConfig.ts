import { z } from "zod"
import { essentialObject } from "../utils/ConfigUtils"

export const DEFAULT_GLOBAL_QUERY_PREFIX =
  "has:attachment -in:trash -in:drafts -in:spam"
export const DEFAULT_GLOBAL_QUERY_NEWER_THAN = "1d"
export const DEFAULT_GLOBAL_QUERY = `${DEFAULT_GLOBAL_QUERY_PREFIX} newer_than:${DEFAULT_GLOBAL_QUERY_NEWER_THAN}`

/**
 * Represents a config to match a certain GMail thread
 */
export const ThreadMatchConfigSchema = z.object({
  /** The regex to match `firstMessageSubject` */
  firstMessageSubject: z
    .string()
    .default(".*")
    .describe("The regex to match `firstMessageSubject`"),

  /** The regex to match at least one label */
  labels: z
    .string()
    .default(".*")
    .describe("The regex to match at least one label"),

  /**
   * The maximum number of messages a matching thread is allowed to have.
   * Set to `-1` to ignore it.
   */
  maxMessageCount: z
    .number()
    .default(-1)
    .describe(
      "The maximum number of messages a matching thread is allowed to have. Set to `-1` to ignore it.",
    ),

  /**
   * The minimum number of messages a matching thread must have.
   * Set to `-1` to ignore it.
   */
  minMessageCount: z
    .number()
    .default(1)
    .describe(
      "The minimum number of messages a matching thread must have. Set to `-1` to ignore it.",
    ),

  /**
   * The GMail search query to find threads to be processed.
   * The search query is composed of the global thread query with the query of individual thread configs appended.
   * In case no global query is set the built-in default `has:attachment -in:trash -in:drafts -in:spam newer_than:1d` is used.
   * See [Search operators you can use with Gmail](https://support.google.com/mail/answer/7190?hl=en) for more information.
   */
  query: z
    .string()
    .default(DEFAULT_GLOBAL_QUERY)
    .describe(
      "The GMail search query to find threads to be processed. See [Search operators you can use with Gmail](https://support.google.com/mail/answer/7190?hl=en) for more information.",
    ),
})

export type ThreadMatchConfig = z.input<typeof ThreadMatchConfigSchema>
export type RequiredThreadMatchConfig = z.output<typeof ThreadMatchConfigSchema>

export function newThreadMatchConfig(
  json: ThreadMatchConfig = {},
): RequiredThreadMatchConfig {
  return ThreadMatchConfigSchema.parse(json)
}

export function essentialThreadMatchConfig(
  config: ThreadMatchConfig,
): ThreadMatchConfig {
  config = essentialObject(config, newThreadMatchConfig())
  return config
}
