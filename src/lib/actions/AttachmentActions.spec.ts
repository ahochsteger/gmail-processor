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

jest.mock("@cantoo/pdf-lib", () => ({
  PDFDocument: {
    load: jest.fn().mockResolvedValue({
      save: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
    }),
  },
}))

let mocks: Mocks
let actionRegistry: ActionRegistry
let actionProvider: ActionProvider<AttachmentContext>

beforeAll(() => {
  mocks = MockFactory.newMocks()
  actionRegistry = new ActionRegistry()
  actionProvider = new AttachmentActions()
  actionRegistry.registerActionProvider(
    "attachment",
    actionProvider as ActionProvider<ProcessingContext>,
  )
})

beforeEach(() => {
  jest.clearAllMocks()
})

it("should provide actions in the action registry", () => {
  const actionNames = Array.from(actionRegistry.getActions().keys())
    .filter((v) => v.startsWith("attachment."))
    .sort()
  expect(actionNames).toEqual([
    "attachment.extractText",
    "attachment.noop",
    "attachment.store",
    "attachment.storeDecryptedPdf",
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
  expect(mocks.rootFolder.createFile).toHaveBeenCalled()
})

it("should create a file without a leading slash location", () => {
  const result = AttachmentActions.store(mocks.attachmentContext, {
    location: `${NEW_FILE_NAME}`,
    conflictStrategy: ConflictStrategy.KEEP,
    description: "automated test",
  })
  expect(result.file).toBe(mocks.newFile)
  expect(mocks.rootFolder.createFile).toHaveBeenCalled()
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

it("should store a decrypted PDF", async () => {
  mocks.newPdfBlob.getName.mockReturnValue("generic-decrypted.pdf")
  const result = await AttachmentActions.storeDecryptedPdf(
    mocks.attachmentContext,
    {
      location: "/generic-decrypted.pdf",
      conflictStrategy: ConflictStrategy.REPLACE,
      description: "automated test {{attachment.name}}",
      password: "password-{{attachment.name}}",
    },
  )
  expect(result.file).toBe(mocks.genericNewFile)
  expect(mocks.envContext.env.utilities.newBlob).toHaveBeenCalled()
})

it("should catch errors when storing a decrypted PDF", async () => {
  mocks.envContext.env.utilities.newBlob = jest.fn().mockImplementation(() => {
    throw new Error("Blob creation failed")
  })
  await expect(
    AttachmentActions.storeDecryptedPdf(
      mocks.attachmentContext,
      {
        location: "/generic-decrypted.pdf",
        conflictStrategy: ConflictStrategy.REPLACE,
        description: "automated test {{attachment.name}}",
        password: "password-{{attachment.name}}",
      },
    )
  ).rejects.toThrow("Blob creation failed")
})

it("should extract matched regex from the attachment using OCR", () => {
  const result = AttachmentActions.extractText(mocks.attachmentContext, {
    docsFileLocation: NEW_DOCS_FILE_NAME,
    extract:
      "Invoice date:\\s*(?<invoiceDate>[0-9-]+)\\s*Invoice number:\\s*(?<invoiceNumber>[0-9]+)",
  })
  const invoiceDate = "2024-03-13"
  const invoiceNumber = "12345678"
  expect(
    result.actionMeta!["attachment.extracted.match.invoiceDate"]?.value,
  ).toEqual(invoiceDate)
  expect(
    result.actionMeta!["attachment.extracted.match.invoiceNumber"]?.value,
  ).toEqual(invoiceNumber)
})
