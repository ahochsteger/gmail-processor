import { GMailMocks } from "../../test/mocks/GMailMocks"
import { MockFactory, Mocks } from "../../test/mocks/MockFactory"
import { ProcessingStatus, RunMode } from "../Context"
import { newAttachmentConfig } from "../config/AttachmentConfig"
import {
  AttachmentMatchConfig,
  RequiredAttachmentMatchConfig,
  newAttachmentMatchConfig,
} from "../config/AttachmentMatchConfig"
import { newConfig } from "../config/Config"
import { AttachmentProcessor } from "./AttachmentProcessor"

let mocks: Mocks

beforeEach(() => {
  mocks = MockFactory.newMocks(newConfig(), RunMode.DANGEROUS)
})

it("should build a match config with default globals", () => {
  const expected: RequiredAttachmentMatchConfig = {
    contentTypeRegex: "some-content-type",
    includeAttachments: true,
    includeInlineImages: false,
    largerThan: 10,
    smallerThan: 100,
    name: "some-name",
  }
  const actual = AttachmentProcessor.buildMatchConfig(
    newAttachmentMatchConfig({}),
    newAttachmentMatchConfig(expected),
  )
  expect(actual).toMatchObject(expected)
})

it("should build a match config with default globals", () => {
  const expected: RequiredAttachmentMatchConfig = {
    contentTypeRegex: "some-content-type",
    includeAttachments: true,
    includeInlineImages: false,
    largerThan: 10,
    smallerThan: 100,
    name: "some-name",
  }
  const actual = AttachmentProcessor.buildMatchConfig(
    newAttachmentMatchConfig(expected),
    newAttachmentMatchConfig({}),
  )
  expect(actual).toMatchObject(expected)
})

it("should build a match config with special globals", () => {
  const expected: RequiredAttachmentMatchConfig = {
    contentTypeRegex: "global-content-type|local-content-type",
    includeAttachments: true,
    includeInlineImages: false,
    largerThan: 20,
    smallerThan: 100,
    name: "global-name|local-name",
  }
  const actual = AttachmentProcessor.buildMatchConfig(
    newAttachmentMatchConfig({
      contentTypeRegex: "global-content-type",
      includeAttachments: true,
      includeInlineImages: false,
      largerThan: 10,
      smallerThan: 100,
      name: "global-name",
    }),
    newAttachmentMatchConfig({
      contentTypeRegex: "local-content-type",
      includeAttachments: true,
      includeInlineImages: false,
      largerThan: 20,
      smallerThan: 1000,
      name: "local-name",
    }),
  )
  expect(actual).toMatchObject(expected)
})

it("should match messages with matching parameters", () => {
  const matchExamples: { config: AttachmentMatchConfig; matched: string[] }[] =
    [
      {
        config: {
          contentTypeRegex: "text/plain",
        },
        matched: ["attachment-1.txt"],
      },
      {
        config: {
          contentTypeRegex: "application/pdf",
        },
        matched: ["attachment-2.pdf"],
      },
    ]
  const mockedMessage = GMailMocks.newMessageMock({
    attachments: [
      {
        content: "some-content-1",
        contentType: "text/plain",
        name: "attachment-1.txt",
      },
      {
        content: "some-content-2",
        contentType: "application/pdf",
        name: "attachment-2.pdf",
      },
    ],
  })
  for (let i = 0; i < matchExamples.length; i++) {
    const e = matchExamples[i]
    const attachmentConfig = newAttachmentConfig({
      match: e.config,
    })
    const res = []
    for (const att of mockedMessage.getAttachments()) {
      if (AttachmentProcessor.matches(attachmentConfig.match, att)) {
        res.push(att.getName())
      }
    }
    expect(`${i}: ${res}`).toEqual(`${i}: ${e.matched}`)
  }
})

it("should process attachment configs", () => {
  const result = AttachmentProcessor.processConfigs(
    mocks.messageContext,
    mocks.messageContext.message.config.attachments,
  )
  expect(result.status).toEqual(ProcessingStatus.OK)
})

it("should process an attachment entity", () => {
  const result = AttachmentProcessor.processEntity(mocks.attachmentContext)
  expect(result.status).toEqual(ProcessingStatus.OK)
})
