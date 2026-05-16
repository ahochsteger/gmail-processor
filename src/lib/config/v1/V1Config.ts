import { z } from "zod"
import { V1RuleSchema } from "./V1Rule"

export const V1ConfigSchema = z.object({
  /** Global filter */
  globalFilter: z
    .string()
    .describe("Global filter")
    .optional()
    .default("has:attachment -in:trash -in:drafts -in:spam"),
  /** GMail label for processed threads (will be created, if not existing) */
  processedLabel: z
    .string()
    .describe(
      "GMail label for processed threads (will be created, if not existing)",
    ),
  /** Sleep time in milliseconds between processed messages */
  sleepTime: z
    .number()
    .describe("Sleep time in milliseconds between processed messages"),
  /** Maximum script runtime in seconds (google scripts will be killed after 5 minutes) */
  maxRuntime: z
    .number()
    .describe(
      "Maximum script runtime in seconds (google scripts will be killed after 5 minutes)",
    ),
  /** Only process message newer than (leave empty for no restriction; use d, m and y for day, month and year) */
  newerThan: z
    .string()
    .describe(
      "Only process message newer than (leave empty for no restriction; use d, m and y for day, month and year)",
    ),
  /** Timezone for date/time operations */
  timezone: z.string().describe("Timezone for date/time operations"),
  /** Processing rules */
  rules: z.array(V1RuleSchema).describe("Processing rules"),
})

export type V1Config = z.input<typeof V1ConfigSchema>
export type RequiredV1Config = z.output<typeof V1ConfigSchema>

export const defaultV1Config: V1Config = {
  globalFilter: "has:attachment -in:trash -in:drafts -in:spam",
  processedLabel: "to-gdrive/processed",
  sleepTime: 100,
  maxRuntime: 280,
  newerThan: "2m",
  timezone: "Etc/UTC",
  rules: [],
}

export function newV1Config(json: Partial<V1Config> = {}): RequiredV1Config {
  const config = V1ConfigSchema.parse({ ...defaultV1Config, ...json })

  // Validate resulting config:
  if (config.rules.length < 1) {
    throw new Error(
      "No rules found - make sure there is at least one rule present!",
    )
  }

  return config
}
