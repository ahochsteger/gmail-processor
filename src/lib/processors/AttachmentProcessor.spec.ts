import { GMailMocks } from "../../test/mocks/GMailMocks"
import { MockFactory, Mocks } from "../../test/mocks/MockFactory"
import { ProcessingStatus } from "../Context"
import {
  AttachmentOrderField,
  newAttachmentConfig,
} from "../config/AttachmentConfig"
import {
  AttachmentMatchConfig,
  RequiredAttachmentMatchConfig,
  newAttachmentMatchConfig,
} from "../config/AttachmentMatchConfig"
import { OrderDirection } from "../config/CommonConfig"
import { AttachmentProcessor } from "./AttachmentProcessor"

let mocks: Mocks

beforeAll(() => {
  mocks = MockFactory.newMocks()
})

beforeEach(() => {
  jest.clearAllMocks()
})

it("should build a match config with default globals", () => {
  const expected: RequiredAttachmentMatchConfig = {
    contentType: "some-content-type",
    includeAttachments: true,
    includeInlineImages: false,
    largerThan: 10,
    smallerThan: 100,
    name: "some-name",
  }
  const actual = AttachmentProcessor.buildMatchConfig(
    mocks.messageContext,
    newAttachmentMatchConfig({}),
    newAttachmentMatchConfig(expected),
  )
  expect(actual).toMatchObject(expected)
})

it("should build a match config with default globals", () => {
  const expected: RequiredAttachmentMatchConfig = {
    contentType: "some-content-type",
    includeAttachments: true,
    includeInlineImages: false,
    largerThan: 10,
    smallerThan: 100,
    name: "some-name",
  }
  const actual = AttachmentProcessor.buildMatchConfig(
    mocks.messageContext,
    newAttachmentMatchConfig(expected),
    newAttachmentMatchConfig({}),
  )
  expect(actual).toMatchObject(expected)
})

it("should build a match config with special globals", () => {
  const expected: RequiredAttachmentMatchConfig = {
    contentType: "global-content-type|local-content-type",
    includeAttachments: true,
    includeInlineImages: false,
    largerThan: 20,
    smallerThan: 100,
    name: "global-name|local-name",
  }
  const actual = AttachmentProcessor.buildMatchConfig(
    mocks.messageContext,
    newAttachmentMatchConfig({
      contentType: "global-content-type",
      includeAttachments: true,
      includeInlineImages: false,
      largerThan: 10,
      smallerThan: 100,
      name: "global-name",
    }),
    newAttachmentMatchConfig({
      contentType: "local-content-type",
      includeAttachments: true,
      includeInlineImages: false,
      largerThan: 20,
      smallerThan: 1000,
      name: "local-name",
    }),
  )
  expect(actual).toMatchObject(expected)
})

it("should match attachments with matching parameters", () => {
  const matchExamples: { config: AttachmentMatchConfig; matched: string[] }[] =
    [
      {
        config: {
          contentType: "text/plain",
        },
        matched: ["attachment-1.txt"],
      },
      {
        config: {
          contentType: "application/pdf",
        },
        matched: ["attachment-2.pdf"],
      },
      {
        config: {
          name: "non-matching-attachment",
        },
        matched: [],
      },
      {
        // Matching name
        config: {
          name: "attachment-1.txt",
        },
        matched: ["attachment-1.txt"],
      },
      {
        // Non-matching name (case-sensitive)
        config: {
          name: "ATTACHMENT-1.txt",
        },
        matched: [],
      },
      {
        // Matching name (case-insensitive)
        config: {
          name: "(?i)ATTACHMENT-1.txt",
        },
        matched: ["attachment-1.txt"],
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
      if (
        AttachmentProcessor.matches(
          mocks.messageContext,
          attachmentConfig.match,
          att,
        )
      ) {
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
  expect(result).toMatchObject({
    status: ProcessingStatus.OK,
  })
})

it("should process a non-matching attachment config", () => {
  const result = AttachmentProcessor.processConfigs(mocks.messageContext, [
    newAttachmentConfig({
      match: {
        name: "non-matching-attachment",
      },
    }),
  ])
  expect(result).toMatchObject({
    status: ProcessingStatus.OK,
  })
})

it("should process an attachment entity", () => {
  const result = AttachmentProcessor.processEntity(mocks.attachmentContext)
  expect(result).toMatchObject({
    status: ProcessingStatus.OK,
  })
})

describe("order attachments", () => {
  let attachments = [
    GMailMocks.newAttachmentMock({
      hash: "a1",
      name: "2",
    }),
    GMailMocks.newAttachmentMock({
      hash: "a2",
      name: "1",
    }),
    GMailMocks.newAttachmentMock({
      hash: "a3",
      name: "3",
    }),
  ]
  it("should order threads ascending", () => {
    attachments = AttachmentProcessor.ordered(
      attachments,
      {
        orderBy: AttachmentOrderField.NAME,
        orderDirection: OrderDirection.ASC,
      },
      AttachmentProcessor.orderRules,
    )
    expect(attachments.map((t) => t.getHash())).toEqual(["a2", "a1", "a3"])
  })
  it("should order threads ascending", () => {
    attachments = AttachmentProcessor.ordered(
      attachments,
      {
        orderBy: AttachmentOrderField.NAME,
        orderDirection: OrderDirection.DESC,
      },
      AttachmentProcessor.orderRules,
    )
    expect(attachments.map((t) => t.getHash())).toEqual(["a3", "a1", "a2"])
  })
})
