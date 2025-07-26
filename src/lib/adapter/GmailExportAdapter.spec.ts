import { MockProxy, mock } from "jest-mock-extended"
import { when } from "jest-when"
import { GMailMocks } from "../../test/mocks/GMailMocks"
import { MockFactory, Mocks } from "../../test/mocks/MockFactory"
import { GmailExportAdapter } from "./GmailExportAdapter"

// Helper Mocks
let mocks: Mocks
let urlFetchApp: MockProxy<GoogleAppsScript.URL_Fetch.UrlFetchApp>
let utilities: MockProxy<GoogleAppsScript.Utilities.Utilities>
let adapter: GmailExportAdapter
let avatarBlob: MockProxy<GoogleAppsScript.Base.Blob>
let avatarUrlResponse: MockProxy<GoogleAppsScript.URL_Fetch.HTTPResponse>

beforeAll(() => {
  mocks = MockFactory.newMocks()
  urlFetchApp = mocks.envContext.env
    .urlFetchApp as MockProxy<GoogleAppsScript.URL_Fetch.UrlFetchApp>
  utilities = mocks.envContext.env
    .utilities as MockProxy<GoogleAppsScript.Utilities.Utilities>
  adapter = new GmailExportAdapter(
    mocks.envContext,
    mocks.processingContext.proc.config.settings,
  )
  avatarBlob = mock<GoogleAppsScript.Base.Blob>()
  avatarUrlResponse = mock<GoogleAppsScript.URL_Fetch.HTTPResponse>()
})

beforeEach(() => {
  jest.clearAllMocks()
})

const emailHeader =
  '<dt>From:</dt><dd class="strong"><a href="mailto:message-from@example.com">message-from@example.com</a></dd>'

it("should generate a HTML message with header", () => {
  const actual = adapter.generateMessagesHtml([mocks.message], {
    includeHeader: true,
  })
  expect(actual).toContain(emailHeader)
})

it("should generate a HTML message without header", () => {
  const actual = adapter.generateMessagesHtml([mocks.message], {
    includeHeader: false,
  })
  expect(actual).not.toContain(emailHeader)
})

describe("generateMessageHtmlHeader", () => {
  it("should generate a HTML header with avatar", () => {
    // Arrange
    const senderEmail = "test1@example.com"
    const avatarContentType = "image/png"
    const avatarBytes = [1, 2, 3, 4] // Some dummy bytes
    const avatarBase64 = "AQIDBA==" // Base64 representation of [1, 2, 3, 4]
    const expectedDataUri = `data:${avatarContentType};base64,${avatarBase64}`

    const message =
      mocks.message as MockProxy<GoogleAppsScript.Gmail.GmailMessage>

    urlFetchApp.fetch
      .mockReturnValue(avatarUrlResponse)
      .mockName("fetch-avatar")
    avatarUrlResponse.getBlob.mockReturnValue(avatarBlob)
    avatarUrlResponse.getResponseCode.mockReturnValue(200) // Simulate successful fetch
    avatarBlob.getContentType.mockReturnValue(avatarContentType)
    avatarBlob.getBytes.mockReturnValue(avatarBytes)
    utilities.base64Encode.mockReturnValue(avatarBase64)
    message.getFrom.mockReturnValue(senderEmail)

    // Act
    const actual = adapter.generateMessageHtmlHeader(mocks.message, {
      embedAvatar: true,
      includeHeader: true,
    })

    // Assert
    expect(urlFetchApp.fetch).toHaveBeenCalled()
    expect(utilities.base64Encode).toHaveBeenCalledWith(avatarBytes)
    expect(actual).toContain(
      `<dd class="avatar"><img src="${expectedDataUri}" /></dd>`,
    )
    expect(actual).toContain(
      `<a href="mailto:${senderEmail}">${senderEmail}</a>`,
    )
  })

  it("should generate a HTML header without avatar if none is available", () => {
    // Arrange
    const senderEmail = "test2@example.com"
    const avatarUrlResponse: MockProxy<GoogleAppsScript.URL_Fetch.HTTPResponse> =
      mock<GoogleAppsScript.URL_Fetch.HTTPResponse>()
    const message =
      mocks.message as MockProxy<GoogleAppsScript.Gmail.GmailMessage>

    urlFetchApp.fetch
      .mockReturnValue(avatarUrlResponse)
      .mockName("fetch-avatar")
    avatarUrlResponse.getResponseCode.mockReturnValue(404) // Simulate failed fetch
    message.getFrom.mockReturnValue(senderEmail)

    // Act
    const actual = adapter.generateMessageHtmlHeader(mocks.message, {
      embedAvatar: true,
      includeHeader: true,
    })

    // Assert
    expect(urlFetchApp.fetch).toHaveBeenCalled()
    expect(avatarUrlResponse.getBlob).not.toHaveBeenCalled()
    expect(utilities.base64Encode).not.toHaveBeenCalled()
    expect(actual).not.toContain(`<dd class="avatar">`)
    expect(actual).toContain(
      `<a href="mailto:${senderEmail}">${senderEmail}</a>`,
    )
  })

  it("should include CC and BCC addresses in the header", () => {
    // Arrange
    const message =
      mocks.message as MockProxy<GoogleAppsScript.Gmail.GmailMessage>
    const ccEmail = "cc@example.com"
    const bccEmail = "bcc@example.com"
    message.getCc.mockReturnValue(ccEmail)
    message.getBcc.mockReturnValue(bccEmail)

    // Act
    const actual = adapter.generateMessageHtmlHeader(message, {
      includeHeader: true,
    })

    // Assert
    expect(actual).toContain(
      `<dt>cc:</dt><dd><a href="mailto:${ccEmail}">${ccEmail}</a></dd>`,
    )
    expect(actual).toContain(
      `<dt>bcc:</dt><dd><a href="mailto:${bccEmail}">${bccEmail}</a></dd>`,
    )
  })
})

it("should process data urls in HTML", () => {
  const img =
    '<img width="16" height="16" alt="tick" src="data:image/gif;base64,R0lGODdhEAAQAMwAAPj7+FmhUYjNfGuxYYDJdYTIeanOpT+DOTuANXi/bGOrWj6CONzv2sPjv2CmV1unU4zPgISg6DJnJ3ImTh8Mtbs00aNP1CZSGy0YqLEn47RgXW8amasW7XWsmmvX2iuXiwAAAAAEAAQAAAFVyAgjmRpnihqGCkpDQPbGkNUOFk6DZqgHCNGg2T4QAQBoIiRSAwBE4VA4FACKgkB5NGReASFZEmxsQ0whPDi9BiACYQAInXhwOUtgCUQoORFCGt/g4QAIQA7">'
  const messages = GMailMocks.getMessages({
    messages: [
      {
        body: img,
      },
    ],
  })
  const actual = adapter.generateMessagesHtml(messages, {
    includeHeader: false,
  })
  expect(actual).toContain(img)
})

describe("Image Embedding", () => {
  const remoteImageUrl = "http://example.com/remote.png"
  const remoteImageContentType = "image/png"
  const remoteImageBytes: number[] = [5, 6, 7, 8]
  const remoteImageBase64 = "BQYHCA=="
  const remoteImageDataUri = `data:${remoteImageContentType};base64,${remoteImageBase64}`

  const inlineImageCid = "?view=att&th=inline_123"
  const inlineImageContentType = "image/jpeg"
  const inlineImageBytes: number[] = [9, 10, 11, 12]
  const inlineImageBase64 = "CQoLDA=="
  const inlineImageDataUri = `data:${inlineImageContentType};base64,${inlineImageBase64}`

  const failedImageUrl = "http://example.com/failed.png"

  beforeEach(() => {
    const remoteResponse = mock<GoogleAppsScript.URL_Fetch.HTTPResponse>()
    const failedResponse = mock<GoogleAppsScript.URL_Fetch.HTTPResponse>()
    const remoteBlob = mock<GoogleAppsScript.Base.Blob>()
    const failedBlob = mock<GoogleAppsScript.Base.Blob>()
    when(urlFetchApp.fetch)
      .calledWith(remoteImageUrl, expect.anything())
      .mockReturnValue(remoteResponse)
      .calledWith(failedImageUrl, expect.anything())
      .mockReturnValue(failedResponse)
    remoteResponse.getResponseCode.mockReturnValue(200)
    remoteResponse.getBlob.mockReturnValue(remoteBlob)
    remoteBlob.getContentType.mockReturnValue(remoteImageContentType)
    remoteBlob.getBytes.mockReturnValue(remoteImageBytes)
    failedResponse.getResponseCode.mockReturnValue(404)
    failedResponse.getBlob.mockReturnValue(failedBlob)
    failedBlob.getContentType.mockReturnValue(null)
    failedBlob.getBytes.mockReturnValue([])
    utilities.base64Encode.mockImplementation((...args: any[]) => {
      const bytes = args[0] as string // Extract the first argument

      if (String(remoteImageBytes) === String(bytes)) {
        return remoteImageBase64
      }
      if (String(inlineImageBytes) === String(bytes)) {
        return inlineImageBase64
      }
      return ""
    })
    const inlineBlob = mock<
      GoogleAppsScript.Base.Blob & GoogleAppsScript.Gmail.GmailAttachment
    >()
    inlineBlob.getContentType.mockReturnValue(inlineImageContentType)
    inlineBlob.getBytes.mockReturnValue(inlineImageBytes)
    inlineBlob.copyBlob.mockReturnValue(inlineBlob) // Return self for copyBlob
  })

  it("should embed remote images in <img> tags", () => {
    const body = `<p>Remote image: <img src="${remoteImageUrl}"></p>`
    const message = GMailMocks.newMessageMock({ body })
    const actual = adapter.generateMessagesHtml([message], {
      embedRemoteImages: true,
      includeHeader: false,
    })
    expect(actual).toContain(`<img src="${remoteImageDataUri}">`)
    expect(urlFetchApp.fetch).toHaveBeenCalledWith(
      remoteImageUrl,
      expect.anything(),
    )
    expect(utilities.base64Encode).toHaveBeenCalledWith(remoteImageBytes)
  })

  it("should embed remote images in style attributes", () => {
    const body = `<p style="background: url('${remoteImageUrl}')">Styled</p>`
    const message = GMailMocks.newMessageMock({ body })
    const actual = adapter.generateMessagesHtml([message], {
      embedRemoteImages: true,
      includeHeader: false,
    })
    expect(actual).toContain(`style="background: url('${remoteImageDataUri}')"`)
    expect(urlFetchApp.fetch).toHaveBeenCalledWith(
      remoteImageUrl,
      expect.anything(),
    )
    expect(utilities.base64Encode).toHaveBeenCalledWith(remoteImageBytes)
  })

  it("should embed remote images in <style> tags", () => {
    const body = `<style>.bg { background-image: url("${remoteImageUrl}"); }</style><p class="bg">Styled</p>`
    const message = GMailMocks.newMessageMock({ body })
    const actual = adapter.generateMessagesHtml([message], {
      embedRemoteImages: true,
      includeHeader: false,
    })
    expect(actual).toContain(`background-image: url("${remoteImageDataUri}");`)
    expect(urlFetchApp.fetch).toHaveBeenCalledWith(
      remoteImageUrl,
      expect.anything(),
    )
    expect(utilities.base64Encode).toHaveBeenCalledWith(remoteImageBytes)
  })

  it("should embed inline images in <img> tags", () => {
    const body = `<p>Inline image: <img src="${inlineImageCid}"></p>`
    const message = GMailMocks.newMessageMock({ body })
    const inlineBlob = mock<
      GoogleAppsScript.Gmail.GmailAttachment & GoogleAppsScript.Base.Blob
    >()
    inlineBlob.getContentType.mockReturnValue(inlineImageContentType)
    inlineBlob.getBytes.mockReturnValue(inlineImageBytes)
    inlineBlob.copyBlob.mockReturnValue(inlineBlob)
    message.getAttachments.mockReturnValue([inlineBlob])
    const actual = adapter.generateMessagesHtml([message], {
      embedInlineImages: true,
      includeHeader: false,
    })
    expect(actual).toContain(`<img src="${inlineImageDataUri}">`)
    expect(
      (message as MockProxy<GoogleAppsScript.Gmail.GmailMessage>)
        .getAttachments,
    ).toHaveBeenCalledWith({
      includeInlineImages: true,
      includeAttachments: false,
    })
    expect(utilities.base64Encode).toHaveBeenCalledWith(inlineImageBytes)
  })

  it("should keep original src if remote image fetch fails", () => {
    const body = `<p>Remote image: <img src="${failedImageUrl}"></p>`
    const message = GMailMocks.newMessageMock({ body })
    const actual = adapter.generateMessagesHtml([message], {
      embedRemoteImages: true,
      includeHeader: false,
    })
    expect(actual).toContain(`<img src="${failedImageUrl}">`)
  })

  it("should keep original src if inline image is missing", () => {
    const body = `<p>Inline image: <img src="${inlineImageCid}"></p>`
    const message = GMailMocks.newMessageMock({ body })
    message.getAttachments.mockReturnValue([]) // No inline attachments found
    const actual = adapter.generateMessagesHtml([message], {
      embedInlineImages: true,
      includeHeader: false,
    })
    expect(actual).toContain(`<img src="${inlineImageCid}">`)
    expect(utilities.base64Encode).not.toHaveBeenCalledWith(inlineImageBytes) // Ensure it wasn't called for this image
  })
})

// TODO: Add tests for Attachment Handling (includeAttachments, embedAttachments)
// - Test embedding image attachments
// - Test listing non-image attachments when embedding is on
// - Test listing all attachments when embedding is off
