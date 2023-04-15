import { ActionProvider, ActionRegistry } from "./ActionRegistry"
import { ConflictStrategy } from "../adapter/GDriveAdapter"
import { Config } from "../config/Config"
import { MockFactory, Mocks } from "../../test/mocks/MockFactory"
import { AttachmentActions } from "./AttachmentActions"
import { AttachmentContext, ProcessingContext } from "../Context"

let mocks: Mocks
let dryRunMocks: Mocks
let actionRegistry: ActionRegistry
let actionProvider: ActionProvider<AttachmentContext>

beforeEach(() => {
  mocks = MockFactory.newMocks(new Config(), false)
  actionRegistry = new ActionRegistry()
  actionProvider = new AttachmentActions()
  actionRegistry.registerActionProvider(
    "attachment",
    actionProvider as ActionProvider<ProcessingContext>,
  )

  dryRunMocks = MockFactory.newMocks(new Config(), true)
})

describe("AttachmenActions", () => {
  it("should provide attachment.storeToGDrive in the action registry", () => {
    expect(actionRegistry.getAction("attachment.storeToGDrive")).toBe(
      actionProvider.storeToGDrive,
    )
  })

  it("should create a file", () => {
    mocks.attachmentActions.storeToGDrive(mocks.attachmentContext, {
      location: "test-location",
      conflictStrategy: ConflictStrategy.REPLACE,
      description: "automated test",
    })
    expect(mocks.folder.createFile).toBeCalled()
  })

  it("should not create a file on dry-run", () => {
    dryRunMocks.attachmentActions.storeToGDrive(dryRunMocks.attachmentContext, {
      location: "test-location",
      conflictStrategy: ConflictStrategy.REPLACE,
      description: "automated test",
    })
    expect(mocks.folder.createFile).not.toBeCalled()
  })
})
