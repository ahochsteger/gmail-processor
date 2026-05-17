import {
  AttachmentContext,
  EnvContext,
  MessageContext,
  ProcessingContext,
  RunMode,
  ThreadContext,
} from "../../lib/Context"
import { Config, newConfig } from "../../lib/config/Config"
import { E2ETestConfig } from "../../lib/e2e/E2E"
import { ConfigMocks } from "./ConfigMocks"
import { ContextMocks } from "./ContextMocks"
import { EnvMocks } from "./EnvMocks"
import { GDriveMocks } from "./GDriveMocks"
import {
  GMailData,
  GMailMocks,
  IndexType,
  MessageData,
  ThreadData,
} from "./GMailMocks"
import { SpreadsheetMocks } from "./SpreadsheetMocks"

export const fakedSystemDateString = "2023-06-26" // Automated tests rely on this date to be a monday!
export const fakedSystemTimeString = "09:00:00" // TODO: Use "12:34:56.789" instead to better test date-fns functions
export const fakedSystemDateTimeString = `${fakedSystemDateString} ${fakedSystemTimeString}`
export const fakedSystemDateTime = new Date(
  `${fakedSystemDateString}T${fakedSystemTimeString}`,
)
jest.useFakeTimers({ now: fakedSystemDateTime })
export class Mocks extends EnvMocks {
  public envContext: EnvContext
  public processingContext: ProcessingContext
  public threadContext: ThreadContext
  public messageContext: MessageContext
  public attachmentContext: AttachmentContext
  constructor(
    configJson: Config = ConfigMocks.newDefaultConfigJson(),
    gmailData: GMailData = GMailMocks.getGmailSampleData(),
    dataIndex: IndexType = [0, 0, 0],
    configIndex: IndexType = [0, 0, 0],
    runMode: RunMode = RunMode.DANGEROUS,
  ) {
    super()

    this.envContext = ContextMocks.newEnvContextMock(this, runMode)
    GDriveMocks.setupAllMocks(this)
    GMailMocks.setupAllMocks(this, gmailData, dataIndex)
    SpreadsheetMocks.setupAllMocks(this)
    const config = newConfig(configJson)
    this.processingContext = ContextMocks.newProcessingContextMock(
      this.envContext,
      config,
    )

    // Setup special mocks:
    this.urlFetchApp.fetch.mockReturnValue(this.urlResponse)
    this.urlResponse.getBlob.mockReturnValue(this.newBlob)
    this.attachment.copyBlob.mockReturnValue(this.newBlob)

    const [threadIndex, messageIndex, attachmentIndex] = dataIndex
    const [threadConfigIndex, messageConfigIndex, attachmentConfigIndex] =
      configIndex

    this.threadContext = ContextMocks.newThreadContextMock(
      this.processingContext,
      this.thread,
      threadIndex,
      threadConfigIndex,
    )
    this.messageContext = ContextMocks.newMessageContextMock(
      this.threadContext,
      this.message,
      messageIndex,
      messageConfigIndex,
    )
    this.attachmentContext = ContextMocks.newAttachmentContextMock(
      this.messageContext,
      this.attachment,
      attachmentIndex,
      attachmentConfigIndex,
    )
  }
}

export class MockFactory {
  public static newMockFromExample(testConfig: E2ETestConfig): Mocks {
    const messages: MessageData[] =
      testConfig.initConfig?.mails?.map((m) => {
        return {
          subject: m.subject,
          body: m.body,
          attachments: m.attachments?.map((a) => {
            return {
              name: a,
            }
          }),
        }
      }) ?? []
    const threads: ThreadData[] = [
      {
        firstMessageSubject: testConfig.initConfig?.mails[0].subject,
        messages: messages,
      },
    ]
    return this.newCustomMocks(
      testConfig.runConfig,
      GMailMocks.getGmailSampleData({
        threads: threads,
      }),
    )
  }
  public static newMocks(
    config: Config = ConfigMocks.newDefaultConfig(),
    runMode = RunMode.DANGEROUS,
    mocks = new Mocks(
      config,
      GMailMocks.getGmailSampleData(),
      [0, 0, 0],
      [0, 0, 0],
      runMode,
    ),
  ): Mocks {
    return mocks
  }
  public static newCustomMocks(
    config: Config = ConfigMocks.newDefaultConfig(),
    gmailData: GMailData = GMailMocks.getGmailSampleData(),
    dataIndex: IndexType = [0, 0, 0],
    configIndex: IndexType = [0, 0, 0],
    runMode = RunMode.DANGEROUS,
    mocks = new Mocks(config, gmailData, dataIndex, configIndex, runMode),
  ): Mocks {
    return mocks
  }
}

ContextMocks.mockFactoryRef = MockFactory
