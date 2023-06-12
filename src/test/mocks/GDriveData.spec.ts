import { mock } from "jest-mock-extended"
import { EntryScope, FileData, FolderData, GDriveData } from "./GDriveData"
import { ROOT_FOLDER_ID, ROOT_FOLDER_NAME } from "./GDriveMocks"

let driveData: GDriveData

const rootFolder = mock<GoogleAppsScript.Drive.Folder>()
const existingFile1 = mock<GoogleAppsScript.Drive.File>()
const existingFile2 = mock<GoogleAppsScript.Drive.File>()
const newFile1 = mock<GoogleAppsScript.Drive.File>()
const newFile2 = mock<GoogleAppsScript.Drive.File>()
const existingFolder1 = mock<GoogleAppsScript.Drive.Folder>()
const existingFolder2 = mock<GoogleAppsScript.Drive.Folder>()
const newFolder1 = mock<GoogleAppsScript.Drive.Folder>()
const newFolder2 = mock<GoogleAppsScript.Drive.Folder>()
const existingNestedFile1 = mock<GoogleAppsScript.Drive.File>()
const existingNestedFile2 = mock<GoogleAppsScript.Drive.File>()
const existingNestedFolder1 = mock<GoogleAppsScript.Drive.Folder>()
const existingNestedFolder2 = mock<GoogleAppsScript.Drive.Folder>()

beforeAll(() => {
  driveData = new GDriveData(
    rootFolder,
    ROOT_FOLDER_ID,
    ROOT_FOLDER_NAME,
    EntryScope.EXISTING,
    [
      new FileData(
        existingFile1,
        "existing-file-1",
        "existing-file-1.txt",
        EntryScope.EXISTING,
      ),
      new FileData(
        existingFile2,
        "existing-file-2",
        "existing-file-2.txt",
        EntryScope.EXISTING,
      ),
      new FileData(
        newFile1,
        "new-file-1",
        "new-file-1.txt",
        EntryScope.CREATED,
      ),
      new FileData(
        newFile2,
        "new-file-2",
        "new-file-2.txt",
        EntryScope.CREATED,
      ),
      new FolderData(
        existingFolder1,
        "existing-folder-1",
        "existing-folder-1",
        EntryScope.EXISTING,
        [
          new FileData(
            existingNestedFile1,
            "existing-nested-file-1",
            "existing-nested-file-1.txt",
            EntryScope.EXISTING,
          ),
          new FileData(
            existingNestedFile2,
            "existing-nested-file-2",
            "existing-nested-file-2.txt",
            EntryScope.EXISTING,
          ),
          new FolderData(
            existingNestedFolder1,
            "existing-nested-folder-1",
            "existing-nested-folder-1",
            EntryScope.EXISTING,
            [],
          ),
          new FolderData(
            existingNestedFolder2,
            "existing-nested-folder-2",
            "existing-nested-folder-2",
            EntryScope.EXISTING,
            [],
          ),
        ],
      ),
      new FolderData(
        existingFolder2,
        "existing-folder-2",
        "existing-folder-2",
        EntryScope.EXISTING,
        [],
      ),
      new FolderData(
        newFolder1,
        "new-folder-1",
        "new-folder-1",
        EntryScope.CREATED,
      ),
      new FolderData(
        newFolder2,
        "new-folder-2",
        "new-folder-2",
        EntryScope.CREATED,
      ),
    ],
  )
})

describe("getEntries()", () => {
  it("should return all direct entries", () => {
    expect(driveData.getEntries().map((f) => f.id)).toEqual([
      "existing-file-1",
      "existing-file-2",
      "existing-folder-1",
      "existing-folder-2",
    ])
  })
})
describe("getFiles()", () => {
  it("should return all direct files", () => {
    expect(driveData.getFiles().map((f) => f.id)).toEqual([
      "existing-file-1",
      "existing-file-2",
    ])
  })
})
describe("getFolders()", () => {
  it("should return all direct folders", () => {
    expect(driveData.getFolders().map((f) => f.id)).toEqual([
      "existing-folder-1",
      "existing-folder-2",
    ])
  })
})
describe("getNestedEntries()", () => {
  it("should return all nested entries", () => {
    expect(
      driveData
        .getNestedEntries()
        .map((f) => f.id)
        .sort(),
    ).toEqual(
      [
        ROOT_FOLDER_ID,
        "existing-file-1",
        "existing-file-2",
        "existing-folder-1",
        "existing-folder-2",
        "existing-nested-file-1",
        "existing-nested-file-2",
        "existing-nested-folder-1",
        "existing-nested-folder-2",
      ].sort(),
    )
  })
})
describe("getNestedFiles()", () => {
  it("should return all nested files", () => {
    expect(driveData.getNestedFiles().map((f) => f.id)).toEqual([
      "existing-file-1",
      "existing-file-2",
      "existing-nested-file-1",
      "existing-nested-file-2",
    ])
  })
})
describe("getNestedFolders()", () => {
  it("should return all nested folders", () => {
    expect(
      driveData
        .getNestedFolders()
        .map((f) => f.id)
        .sort(),
    ).toEqual(
      [
        ROOT_FOLDER_ID,
        "existing-folder-1",
        "existing-folder-2",
        "existing-nested-folder-1",
        "existing-nested-folder-2",
      ].sort(),
    )
  })
})
describe("getFileById()", () => {
  it("should return the file with the given ID", () => {
    expect(driveData.getFileById("existing-nested-file-2")?.id).toEqual(
      "existing-nested-file-2",
    )
  })
})
describe("getFolderById()", () => {
  it("should return the folder with the given ID", () => {
    expect(driveData.getFolderById("existing-nested-folder-2")?.id).toEqual(
      "existing-nested-folder-2",
    )
  })
})
