import {
  MarkProcessedMethod,
  SettingsConfig,
  newSettingsConfig,
} from "./SettingsConfig"

it("should expect a JSON config", () => {
  const actual = newSettingsConfig({})
  expect(actual).toMatchObject({
    markProcessedMethod: MarkProcessedMethod.MARK_MESSAGE_READ,
  } as SettingsConfig)
})
