// NOTE: Do not edit this auto-generated file!
// Template: src/examples/_templates/test-spec-v1.tmpl
// Source: src/examples/migrations/migrationAdvanced.ts

import * as GmailProcessorLib from "../../lib"
import { validateV1Config } from "../../lib/config/v1/V1Validate"
import { validateConfig } from "./../../lib/config/Validate"
import { info, migrationConfig } from "./migrationAdvanced"

describe(`Example ${info.name}`, () => {
  it(`should successfully validate migration example config ${info.name}`, () => {
    validateV1Config(migrationConfig)
    expect(validateV1Config.errors).toBeNull()
  })
  it(`should successfully run migration example ${info.name}`, () => {
    const convertedConfig = GmailProcessorLib.convertV1Config(migrationConfig)
    expect(convertedConfig.threads?.length).toEqual(
      migrationConfig.rules.length,
    )
  })
  it(`should successfully validate converted migration example ${info.name}`, () => {
    const convertedConfig = GmailProcessorLib.convertV1Config(migrationConfig)
    validateConfig(convertedConfig)
  })
})

describe(`Example ${info.name}`, () => {
  it(`should successfully validate migration example config ${info.name}`, () => {
    validateV1Config(migrationConfig)
    expect(validateV1Config.errors).toBeNull()
  })
  it(`should successfully run migration example ${info.name}`, () => {
    const convertedConfig = GmailProcessorLib.convertV1Config(migrationConfig)
    expect(convertedConfig.threads?.length).toEqual(
      migrationConfig.rules.length,
    )
  })
  it(`should successfully validate converted migration example ${info.name}`, () => {
    const convertedConfig = GmailProcessorLib.convertV1Config(migrationConfig)
    validateConfig(convertedConfig)
  })
})
