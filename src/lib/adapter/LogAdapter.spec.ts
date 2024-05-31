import { ConfigMocks } from "../../test/mocks/ConfigMocks"
import {
  MockFactory,
  Mocks,
  fakedSystemDateTimeString,
} from "../../test/mocks/MockFactory"
import { Config } from "../config/Config"
import { LogLevel, newSettingsConfig } from "../config/SettingsConfig"
import { LogAdapter } from "./LogAdapter"

let richLogAdapter: LogAdapter
let mocks: Mocks
let config: Config
beforeEach(() => {
  const logConfig = [
    ...newSettingsConfig({}).logConfig,
    { name: "field.1", title: "Field 1", value: "static value" },
    { name: "field.2", title: "Field 2", value: "${context.type}" },
  ]
  config = {
    ...ConfigMocks.newDefaultConfigJson(),
    settings: {
      ...ConfigMocks.newDefaultSettingsConfigJson(),
      logConfig,
      logFields: [
        "log.timestamp",
        "log.level",
        "log.location",
        "log.message",
        "field.1",
        "field.2",
        "env.runMode",
      ],
    },
  }
  mocks = MockFactory.newMocks(config)
  richLogAdapter = mocks.processingContext.proc.logAdapter
})

it("should create a field config compliant log array", () => {
  const actual = richLogAdapter.getLogValues(mocks.processingContext, {
    location: "LogAdapter.spec",
    message: "Log message",
  })
  expect(actual).toEqual([
    `${fakedSystemDateTimeString}.000`,
    LogLevel.INFO,
    "LogAdapter.spec",
    "Log message",
    "static value",
    mocks.processingContext.type,
    mocks.processingContext.env.runMode,
  ])
})

it("should create a field config compliant JSON log object", () => {
  const actual = richLogAdapter.logJSON(mocks.processingContext, {
    location: "LogAdapter.spec",
    message: "Log message",
  })
  expect(actual).toEqual({
    "log.timestamp": `${fakedSystemDateTimeString}.000`,
    "log.level": LogLevel.INFO,
    "log.location": "LogAdapter.spec",
    "log.message": "Log message",
    "field.1": "static value",
    "field.2": mocks.processingContext.type,
    "env.runMode": mocks.processingContext.env.runMode,
  })
})
