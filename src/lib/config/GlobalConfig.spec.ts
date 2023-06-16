import { newAttachmentConfig } from "./AttachmentConfig"
import { GlobalConfig, newGlobalConfig } from "./GlobalConfig"
import { newMessageConfig } from "./MessageConfig"
import { newThreadConfig } from "./ThreadConfig"

it("should expect a JSON config", () => {
  const actual = newGlobalConfig({})
  expect(actual).toMatchObject({
    attachment: newAttachmentConfig({}, "global-"),
    message: newMessageConfig({}, "global-"),
    thread: newThreadConfig({}, "global-"),
  } as GlobalConfig)
})
