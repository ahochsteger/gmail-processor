import { ConfigMocks } from "../../test/mocks/ConfigMocks"
import { newAttachmentConfig } from "./AttachmentConfig"

it("should expect a JSON config", () => {
  const attachmentConfig = newAttachmentConfig(
    ConfigMocks.newDefaultAttachmentConfigJson(),
  )
  expect(attachmentConfig.match).toBeDefined()
  expect(attachmentConfig.match.name).toBe("Image-([0-9]+)\\.jpg")
  expect(attachmentConfig.match.contentType).toBe("image/.+")
})

it("should ensure nested object defaults", () => {
  const attachmentConfig = newAttachmentConfig({
    match: {
      name: "test",
    },
  })
  expect(attachmentConfig.actions).toEqual([])
  expect(attachmentConfig.match).toBeDefined()
  const match = attachmentConfig.match
  expect(match.name).toBe("test")
  expect(match.contentType).toBe(".*")
  expect(match.includeAttachments).toBe(true)
  expect(match.includeInlineImages).toBe(true)
  expect(match.largerThan).toBe(-1)
  expect(match.smallerThan).toBe(-1)
})
