import { ActionProvider } from "./actions/ActionProvider"
import { AllActions } from "./actions/AllActions"
import { Config } from "./config/Config"
import { GoogleAppsScriptContext } from "./context/GoogleAppsScriptContext"
import { ProcessingContext } from "./context/ProcessingContext"
import { GmailProcessor } from "./GmailProcessor"
import { ThreadProcessor } from "./processors/ThreadProcessor"
import { anyString, mock } from "jest-mock-extended"

const settings = {
  // Global filter
  globalFilter: "-in:trash -in:drafts -in:spam",
  // Maximum script runtime in seconds (google scripts will be killed after 5 minutes):
  maxRuntime: 280,
  // Only process message newer than (leave empty for no restriction; use d, m and y for day, month and year):
  newerThan: "1m",
  // Gmail label for processed threads (will be created, if not existing):
  processedLabel: "to-gdrive/processed",
  // Sleep time in milli seconds between processed messages:
  sleepTime: 100,
  // Timezone for date/time operations:
  timezone: "GMT",
}

const threadRules = [
  // Responsible: ThreadProcessor.processRules
  {
    // Responsible: ThreadProcessor.processRule
    description:
      "Example that stores all attachments of all found threads to a certain GDrive folder",
    filter: "has:attachment from:example@example.com",
    commands: [
      // Responsible: ThreadProcessor.performActions
      {
        // Responsible: ThreadProcessor.performAction
        name: "attachment.storeToGDrive",
        args: { location: "Folder1/Subfolder1/${attachment.name}" },
      },
    ],
  },
  {
    // Responsible: ThreadProcessor.processRule
    description:
      "Example that stores all attachments of matching messages to a certain GDrive folder",
    filter: "has:attachment from:example@example.com",
    messagesRules: [
      // Responsible: MessageProcessor.processRules
      {
        // Responsible: MessageProcessor.processRule
        commands: [
          // Responsible: MessageProcessor.performActions
          {
            // Responsible: MessageProcessor.performAction
            name: "attachment.storeToGDrive",
            args: { location: "Folder1/Subfolder1/${attachment.name}" },
          },
        ],
        match: {
          // Responsible: MessageProcessor.matches
          from: "(.+)@example.com",
          subject: "Prefix - (.*) - Suffix(.*)",
          to: "my\\.address\\+(.+)@gmail.com",
        },
      },
    ],
  },
  {
    filter: "has:attachment from:example4@example.com",
    messagesRules: [
      // Responsible: MessageProcessor.processRules
      {
        // Responsible: MessageProcessor.processRule
        match: {
          // Responsible: MessageProcessor.matches
          from: "(.+)@example.com",
          subject: "Prefix - (.*) - Suffix(.*)",
          to: "my\\.address\\+(.+)@gmail.com",
          // TODO: Find out how to match only read/unread or starred/unstarred messages?
        },
        commands: [
          // Responsible: MessageProcessor.performActions
          // TODO: Decide if only actions of a certain type (thread, message, attachment) are allowed?
          // Pro: More flexible (e.g. forward message, if a certain attachment rule matches)
          { name: "markMessageRead" }, // Responsible: MessageProcessor.processAction
        ],
        attachmentRules: [
          // Responsible: AttachmentProcessor.processRules
          {
            // Responsible: AttachmentProcessor.processRule
            match: { name: "Image-([0-9]+)\\.jpg" }, // Responsible: AttachmentProcessor.matches
            commands: [
              // Responsible: AttachmentProcessor.performActions
              {
                // Responsible: AttachmentProcessor.performAction
                name: "attachment.storeToGDrive",
                args: {
                  // tslint:disable-next-line: max-line-length
                  location:
                    "Folder2/Subfolder2/${message.subject.match.1}/${email.subject} - ${match.att.1}.jpg",
                  conflictStrategy: "replace",
                },
              },
            ],
          },
          {
            match: { name: ".+\\..+" },
            commands: [
              {
                name: "storeAttachment",
                args: {
                  location:
                    "Folder3/Subfolder3/${att.basename}-${date:yyyy-MM-dd}.${att.ext}",
                  conflictStrategy: "skip",
                },
              },
            ],
          },
        ],
      },
    ],
  },
]

// Google Apps Script Dependencies:
const mockedGmailApp = mock<GoogleAppsScript.Gmail.GmailApp>()
const mockedGdriveApp = mock<GoogleAppsScript.Drive.DriveApp>()
const mockedLogger = mock<GoogleAppsScript.Base.Logger>()
const mockedUtilities = mock<GoogleAppsScript.Utilities.Utilities>()

const config: Config = new Config(settings, threadRules)
const gasContext: GoogleAppsScriptContext = new GoogleAppsScriptContext(
  mockedGmailApp,
  mockedGdriveApp,
  mockedLogger,
  mockedUtilities,
)
const actionProvider: ActionProvider = new AllActions(gasContext, config)
const threadProcessor: ThreadProcessor = new ThreadProcessor(
  mockedGmailApp,
  actionProvider,
  new ProcessingContext(gasContext, config),
)
const gmailProcessor: GmailProcessor = new GmailProcessor(
  gasContext,
  config,
  actionProvider,
  threadProcessor,
)
describe("GmailProcessor", () => {
  it("should process the thread rules", () => {
    // Prepare fake result for search() in substitute:
    // mockedGmailApp.search(Arg.any(), 1, config.maxBatchSize).returns([])
    mockedGmailApp.search
      .calledWith(anyString(), 1, config.maxBatchSize)
      .mockReturnValue([])
    gmailProcessor.run()
    expect(mockedGmailApp.search).toHaveBeenCalledTimes(
      config.threadRules.length,
    )
    // mockedGmailApp.received(config.threadRules.length).search(anyString(), 1, config.maxBatchSize)
  })
  test.todo("should support date filter (newerThan) at rule level") // See PR #60
  test.todo("should support writing logs to Google Spreadsheet") // See PR #40
  test.todo("should not handle messages in trash") // See PR #39
})
