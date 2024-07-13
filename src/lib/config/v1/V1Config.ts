import { Type, plainToInstance } from "class-transformer"
import "reflect-metadata"
import { PartialDeep } from "type-fest"
import { RequiredDeep } from "../../utils/UtilityTypes"
import { V1Rule } from "./V1Rule"

export class V1Config {
  /** Global filter */
  globalFilter? = "has:attachment -in:trash -in:drafts -in:spam"
  /** GMail label for processed threads (will be created, if not existing) */
  processedLabel = "to-gdrive/processed"
  /** Sleep time in milliseconds between processed messages */
  sleepTime = 100
  /** Maximum script runtime in seconds (google scripts will be killed after 5 minutes) */
  maxRuntime = 280
  /** Only process message newer than (leave empty for no restriction; use d, m and y for day, month and year) */
  newerThan = "2m"
  /** Timezone for date/time operations */
  timezone = "Etc/UTC"
  /** Processing rules */
  @Type(() => V1Rule)
  rules: V1Rule[] = []
}
export const defaultV1Config: V1Config = {
  globalFilter: "has:attachment -in:trash -in:drafts -in:spam",
  processedLabel: "to-gdrive/processed",
  sleepTime: 100,
  maxRuntime: 280,
  newerThan: "2m",
  timezone: "Etc/UTC",
  rules: [],
}

export type RequiredV1Config = RequiredDeep<V1Config>
export function newV1Config(
  json: PartialDeep<V1Config> = {},
): RequiredV1Config {
  const config = plainToInstance(V1Config, json, {
    exposeDefaultValues: true,
    exposeUnsetFields: false,
  }) as RequiredV1Config

  // Validate resulting config:
  if (config.rules.length < 1) {
    throw new Error(
      "No rules found - make sure there is at least one rule present!",
    )
  }

  return config
}
