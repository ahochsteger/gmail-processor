import { ConfigMocks } from "../../test/mocks/ConfigMocks"
import {
  MockFactory,
  Mocks,
  fakedSystemDateTimeString,
} from "../../test/mocks/MockFactory"
import { Config } from "../config/Config"
import { LogLevel } from "../utils/Logger"
import { RichLogAdapter } from "./RichLogAdapter"

let richLogAdapter: RichLogAdapter
let mocks: Mocks
let config: Config
beforeEach(() => {
  config = {
    ...ConfigMocks.newDefaultConfigJson(),
    settings: {
      ...ConfigMocks.newDefaultSettingsConfigJson(),
      richLogFields: [
        "log.timestamp",
        "log.level",
        "log.message",
        "field1",
        "field2",
      ],
      richLogConfig: [
        { key: "field1", title: "Field 1", value: "static value" },
        { key: "field2", title: "Field 2", value: "${context.type}" },
      ],
    },
  }
  mocks = MockFactory.newMocks(config)
  richLogAdapter = mocks.processingContext.proc.logAdapter
})

it("should create a field config compliant log array", () => {
  const actual = richLogAdapter.getLogValues(
    mocks.processingContext,
    "Log message",
  )
  expect(actual).toEqual([
    `${fakedSystemDateTimeString}.000`,
    LogLevel.INFO,
    "Log message",
    "static value",
    "proc",
  ])
})

it("should create a field config compliant JSON log object", () => {
  const actual = richLogAdapter.logJSON(mocks.processingContext, "Log message")
  expect(actual).toEqual({
    "log.timestamp": `${fakedSystemDateTimeString}.000`,
    "log.level": LogLevel.INFO,
    "log.message": "Log message",
    field1: "static value",
    field2: "proc",
  })
})
