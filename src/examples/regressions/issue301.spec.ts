// NOTE: Do not edit this auto-generated file!
// Template: src/examples/_templates/test-spec-v2.tmpl
// Source: src/examples/regressions/issue301.ts

import { ProcessingStatus } from "../../lib"
import { GmailProcessor } from "../../lib/processors/GmailProcessor"
import { MockFactory, Mocks } from "../../test/mocks/MockFactory"
import { validateConfig } from "./../../lib/config/Validate"
import { info, runConfig } from "./issue301"

let mocks: Mocks

beforeAll(() => {
  mocks = MockFactory.newMocks()
})

describe(`Example ${info.name}`, () => {
  it(`should successfully run example ${info.name}`, () => {
    const result = GmailProcessor.runWithJson(runConfig, mocks.envContext)
    expect(result.status).toEqual(ProcessingStatus.OK)
    expect(result.processedThreadConfigs).toEqual(runConfig.threads?.length)
  })
  it(`should successfully validate example ${info.name}`, () => {
    validateConfig(runConfig)
    expect(validateConfig.errors).toBeNull()
  })
})