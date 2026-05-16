/** @generated - DO NOT EDIT MANUALLY - Use 'npm run update:examples' instead */
// NOTE: Do not edit this auto-generated file!
// Template: src/templates/test-spec-migration-v1.eta
// Source: src/examples/migrations/migrationAdvanced.ts

import * as GmailProcessorLib from "../../lib"
import { validateV1Config } from "../../lib/config/v1/V1Validate"
import { validateConfig } from "./../../lib/config/Validate"
import { info, migrationConfig } from "./migrationAdvanced"

describe(`Example ${info.name}`, () => {
  it(`should successfully validate migration example config ${info.name}`, () => {
    const result = validateV1Config(migrationConfig)
    expect(result.success).toBe(true)
  })
  it(`should successfully run migration example ${info.name}`, () => {
    const convertedConfig = GmailProcessorLib.convertV1Config(migrationConfig)
    expect(convertedConfig.threads?.length).toEqual(
      migrationConfig.rules.length,
    )
  })
  it(`should successfully validate converted migration example ${info.name}`, () => {
    const convertedConfig = GmailProcessorLib.convertV1Config(migrationConfig)
    const result = validateConfig(convertedConfig)
    expect(result.success).toBe(true)
  })
})
