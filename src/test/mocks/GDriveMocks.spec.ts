import {
  MockProxy,
  anyString,
  matches,
  mock,
  mockDeep,
} from "jest-mock-extended"
import { EntryScope, FileData, FolderData, GDriveData } from "./GDriveData"
import {
  CREATED_FILE_ID,
  CREATED_FILE_NAME,
  CREATED_FOLDER_ID,
  CREATED_FOLDER_NAME,
  EXISTING_FILE_ID,
  EXISTING_FILE_NAME,
  EXISTING_FOLDER_ID,
  EXISTING_FOLDER_NAME,
  GDriveMocks,
  LOGSHEET_FILE_ID,
  LOGSHEET_FILE_NAME,
  NO_FILE_ID,
  NO_FILE_NAME,
  NO_FOLDER_ID,
  NO_FOLDER_NAME,
  ROOT_FOLDER_ID,
  ROOT_FOLDER_NAME,
} from "./GDriveMocks"
import { MockFactory, Mocks } from "./MockFactory"

let driveSpec: GDriveData
let mocks: Mocks

beforeAll(() => {
  mocks = MockFactory.newMocks()
  driveSpec = new GDriveData(
    mocks.rootFolder,
    ROOT_FOLDER_ID,
    ROOT_FOLDER_NAME,
    EntryScope.EXISTING,
    [
      new FileData(mocks.existingFile, EXISTING_FILE_ID, EXISTING_FILE_NAME),
      new FileData(
        mocks.logSpreadsheetFile,
        LOGSHEET_FILE_ID,
        LOGSHEET_FILE_NAME,
      ),
      new FolderData(
        mocks.existingFolder,
        EXISTING_FOLDER_ID,
        EXISTING_FOLDER_NAME,
      ),
      new FileData(
        mocks.newFile,
        CREATED_FILE_ID,
        CREATED_FILE_NAME,
        EntryScope.CREATED,
      ),
      new FolderData(
        mocks.newFolder,
        CREATED_FOLDER_ID,
        CREATED_FOLDER_NAME,
        EntryScope.CREATED,
      ),
    ],
  )
})

describe("mock behavior", () => {
  it("should use calledWith correctly", () => {
    const folder: MockProxy<GoogleAppsScript.Drive.Folder> =
      mock<GoogleAppsScript.Drive.Folder>()
    const noFileIterator: MockProxy<GoogleAppsScript.Drive.FileIterator> =
      mock<GoogleAppsScript.Drive.FileIterator>()
    const existingFileIterator: MockProxy<GoogleAppsScript.Drive.FileIterator> =
      mock<GoogleAppsScript.Drive.FileIterator>()
    folder.getFilesByName
      .calledWith(anyString())
      .mockReturnValue(noFileIterator)
    folder.getFilesByName
      .calledWith(matches((v) => v === EXISTING_FILE_NAME))
      .mockReturnValue(existingFileIterator)
    expect(folder.getFilesByName(EXISTING_FILE_NAME)).toBe(existingFileIterator)
    expect(folder.getFilesByName(NO_FILE_NAME)).toBe(noFileIterator)
  })
})

describe("setupFile()", () => {
  it("should setup a default file", () => {
    const file = GDriveMocks.setupFileMocks(
      new FileData(mocks.existingFile, EXISTING_FILE_ID, EXISTING_FILE_NAME),
      mocks.existingFile,
    )
    expect(file.setContent("test")).toBe(file)
    expect(file.setDescription("test")).toBe(file)
    expect(file.setName("test")).toBe(file)
    expect(file.moveTo(mock<GoogleAppsScript.Drive.Folder>())).toBe(file)
  })

  it("should setup a given file", () => {
    const originalFile = mock<GoogleAppsScript.Drive.File>()
    const file = GDriveMocks.setupFileMocks(
      new FileData(originalFile, EXISTING_FILE_ID, EXISTING_FILE_NAME),
      originalFile,
    )
    expect(file).toBe(originalFile)
    expect(file.setContent("test")).toBe(file)
    expect(file.setDescription("test")).toBe(file)
    expect(file.setName("test")).toBe(file)
    expect(file.moveTo(mock<GoogleAppsScript.Drive.Folder>())).toBe(file)
  })
})

describe("setupFolder()", () => {
  // it("should create a file/folder", () => {
  //   const folder = mock<GoogleAppsScript.Drive.Folder>()
  //   folder.createFile.mockReturnValueOnce(mocks.newFile)
  //   folder.createFolder.mockReturnValueOnce(mocks.newFolder)
  //   expect(folder.createFile(CREATED_FILE_NAME, "content", "plain/text")).toBe(
  //     mocks.newFile,
  //   )
  //   expect(folder.createFolder(CREATED_FOLDER_NAME)).toBe(mocks.newFolder)
  // })
  it("should setup a default folder", () => {
    const folder = GDriveMocks.setupFolderMocks(driveSpec)
    expect(folder.getFilesByName(NO_FILE_NAME).hasNext()).toBeFalsy()
    expect(() => {
      folder.getFilesByName(NO_FILE_NAME).next()
    }).toThrowError()
    expect(folder.getFoldersByName(NO_FOLDER_NAME).hasNext()).toBeFalsy()
    expect(() => {
      folder.getFoldersByName(NO_FOLDER_NAME).next()
    }).toThrowError()
    expect(
      folder.createFile(CREATED_FILE_NAME, "content", "plain/text"),
    ).toBeDefined()
    expect(folder.createFolder(CREATED_FOLDER_NAME)).toBeDefined()
  })
  it("should setup a folder with drive data", () => {
    const originalFolder = mock<GoogleAppsScript.Drive.Folder>()
    const folder = GDriveMocks.setupFolderMocks(driveSpec, originalFolder)
    expect(folder).toBe(originalFolder)

    // Test existing files/folders
    let fileIterator = folder.getFilesByName(EXISTING_FILE_NAME)
    expect(fileIterator.hasNext()).toEqual(true)
    expect(fileIterator.next()).toBe(mocks.existingFile)
    let folderIterator = folder.getFoldersByName(EXISTING_FOLDER_NAME)
    expect(folderIterator.hasNext()).toBeTruthy()
    expect(folderIterator.next()).toBe(mocks.existingFolder)

    // Test non-existing files/folders:
    fileIterator = folder.getFilesByName(NO_FILE_NAME)
    expect(fileIterator.hasNext()).toBeFalsy()
    expect(() => {
      fileIterator.next()
    }).toThrowError()
    folderIterator = folder.getFoldersByName(NO_FOLDER_NAME)
    expect(folderIterator.hasNext()).toBeFalsy()
    expect(() => {
      folderIterator.next()
    }).toThrowError()
    expect(
      folder.createFile(CREATED_FILE_NAME, "content", "plain/text"),
    ).toBeDefined()
    expect(folder.createFolder(CREATED_FOLDER_NAME)).toBeDefined()

    // Test file/folder creation:
    expect(
      folder.createFile(CREATED_FILE_NAME, "new-content", "plain/text"),
    ).toBe(mocks.newFile)
    expect(folder.createFolder(CREATED_FOLDER_NAME)).toBe(mocks.newFolder)
  })
})

describe("setupFileIterator()", () => {
  it("should setup a default file iterator", () => {
    const it = GDriveMocks.setupFileIterator()
    expect(it.hasNext()).toBeFalsy() // First invokation
    expect(it.hasNext()).toBeFalsy() // Second invokation
    expect(() => {
      it.next()
    }).toThrowError()
    expect(() => {
      it.next()
    }).toThrowError()
  })
  it("should setup a default file iterator with an existing file", () => {
    const file = mock<GoogleAppsScript.Drive.File>()
    const it = GDriveMocks.setupFileIterator([
      new FileData(file, "some-id", "some-name"),
    ])
    expect(it.hasNext()).toBeTruthy() // First invokation
    expect(it.hasNext()).toBeFalsy() // Second invokation
    expect(it.next()).toBe(file)
    expect(() => {
      it.next()
    }).toThrowError()
  })
})

describe("setupFolderIterator()", () => {
  it("should setup a default folder iterator", () => {
    const it = GDriveMocks.setupFolderIterator()
    expect(it.hasNext()).toBeFalsy() // First invokation
    expect(it.hasNext()).toBeFalsy() // Second invokation
    expect(() => {
      it.next()
    }).toThrowError()
    expect(() => {
      it.next()
    }).toThrowError()
  })
  it("should setup a default folder iterator with an existing folder", () => {
    const folder = mock<GoogleAppsScript.Drive.Folder>()
    const it = GDriveMocks.setupFolderIterator([
      new FolderData(folder, "some-id", "some-name"),
    ])
    expect(it.hasNext()).toBeTruthy() // First invokation
    expect(it.hasNext()).toBeFalsy() // Second invokation
    expect(it.next()).toBe(folder)
    expect(() => {
      it.next()
    }).toThrowError()
  })
})

describe("setupGDriveApp", () => {
  it("should provide a default drive app", () => {
    const app = GDriveMocks.setupGDriveAppMocks(driveSpec)
    expect(app.getRootFolder()).toBeDefined()
    // TODO: Add more expectations!
  })
  it("should provide a drive app with defined files and folders", () => {
    const initialApp = mockDeep<GoogleAppsScript.Drive.DriveApp>({
      // TODO: Use fallbackMockImplementation by default for all mocks to spot missing mocked functions!
      fallbackMockImplementation: () => {
        throw new Error("No mock implementation available!")
      },
    })

    const app = GDriveMocks.setupGDriveAppMocks(driveSpec, initialApp)

    // Test get file/folder by ID:
    expect(app.getFileById(EXISTING_FILE_ID)).toBe(mocks.existingFile)
    expect(app.getFolderById(EXISTING_FOLDER_ID)).toBe(mocks.existingFolder)
    expect(() => {
      app.getFileById(NO_FILE_ID)
    }).toThrowError()
    expect(() => {
      app.getFolderById(NO_FOLDER_ID)
    }).toThrowError()

    // Test file/folder iterators:
    // jest.clearAllMocks()
    const rootFolder = app.getRootFolder()
    expect(rootFolder).toBeDefined()
    const fileIterator = rootFolder.getFilesByName(EXISTING_FILE_NAME)
    expect(fileIterator.hasNext()).toBeTruthy()
    expect(fileIterator.next()).toBe(mocks.existingFile)
    expect(fileIterator.hasNext()).toBeFalsy()
    expect(() => {
      fileIterator.next()
    }).toThrowError()
    const folderIterator = rootFolder.getFoldersByName(EXISTING_FOLDER_NAME)
    expect(folderIterator.hasNext()).toBeTruthy()
    expect(folderIterator.next()).toBe(mocks.existingFolder)
    expect(folderIterator.hasNext()).toBeFalsy()
    expect(() => {
      folderIterator.next()
    }).toThrowError()

    // Test file/folder creation:
    expect(
      rootFolder.createFile(CREATED_FILE_NAME, "new-content", "plain/text"),
    ).toBe(mocks.newFile)
    expect(rootFolder.createFolder(CREATED_FOLDER_NAME)).toBe(mocks.newFolder)
  })
})
