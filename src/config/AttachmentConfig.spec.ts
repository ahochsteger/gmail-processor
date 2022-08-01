import { plainToClass } from "class-transformer"
import { MockFactory } from "../../test/mocks/MockFactory"
import { AttachmentConfig } from "./AttachmentConfig"
import "reflect-metadata"

it("should expect a JSON config", () => {
  const attachmentConfig = plainToClass(
    AttachmentConfig,
    MockFactory.newDefaultAttachmentConfig(),
  )
  expect(attachmentConfig.match).toBeDefined()
  expect(attachmentConfig.match.name).toBe("Image-([0-9]+)\\.jpg")
  expect(attachmentConfig.match.contentType).toBe("image/.+")
})

it("should ensure nested object defaults", () => {
  const attachmentConfig = plainToClass(AttachmentConfig, {
    match: {
      name: "test",
    },
  })
  expect(attachmentConfig.actions).toEqual([])
  expect(attachmentConfig.match).toBeDefined()
  expect(attachmentConfig.match.name).toBe("test")
  expect(attachmentConfig.match.contentType).toBe(".*")
  expect(attachmentConfig.match.includeAttachments).toBe(true)
  expect(attachmentConfig.match.includeInlineImages).toBe(true)
  expect(attachmentConfig.match.largerThan).toBe(-1)
  expect(attachmentConfig.match.smallerThan).toBe(-1)
})
