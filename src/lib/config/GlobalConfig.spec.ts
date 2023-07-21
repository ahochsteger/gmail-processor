import { ConfigMocks } from "../../test/mocks/ConfigMocks"
import { newAttachmentConfig } from "./AttachmentConfig"
import {
  GlobalConfig,
  essentialGlobalConfig,
  newGlobalConfig,
} from "./GlobalConfig"
import { newMessageConfig } from "./MessageConfig"
import { newThreadConfig } from "./ThreadConfig"

it("should expect a JSON config", () => {
  const actual = newGlobalConfig({})
  expect(actual).toMatchObject({
    attachment: newAttachmentConfig({}),
    message: newMessageConfig({}),
    thread: newThreadConfig({}),
  } as GlobalConfig)
})

it("should provide essential JSON config with defaults removed", () => {
  const config = newGlobalConfig(ConfigMocks.newDefaultGlobalConfigJson())
  const actual = essentialGlobalConfig(config)
  expect(actual).toMatchObject({
    variables: [
      {
        key: "customVar",
        value: "Custom value",
      },
    ],
  } as GlobalConfig)
})
