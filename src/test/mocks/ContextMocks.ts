import {
  AttachmentContext,
  EnvContext,
  MessageContext,
  ProcessingContext,
  RunMode,
  ThreadContext,
} from "../../lib/Context"
import { ActionRegistry } from "../../lib/actions/ActionRegistry"
import { GDriveAdapter } from "../../lib/adapter/GDriveAdapter"
import { GmailAdapter } from "../../lib/adapter/GmailAdapter"
import { SpreadsheetAdapter } from "../../lib/adapter/SpreadsheetAdapter"
import { newAttachmentConfig } from "../../lib/config/AttachmentConfig"
import { RequiredConfig, newConfig } from "../../lib/config/Config"
import { newMessageConfig } from "../../lib/config/MessageConfig"
import { newThreadConfig } from "../../lib/config/ThreadConfig"
import { Logger } from "../../lib/utils/Logger"
import { Timer } from "../../lib/utils/Timer"
import { ConfigMocks } from "./ConfigMocks"
import { GMailMocks } from "./GMailMocks"
import { MockFactory } from "./MockFactory"

export class ContextMocks {
  public static newEnvContextMock(
    mocks = MockFactory.newMocks(),
    runMode = RunMode.DANGEROUS,
  ) {
    const envContext: EnvContext = {
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
    }
    return envContext
  }

  public static newProcessingContextMock(
    envContext = this.newEnvContextMock(),
    config = newConfig() as RequiredConfig,
  ): ProcessingContext {
    return {
      ...envContext,
      proc: {
        gdriveAdapter: new GDriveAdapter(envContext),
        gmailAdapter: new GmailAdapter(envContext),
        spreadsheetAdapter: new SpreadsheetAdapter(envContext),
        config,
        actionRegistry: new ActionRegistry(),
        timer: new Timer(config.settings.maxRuntime),
      },
    }
  }

  public static newThreadContextMock(
    processingContext = this.newProcessingContextMock(),
    thread = GMailMocks.newThreadMock(),
  ): ThreadContext {
    return {
      ...processingContext,
      thread: {
        config: newThreadConfig(ConfigMocks.newDefaultThreadConfigJson()),
        object: thread,
        configIndex: 0,
        index: 0,
      },
    }
  }

  public static newMessageContextMock(
    threadContext = this.newThreadContextMock(),
    message = GMailMocks.newMessageMock(),
  ): MessageContext {
    return {
      ...threadContext,
      message: {
        config: newMessageConfig(),
        object: message,
        configIndex: 0,
        index: 0,
      },
    }
  }

  public static newAttachmentContextMock(
    messageContext = this.newMessageContextMock(),
    attachment = GMailMocks.newAttachmentMock(),
  ): AttachmentContext {
    return {
      ...messageContext,
      attachment: {
        config: newAttachmentConfig(),
        object: attachment,
        configIndex: 0,
        index: 0,
      },
    }
  }
}
