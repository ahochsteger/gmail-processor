import { newAttachmentConfig } from "./AttachmentConfig"
import { GlobalConfig, newGlobalConfig } from "./GlobalConfig"
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
