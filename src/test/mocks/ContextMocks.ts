import { MockProxy } from "jest-mock-extended"
import {
  AttachmentContext,
  ContextType,
  EnvContext,
  MessageContext,
  ProcessingContext,
  RunMode,
  ThreadContext,
} from "../../lib/Context"
import { GDriveAdapter } from "../../lib/adapter/GDriveAdapter"
import { GmailAdapter } from "../../lib/adapter/GmailAdapter"
import { SpreadsheetAdapter } from "../../lib/adapter/SpreadsheetAdapter"
import { newAttachmentConfig } from "../../lib/config/AttachmentConfig"
import { newMessageConfig } from "../../lib/config/MessageConfig"
import { AttachmentProcessor } from "../../lib/processors/AttachmentProcessor"
import { GmailProcessor } from "../../lib/processors/GmailProcessor"
import { MessageProcessor } from "../../lib/processors/MessageProcessor"
import { ThreadProcessor } from "../../lib/processors/ThreadProcessor"
import { Logger } from "../../lib/utils/Logger"
import { Timer } from "../../lib/utils/Timer"
import { ConfigMocks } from "./ConfigMocks"
import { GMailMocks, ThreadData } from "./GMailMocks"
import { MockFactory } from "./MockFactory"

export class ContextMocks {
  public static newEnvContextMock(
    mocks = MockFactory.newMocks(),
    runMode = RunMode.DANGEROUS,
  ) {
    const envContext: EnvContext = {
      type: ContextType.ENV,
      env: {
        gmailApp: mocks.gmailApp,
        gdriveApp: mocks.gdriveApp,
        spreadsheetApp: mocks.spreadsheetApp,
        cacheService: mocks.cacheService,
        utilities: mocks.utilities,
        runMode,
        session: mocks.session,
        timezone: "UTC",
      },
      log: new Logger(),
      meta: {},
    }
    return envContext
  }

  public static newProcessingContextMock(
    envContext = this.newEnvContextMock(),
    config = ConfigMocks.newDefaultConfig(),
  ): ProcessingContext {
    const actionRegistry = GmailProcessor.setupActionRegistry(envContext)
    return GmailProcessor.buildContext(envContext, {
      gdriveAdapter: new GDriveAdapter(envContext),
      gmailAdapter: new GmailAdapter(envContext),
      spreadsheetAdapter: new SpreadsheetAdapter(envContext),
      config,
      actionRegistry: actionRegistry,
      timer: new Timer(config.settings.maxRuntime),
    })
  }

  public static newThreadContextMock(
    processingContext = this.newProcessingContextMock(),
    thread = GMailMocks.newThreadMock(),
    index = 0,
    configIndex = 0,
  ): ThreadContext {
    return ThreadProcessor.buildContext(processingContext, {
      config: processingContext.proc.config.threads[configIndex],
      object: thread,
      configIndex,
      index,
    })
  }

  public static newMessageContextMock(
    threadContext = this.newThreadContextMock(),
    message = GMailMocks.newMessageMock(),
    index = 0,
    configIndex = 0,
  ): MessageContext {
    const config =
      threadContext.thread.config?.messages[configIndex] ?? newMessageConfig()
    return MessageProcessor.buildContext(threadContext, {
      config,
      object: message,
      configIndex,
      index,
    })
  }

  public static newAttachmentContextMock(
    messageContext = this.newMessageContextMock(),
    attachment = GMailMocks.newAttachmentMock(),
    index = 0,
    configIndex = 0,
  ): AttachmentContext {
    const config =
      messageContext.message.config.attachments[configIndex] ??
      newAttachmentConfig()
    return AttachmentProcessor.buildContext(messageContext, {
      config,
      object: attachment,
      configIndex,
      index,
    })
  }

  public static newThreadContextMockFromThreadData(
    data: ThreadData = {},
    ctx: ProcessingContext = ContextMocks.newProcessingContextMock(),
  ): ThreadContext {
    const thread = GMailMocks.newThreadMock(data)
    const threadContext = ContextMocks.newThreadContextMock(ctx, thread)
    return threadContext
  }

  public static newMessageContextMockFromThreadData(
    data: ThreadData = {},
    messageIndex = 0,
    ctx: ProcessingContext = ContextMocks.newProcessingContextMock(),
  ): MessageContext {
    const thread = GMailMocks.newThreadMock(data)
    const msg = thread.getMessages()[
      messageIndex
    ] as MockProxy<GoogleAppsScript.Gmail.GmailMessage>

    const threadContext = ContextMocks.newThreadContextMockFromThreadData(
      data,
      ctx,
    )
    const messageContext = ContextMocks.newMessageContextMock(
      threadContext,
      msg,
      messageIndex,
    )
    return messageContext
  }

  public static newAttachmentContextMockFromThreadData(
    data: ThreadData = {},
    messageIndex = 0,
    attachmentIndex = 0,
    ctx: ProcessingContext = ContextMocks.newProcessingContextMock(),
  ): AttachmentContext {
    const thread = GMailMocks.newThreadMock(data)
    const msg = thread.getMessages()[
      messageIndex
    ] as MockProxy<GoogleAppsScript.Gmail.GmailMessage>
    const attachment = msg.getAttachments()[
      attachmentIndex
    ] as MockProxy<GoogleAppsScript.Gmail.GmailAttachment>

    const messageContext = ContextMocks.newMessageContextMockFromThreadData(
      data,
      messageIndex,
      ctx,
    )
    const attachmentContext = ContextMocks.newAttachmentContextMock(
      messageContext,
      attachment,
      attachmentIndex,
    )
    return attachmentContext
  }
}
