import { ConfigMocks } from "../../test/mocks/ConfigMocks"
import {
  NEW_DOCS_FILE_NAME,
  NEW_FILE_NAME,
  NEW_FILE_PATH,
} from "../../test/mocks/GDriveMocks"
import { MockFactory, Mocks } from "../../test/mocks/MockFactory"
import { AttachmentContext, ProcessingContext, RunMode } from "../Context"
import { ConflictStrategy } from "../adapter/GDriveAdapter"
import { ActionProvider, ActionRegistry } from "./ActionRegistry"
import { AttachmentActions } from "./AttachmentActions"

let mocks: Mocks
let actionRegistry: ActionRegistry
let actionProvider: ActionProvider<AttachmentContext>

beforeEach(() => {
  mocks = MockFactory.newMocks()
  actionRegistry = new ActionRegistry()
  actionProvider = new AttachmentActions()
  actionRegistry.registerActionProvider(
    "attachment",
    actionProvider as ActionProvider<ProcessingContext>,
  )
})

it("should provide actions in the action registry", () => {
  const actionNames = Array.from(actionRegistry.getActions().keys())
    .filter((v) => v.startsWith("attachment."))
    .sort()
  expect(actionNames).toEqual([
    "attachment.extractText",
    "attachment.noop",
    "attachment.store",
  ])
})

it("should provide attachment.store in the action registry", () => {
  const actual = actionRegistry.getAction("attachment.store")
  const expected = AttachmentActions.store
  expect(actual).toEqual(expected)
})

it("should create a file with leading slash location", () => {
  const result = AttachmentActions.store(mocks.attachmentContext, {
    location: `/${NEW_FILE_NAME}`,
    conflictStrategy: ConflictStrategy.KEEP,
    description: "automated test",
  })
  expect(result.file).toBe(mocks.newFile)
  expect(mocks.rootFolder.createFile).toBeCalled()
})

it("should create a file without a leading slash location", () => {
  const result = AttachmentActions.store(mocks.attachmentContext, {
    location: `${NEW_FILE_NAME}`,
    conflictStrategy: ConflictStrategy.KEEP,
    description: "automated test",
  })
  expect(result.file).toBe(mocks.newFile)
  expect(mocks.rootFolder.createFile).toBeCalled()
})

it("should not create a file on dry-run mode", () => {
  const dryRunMocks = MockFactory.newMocks(
    ConfigMocks.newDefaultConfig(),
    RunMode.DRY_RUN,
  )
  AttachmentActions.store(dryRunMocks.attachmentContext, {
    location: NEW_FILE_PATH,
    conflictStrategy: ConflictStrategy.REPLACE,
    description: "automated test",
  })
  expect(mocks.rootFolder.createFile).not.toHaveBeenCalled()
})

it("should create a file on dangerous mode", () => {
  AttachmentActions.store(mocks.attachmentContext, {
    location: NEW_FILE_PATH,
    conflictStrategy: ConflictStrategy.KEEP,
    description: "automated test",
  })
  expect(mocks.rootFolder.createFile).toHaveBeenCalled()
})

it("should execute all actions using the action registry", () => {
  const ctx = mocks.attachmentContext
  actionRegistry.executeAction(ctx, "attachment.store", {
    location: NEW_FILE_PATH,
    conflictStrategy: ConflictStrategy.REPLACE,
    description: "my description",
  })
})

it("should extract matched regex from the attachment using OCR", () => {
  const result = AttachmentActions.extractText(mocks.attachmentContext, {
    docsFileLocation: NEW_DOCS_FILE_NAME,
    extract:
      "Invoice date:\\s*(?<invoiceDate>[0-9-]+)\\s*Invoice number:\\s*(?<invoiceNumber>[0-9]+)",
  })
  const invoiceDate = "2024-03-13"
  const invoiceNumber = "12345678"
  expect(result.ok).toBeTruthy()
  expect(
    result.actionMeta!["attachment.extracted.match.invoiceDate"].value,
  ).toEqual(invoiceDate)
  expect(
    result.actionMeta!["attachment.extracted.match.invoiceNumber"].value,
  ).toEqual(invoiceNumber)
})
