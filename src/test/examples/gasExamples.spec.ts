import { validateConfig } from "../../lib/config/Validate"
import { validateV1Config } from "../../lib/config/v1/V1Validate"

import { Config, ProcessingResult, RunMode, V1Config } from "../../lib"
import { EnvContext, ProcessingStatus } from "../../lib/Context"
import { MockFactory, Mocks } from "../mocks/MockFactory"
import { e2eTest01Config, e2eTest01Run } from "./e2eTest01"
import { example01Config, example01Run } from "./example01"
import { example02Config, example02Run } from "./example02"
import {
  exampleActionErrorConfig,
  exampleActionErrorRun,
} from "./exampleActionError"
import { exampleMinConfig, exampleMinRun } from "./exampleMin"
import { gettingStartedConfig, gettingStartedRun } from "./gettingStarted"
import {
  gettingStartedAddLabelConfig,
  gettingStartedAddLabelRun,
} from "./gettingStartedAddLabel"
import {
  gettingStartedMarkReadConfig,
  gettingStartedMarkReadRun,
} from "./gettingStartedMarkRead"
import {
  migrationExample01Config,
  migrationExample01ConvertConfig,
} from "./migrationExample01"
import {
  migrationExampleMinConfig,
  migrationExampleMinConvertConfig,
} from "./migrationExampleMin"

let mocks: Mocks

const examples: {
  config: Config
  fn: (ctx: EnvContext) => ProcessingResult
}[] = [
  { config: e2eTest01Config, fn: e2eTest01Run },
  { config: example01Config, fn: example01Run },
  { config: example02Config, fn: example02Run },
  { config: exampleMinConfig, fn: exampleMinRun },
  { config: gettingStartedConfig, fn: gettingStartedRun },
  { config: gettingStartedAddLabelConfig, fn: gettingStartedAddLabelRun },
  { config: gettingStartedMarkReadConfig, fn: gettingStartedMarkReadRun },
]

const migrationExamples: { config: V1Config; fn: () => Config }[] = [
  { config: migrationExample01Config, fn: migrationExample01ConvertConfig },
  { config: migrationExampleMinConfig, fn: migrationExampleMinConvertConfig },
]

describe("Gmail Processor Examples", () => {
  it("should sucessfully run examples", () => {
    examples.forEach((example) => {
      mocks = MockFactory.newMocks(example.config, RunMode.DANGEROUS)
      const result = example.fn(mocks.envContext)
      expect(result.status).toEqual(ProcessingStatus.OK)
      expect(result.processedThreadConfigs).toEqual(
        example.config.threads?.length,
      )
    })
  })
  it("should successfully validate examples", () => {
    examples.forEach((example) => {
      validateConfig(example.config)
      expect(validateConfig.errors).toBeNull()
    })
  })
  it("should recover from action errors", () => {
    mocks = MockFactory.newMocks(exampleActionErrorConfig, RunMode.DANGEROUS)
    expect(() => {
      exampleActionErrorRun(mocks.envContext)
    }).toThrowError()
  })
})

describe("Gmail2gdrive Migration Examples", () => {
  it("should sucessfully run migration examples", () => {
    migrationExamples.forEach((example) => {
      const config = example.fn()
      expect(config.threads?.length).toEqual(example.config.rules.length)
    })
  })
  it("should successfully validate migration examples", () => {
    migrationExamples.forEach((example) => {
      validateV1Config(example.config)
      expect(validateV1Config.errors).toBeNull()
    })
  })
})
