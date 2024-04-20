import { Config } from "../lib/config/Config"
import { V1Config } from "../lib/config/v1/V1Config"

export type SchemaVersion = "v1" | "v2"

type ExampleCategory =
  | "actions"
  | "advanced"
  | "basics"
  | "features"
  | "migrations"
  | "regressions"
type ExampleGenerator = "docs" | "test-e2e" | "test-spec"

export type ExampleInfo = {
  name: string
  title: string
  description: string
  issues?: number[]
  pullRequests?: number[]
  generate?: ExampleGenerator[]
  category: ExampleCategory
  schemaVersion: SchemaVersion
}

export type Example = {
  info: ExampleInfo
  config: Config | V1Config
}
