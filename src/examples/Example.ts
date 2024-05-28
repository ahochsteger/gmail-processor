import { ActionRegistration } from "../lib/actions/ActionRegistry"
import { Config } from "../lib/config/Config"
import { V1Config } from "../lib/config/v1/V1Config"

export type SchemaVersion = "v1" | "v2"

export type ExampleCategoryInfo = {
  description: string
  name: string
  title: string
}

export enum ExampleCategory {
  ACTIONS = "actions",
  ADVANCED = "advanced",
  BASICS = "basics",
  FEATURES = "features",
  MIGRATIONS = "migrations",
  REGRESSIONS = "regressions",
}

export enum ExampleTemplateType {
  CONFIG = "config",
  DOCS = "docs",
  DOCS_INDEX = "docs-index",
  GAS_CODE = "gas-code",
  GAS_TEST = "gas-test",
  TEST_SPEC = "test-spec",
}

export enum ExampleVariant {
  CUSTOM_ACTIONS = "custom-actions",
  MIGRATION_V1 = "migration-v1",
}

export type ExampleInfo = {
  name: string
  title: string
  description: string
  issues?: number[]
  pullRequests?: number[]
  skipGenerate?: ExampleTemplateType[]
  category: ExampleCategory
  variant?: ExampleVariant
}

export type Example = {
  info: ExampleInfo
  config: Config
  customActions?: ActionRegistration[]
}

export type V1Example = {
  info: ExampleInfo
  migrationConfig: V1Config
}

export type GenSpec = {
  file: string
  type: ExampleTemplateType
  transformSourceFn?: (content: string) => string
}

export type ExampleDoc = {
  name: string
  description: string
}

export type EnumValueInfo = {
  deprecated: boolean
  deprecationInfo: string
  description: string
  key: string
  value: string
}
export type EnumTypeInfo = {
  deprecated: boolean
  deprecationInfo: string
  description: string
  name: string
  values: EnumValueInfo[]
}
