import { validateConfig } from "../../lib/config/Validate"
import { validateV1Config } from "../../lib/config/v1/V1Validate"

import { PartialDeep } from "type-fest"
import { Config, ProcessingResult, RunMode, V1Config } from "../../lib"
import { EnvContext, ProcessingStatus } from "../../lib/Context"
import { MockFactory, Mocks } from "../../test/mocks/MockFactory"
import { e2eTest01Config, e2eTest01Run } from "./e2eTest01"
import { example01Config, example01Run } from "./example01"
import { example02Config, example02Run } from "./example02"
import { exampleMinConfig, exampleMinRun } from "./exampleMin"
import { config, run } from "./gettingStarted"
import {
  migrationExample01Config,
  migrationExample01ConvertConfig,
} from "./migrationExample01"
import {
  migrationExampleMinConfig,
  migrationExampleMinConvertConfig,
} from "./migrationExampleMin"

let mocks: Mocks

function testExample(
  name: string,
  config: Config,
  fn: (
    _evt: GoogleAppsScript.Events.TimeDriven | undefined,
    ctx: EnvContext
  ) => ProcessingResult
) {
  it(`should successfully run example ${name}`, () => {
    mocks = MockFactory.newMocks(config, RunMode.DANGEROUS)
    const result = fn(undefined, mocks.envContext)
    expect(result.status).toEqual(ProcessingStatus.OK)
    expect(result.processedThreadConfigs).toEqual(config.threads?.length)
  })
  it(`should successfully validate example ${name}`, () => {
    validateConfig(config)
    expect(validateConfig.errors).toBeNull()
  })
}

function testMigrationExample(
  name: string,
  v1config: V1Config,
  fn: () => PartialDeep<Config>
) {
  it(`should successfully run migration example ${name}`, () => {
    const config = fn()
    expect(config.threads?.length).toEqual(v1config.rules.length)
  })
  it(`should successfully validate migration example ${name}`, () => {
    validateV1Config(v1config)
    expect(validateV1Config.errors).toBeNull()
  })
}

describe("e2eTest01", () =>
  testExample("e2eTest01", e2eTest01Config, e2eTest01Run))
describe("example01", () =>
  testExample("example01", example01Config, example01Run))
describe("example02", () =>
  testExample("example02", example02Config, example02Run))
describe("exampleMin", () =>
  testExample("exampleMin", exampleMinConfig, exampleMinRun))
describe("gettingStarted", () => testExample("gettingStarted", config, run))
describe("migrationExample01", () =>
  testMigrationExample(
    "migrationExample01",
    migrationExample01Config,
    migrationExample01ConvertConfig
  ))
describe("migrationExampleMin", () =>
  testMigrationExample(
    "migrationExampleMin",
    migrationExampleMinConfig,
    migrationExampleMinConvertConfig
  ))
