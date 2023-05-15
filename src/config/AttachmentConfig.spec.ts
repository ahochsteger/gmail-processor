import { MockFactory } from "../../test/mocks/MockFactory"
import { jsonToAttachmentConfig } from "./AttachmentConfig"

it("should expect a JSON config", () => {
  const attachmentConfig = jsonToAttachmentConfig(
    MockFactory.newDefaultAttachmentConfigJson(),
  )
  expect(attachmentConfig.match).toBeDefined()
  expect(attachmentConfig.match.name).toBe("Image-([0-9]+)\\.jpg")
  expect(attachmentConfig.match.contentTypeRegex).toBe("image/.+")
})

it("should ensure nested object defaults", () => {
  const attachmentConfig = jsonToAttachmentConfig({
    match: {
      name: "test",
    },
  })
  expect(attachmentConfig.actions).toEqual([])
  expect(attachmentConfig.match).toBeDefined()
  expect(attachmentConfig.match.name).toBe("test")
  expect(attachmentConfig.match.contentTypeRegex).toBe(".*")
  expect(attachmentConfig.match.includeAttachments).toBe(true)
  expect(attachmentConfig.match.includeInlineImages).toBe(true)
  expect(attachmentConfig.match.largerThan).toBe(-1)
  expect(attachmentConfig.match.smallerThan).toBe(-1)
})
