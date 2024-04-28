import { ConfigMocks } from "../../test/mocks/ConfigMocks"
import {
  E2E_BASE_FOLDER_NAME,
  NEW_FILE_NAME,
  NEW_HTML_FILE_CONTENT,
  NEW_HTML_FILE_NAME,
  NEW_PDF_FILE_CONTENT,
  NEW_PDF_FILE_NAME,
} from "../../test/mocks/GDriveMocks"
import { MockFactory, Mocks } from "../../test/mocks/MockFactory"
import { ProcessingContext, RunMode } from "../Context"
import { ConflictStrategy } from "../adapter/GDriveAdapter"
import { ActionProvider, ActionRegistry } from "./ActionRegistry"
import { MessageActions } from "./MessageActions"

let mocks: Mocks
let actionRegistry: ActionRegistry

beforeEach(() => {
  mocks = MockFactory.newMocks()
  actionRegistry = new ActionRegistry()
  actionRegistry.registerActionProvider(
    "message",
    new MessageActions() as ActionProvider<ProcessingContext>,
  )
})

it("should provide actions in the action registry", () => {
  expect(MessageActions).not.toBeNull()

  const actionNames = Array.from(actionRegistry.getActions().keys())
    .filter((v) => v.startsWith("message."))
    .sort()
  expect(actionNames).toEqual([
    "message.exportAsHtml",
    "message.exportAsPdf",
    "message.forward",
    "message.markRead",
    "message.markUnread",
    "message.moveToTrash",
    "message.noop",
    "message.star",
    "message.storeFromURL",
    "message.storePDF",
    "message.unstar",
  ])
})

it("should forward a message", () => {
  MessageActions.forward(mocks.messageContext, { to: "test" })
  expect(mocks.message.forward).toBeCalled()
})

it("should not forward a message (dry-run)", () => {
  const dryRunMocks = MockFactory.newMocks(
    ConfigMocks.newDefaultConfig(),
    RunMode.DRY_RUN,
  )
  MessageActions.forward(dryRunMocks.messageContext, { to: "test" })
  expect(dryRunMocks.message.forward).not.toBeCalled()
})

it("should export a message as HTML", () => {
  const result = MessageActions.exportAsHtml(mocks.messageContext, {
    location: `${E2E_BASE_FOLDER_NAME}/${NEW_HTML_FILE_NAME}`,
    conflictStrategy: ConflictStrategy.KEEP,
  })
  expect(mocks.newHtmlBlob.getDataAsString()).toEqual(NEW_HTML_FILE_CONTENT)
  expect(result.file).toBeDefined()
})

it("should export a message as PDF", () => {
  const result = MessageActions.exportAsPdf(mocks.messageContext, {
    location: `${E2E_BASE_FOLDER_NAME}/${NEW_PDF_FILE_NAME}`,
    conflictStrategy: ConflictStrategy.KEEP,
  })
  expect(mocks.newHtmlBlob.getAs).toHaveBeenCalledWith("application/pdf")
  expect(mocks.newPdfBlob.getDataAsString()).toEqual(NEW_PDF_FILE_CONTENT)
  expect(result.file).toBeDefined()
})

it("should store a message as PDF", () => {
  const result = MessageActions.storePDF(mocks.messageContext, {
    location: `${E2E_BASE_FOLDER_NAME}/${NEW_PDF_FILE_NAME}`,
    conflictStrategy: ConflictStrategy.KEEP,
    skipHeader: false,
  })
  expect(mocks.newHtmlBlob.getAs).toHaveBeenCalledWith("application/pdf")
  expect(mocks.newPdfBlob.getDataAsString()).toEqual(NEW_PDF_FILE_CONTENT)
  expect(result.file).toBeDefined()
})

it("should store a document from a static URL", () => {
  const result = MessageActions.storeFromURL(mocks.messageContext, {
    url: "https://raw\\.githubusercontent\\.com/ahochsteger/gmail-processor/main/src/e2e-test/files/.+\\.txt",
    location: `/${NEW_FILE_NAME}`,
    conflictStrategy: ConflictStrategy.KEEP,
  })
  expect(mocks.urlFetchApp.fetch).toBeCalled()
  expect(result.file).toBeDefined()
})

it("should store a document from an extracted URL", () => {
  mocks = MockFactory.newMocks(ConfigMocks.newComplexConfigJson())
  const result = MessageActions.storeFromURL(mocks.messageContext, {
    url: "${message.body.match.url}",
    location: `/${NEW_FILE_NAME}`,
    conflictStrategy: ConflictStrategy.KEEP,
  })
  expect(mocks.urlFetchApp.fetch).toBeCalled()
  expect(result.file).toBeDefined()
})

it("should fail on invalid URLs", () => {
  const result = MessageActions.storeFromURL(mocks.messageContext, {
    url: "${message.body.match.non-matching-url}",
    location: `/${NEW_FILE_NAME}`,
    conflictStrategy: ConflictStrategy.KEEP,
  })
  expect(mocks.urlFetchApp.fetch).not.toBeCalled()
  expect(result.ok).toBeFalsy()
  expect(result.file).not.toBeDefined()
})

it("should execute all actions using the action registry", () => {
  const ctx = mocks.messageContext
  const nonArgActions = [
    "message.forward",
    "message.markRead",
    "message.markUnread",
    "message.moveToTrash",
    "message.star",
    "message.unstar",
  ]
  // Execute all non-arg actions:
  nonArgActions.forEach((actionName) => {
    actionRegistry.executeAction(ctx, actionName, {})
  })
  // Execute all actions with arguments:
  actionRegistry.executeAction(ctx, "message.forward", {
    to: "some.email@example.com",
  })
  actionRegistry.executeAction(ctx, "message.storePDF", {
    location: "/my-location",
    conflictStrategy: ConflictStrategy.REPLACE,
    description: "my description",
    skipHeader: false,
  })
})
