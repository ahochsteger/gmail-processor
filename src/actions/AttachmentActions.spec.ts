import { ActionRegistry } from "./ActionRegistry"
import { ConflictStrategy } from "../adapter/GDriveAdapter"
import { Config } from "../config/Config"
import { MockFactory, Mocks } from "../../test/mocks/MockFactory"

let mocks: Mocks
let dryRunMocks: Mocks

beforeEach(() => {
  mocks = MockFactory.newMocks(new Config(), false)
  dryRunMocks = MockFactory.newMocks(new Config(), true)
})

it("should provide actions in the action registry", () => {
  expect(mocks.attachmentActions).not.toBeNull()

  const actionMap = ActionRegistry.getActionMap()
  expect(
    Object.keys(actionMap)
      .filter((v) => v.startsWith("attachment"))
      .sort(),
  ).toEqual(["attachment.storeToGDrive"])
})

it("should create a file", () => {
  mocks.attachmentActions.storeToGDrive(
    "test-location",
    ConflictStrategy.REPLACE,
    "automated test",
  )
  expect(mocks.folder.createFile).toBeCalled()
})

it("should not create a file on dry-run", () => {
  dryRunMocks.attachmentActions.storeToGDrive(
    "test-location",
    ConflictStrategy.REPLACE,
    "automated test",
  )
  expect(mocks.folder.createFile).not.toBeCalled()
})
