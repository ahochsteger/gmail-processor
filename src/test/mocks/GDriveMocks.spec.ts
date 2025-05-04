import {
  MockProxy,
  anyString,
  matches,
  mock,
  mockDeep,
} from "jest-mock-extended"
import { FileContent } from "../../lib/adapter/GDriveAdapter"
import { FileData, FolderData, GDriveData } from "./GDriveData"
import {
  EXISTING_FILE_ID,
  EXISTING_FILE_NAME,
  EXISTING_FOLDER_ID,
  EXISTING_FOLDER_NAME,
  GDriveMocks,
  NEW_FILE_ID,
  NEW_FOLDER_ID,
  NEW_FOLDER_NAME,
  NEW_NESTED_FILE_ID,
  NO_FILE_ID,
  NO_FILE_NAME,
  NO_FOLDER_ID,
  NO_FOLDER_NAME,
  ROOT_FOLDER_ID,
} from "./GDriveMocks"
import { MockFactory, Mocks } from "./MockFactory"

let driveSpec: GDriveData
let mocks: Mocks

beforeAll(() => {
  mocks = MockFactory.newMocks()
  driveSpec = GDriveMocks.getSampleDriveData(mocks)
})

beforeEach(() => {
  jest.clearAllMocks()
})

describe("mock behavior", () => {
  it("should use calledWith without default mock implementation", () => {
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
      driveSpec,
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
      driveSpec,
    )
    expect(file).toBe(originalFile)
    expect(file.setContent("test")).toBe(file)
    expect(file.setDescription("test")).toBe(file)
    expect(file.setName("test")).toBe(file)
    expect(file.moveTo(mock<GoogleAppsScript.Drive.Folder>())).toBe(file)
  })
})

describe("setupFolder()", () => {
  it("should setup a default folder", () => {
    const folder = GDriveMocks.setupFolderMocks(driveSpec)
    expect(folder.getFilesByName(NO_FILE_NAME).hasNext()).toBeFalsy()
    expect(() => {
      folder.getFilesByName(NO_FILE_NAME).next()
    }).toThrow()
    expect(folder.getFoldersByName(NO_FOLDER_NAME).hasNext()).toBeFalsy()
    expect(() => {
      folder.getFoldersByName(NO_FOLDER_NAME).next()
    }).toThrow()
    const newFileContent = new FileContent(mocks.newBlob)
    expect(folder.createFile(newFileContent.blob)).toBeDefined()
    expect(folder.createFolder(NEW_FOLDER_NAME)).toBeDefined()
  })

  it("should setup a folder with drive data", () => {
    const folder = GDriveMocks.setupFolderMocks(
      driveSpec,
      mocks.genericNewFile,
      mocks.genericNewFolder,
      driveSpec,
    )
    expect(folder.getId()).toEqual(ROOT_FOLDER_ID)
    expect(folder).toBe(mocks.rootFolder)

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
    }).toThrow()
    folderIterator = folder.getFoldersByName(NO_FOLDER_NAME)
    expect(folderIterator.hasNext()).toBeFalsy()
    expect(() => {
      folderIterator.next()
    }).toThrow()

    // Test file/folder creation:
    expect(folder.createFile(mocks.newBlob)).toBe(mocks.newFile)
    expect(folder.createFolder(NEW_FOLDER_NAME)).toBe(mocks.newFolder)
  })

  it("should setup generic file behavior", () => {
    const folder = GDriveMocks.setupFolderMocks(driveSpec)
    for (const p of ["generic", "my-generic-file-name"]) {
      const blob = mock<GoogleAppsScript.Base.Blob>()
      blob.getName.mockReturnValue(p)
      const blobSource = mock<GoogleAppsScript.Base.BlobSource>()
      blobSource.getBlob.mockReturnValue(blob)
      expect(folder.createFile(blobSource)).toBeDefined()
    }
    for (const p of ["any-file", "some-other-file"]) {
      const blob = mock<GoogleAppsScript.Base.Blob>()
      blob.getName.mockReturnValue(p)
      const blobSource = mock<GoogleAppsScript.Base.BlobSource>()
      blobSource.getBlob.mockReturnValue(blob)
      expect(() => folder.createFile(blobSource)).toThrow("no mock data")
    }
  })

  it("should setup generic folder behavior", () => {
    const folder = GDriveMocks.setupFolderMocks(driveSpec)
    for (const p of ["generic", "my-generic-folder-name", "Subject 2"]) {
      expect(folder.createFolder(p)).toBeDefined()
    }
    for (const p of ["any-folder", "some-folder"]) {
      expect(() => folder.createFolder(p)).toThrow("no mock data")
    }
  })
})

describe("setupFileIterator()", () => {
  it("should setup a default file iterator", () => {
    const it = GDriveMocks.setupFileIterator()
    expect(it.hasNext()).toBeFalsy() // First invocation
    expect(it.hasNext()).toBeFalsy() // Second invocation
    expect(() => {
      it.next()
    }).toThrow()
    expect(() => {
      it.next()
    }).toThrow()
  })

  it("should setup a default file iterator with an existing file", () => {
    const file = mock<GoogleAppsScript.Drive.File>()
    const it = GDriveMocks.setupFileIterator([
      new FileData(file, "some-id", "some-name"),
    ])
    expect(it.hasNext()).toBeTruthy() // First invocation
    expect(it.hasNext()).toBeFalsy() // Second invocation
    expect(it.next()).toBe(file)
    expect(() => {
      it.next()
    }).toThrow()
  })
})

describe("setupFolderIterator()", () => {
  it("should setup a default folder iterator", () => {
    const it = GDriveMocks.setupFolderIterator()
    expect(it.hasNext()).toBeFalsy() // First invocation
    expect(it.hasNext()).toBeFalsy() // Second invocation
    expect(() => {
      it.next()
    }).toThrow()
    expect(() => {
      it.next()
    }).toThrow()
  })

  it("should setup a default folder iterator with an existing folder", () => {
    const folder = mock<GoogleAppsScript.Drive.Folder>()
    const it = GDriveMocks.setupFolderIterator([
      new FolderData(folder, "some-id", "some-name"),
    ])
    expect(it.hasNext()).toBeTruthy() // First invocation
    expect(it.hasNext()).toBeFalsy() // Second invocation
    expect(it.next()).toBe(folder)
    expect(() => {
      it.next()
    }).toThrow()
  })
})

describe("setupGDriveAppMocks", () => {
  let app: MockProxy<GoogleAppsScript.Drive.DriveApp>
  beforeEach(() => {
    app = GDriveMocks.setupGDriveAppMocks(
      driveSpec,
      mocks.gdriveApp,
      mocks.genericNewFile,
      mocks.genericNewFolder,
    )
  })

  it("should setup a default drive app", () => {
    expect(app.getRootFolder()).toBeDefined()
    expect(app.getRootFolder().getId()).toEqual(ROOT_FOLDER_ID)
  })

  it("should setup a given gdrive app", () => {
    const initialApp = mockDeep<GoogleAppsScript.Drive.DriveApp>({
      fallbackMockImplementation: () => {
        throw new Error("No mock implementation available!")
      },
    })
    const app = GDriveMocks.setupGDriveAppMocks(
      driveSpec,
      initialApp,
      mocks.genericNewFile,
      mocks.genericNewFolder,
    )
    expect(app).toBe(initialApp)
  })

  it("should setup a drive app with existing files", () => {
    // Test get file by ID:
    expect(app.getFileById(EXISTING_FILE_ID)).toBe(mocks.existingFile)
    expect(() => {
      app.getFileById(NO_FILE_ID)
    }).toThrow()

    // Test file iterators:
    const rootFolder = app.getRootFolder()
    expect(rootFolder).toBeDefined()
    const fileIterator = rootFolder.getFilesByName(EXISTING_FILE_NAME)
    expect(fileIterator.hasNext()).toBeTruthy()
    expect(fileIterator.next()).toBe(mocks.existingFile)
    expect(fileIterator.hasNext()).toBeFalsy()
    expect(() => {
      fileIterator.next()
    }).toThrow()
  })

  it("should setup a drive app with existing folders", () => {
    // Test get folder by ID:
    expect(app.getFolderById(EXISTING_FOLDER_ID)).toBe(mocks.existingFolder)

    // Test folder iterators:
    const rootFolder = app.getRootFolder()
    expect(rootFolder).toBeDefined()
    const folderIterator = rootFolder.getFoldersByName(EXISTING_FOLDER_NAME)
    expect(folderIterator.hasNext()).toBeTruthy()
    expect(folderIterator.next()).toBe(mocks.existingFolder)
    expect(folderIterator.hasNext()).toBeFalsy()
    expect(() => {
      folderIterator.next()
    }).toThrow()
  })

  it("should setup a drive app for root file creation", () => {
    const rootFolder = app.getRootFolder()
    const newRootFile = rootFolder.createFile(mocks.newBlob)
    expect(newRootFile.getId()).toEqual(NEW_FILE_ID)
    expect(newRootFile).toBe(mocks.newFile)
  })

  it("should setup a drive app for root folder creation", () => {
    const rootFolder = app.getRootFolder()
    const newFolder = rootFolder.createFolder(NEW_FOLDER_NAME)
    expect(newFolder.getId()).toEqual(NEW_FOLDER_ID)
    expect(newFolder).toBe(mocks.newFolder)
  })

  it("should setup a drive app for nested file creation", () => {
    const rootFolder = app.getRootFolder()
    const newFolder = rootFolder.createFolder(NEW_FOLDER_NAME)
    const newNestedFile = newFolder.createFile(mocks.newNestedBlob)
    expect(newNestedFile.getId()).toEqual(NEW_NESTED_FILE_ID)
    expect(newNestedFile).toBe(mocks.newNestedFile)
  })

  test.todo("should setup a drive app for nested folder creation")

  it("should throw an error for non-existing file ids", () => {
    expect(() => {
      app.getFileById(NO_FILE_ID)
    }).toThrow()
  })

  it("should throw an error for non-existing folder ids", () => {
    expect(() => {
      app.getFolderById(NO_FOLDER_ID)
    }).toThrow()
  })
})
