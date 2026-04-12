import { MockProxy } from "jest-mock-extended"
import {
  EXISTING_FILE_ID,
  EXISTING_FILE_NAME,
  GDriveMocks,
  NEW_EXISTING_FILE_ID,
  NEW_EXISTING_FILE_NAME,
  NEW_FILE_ID,
  NEW_FILE_NAME,
  NEW_FILE_PATH,
  NEW_FOLDER_NAME,
  NEW_NESTED_FILE_ID,
  NEW_NESTED_FILE_NAME,
  ROOT_FOLDER_ID,
} from "../../test/mocks/GDriveMocks"
import { MockFactory, Mocks } from "../../test/mocks/MockFactory"
import { RunMode } from "../Context"
import {
  ConflictStrategy,
  DriveUtils,
  FileContent,
  GDriveAdapter,
  LocationInfo,
} from "./GDriveAdapter"

let mocks: Mocks
let gdriveAdapter: GDriveAdapter

beforeAll(() => {
  mocks = MockFactory.newMocks()
})

beforeEach(() => {
  jest.clearAllMocks()
  GDriveMocks.setupAllMocks(mocks)
  gdriveAdapter = new GDriveAdapter(
    mocks.envContext,
    mocks.processingContext.proc.config.settings,
  )
})

describe("createFile() strategy:ERROR", () => {
  it("should create a non-existing file in the root folder", () => {
    gdriveAdapter.ctx.env.runMode = RunMode.DANGEROUS
    const file = gdriveAdapter.createFile(
      NEW_FILE_PATH,
      new FileContent(mocks.newBlob),
      ConflictStrategy.ERROR,
    )
    expect(file?.getId()).toEqual(NEW_FILE_ID)
    expect(mocks.rootFolder.createFile).toHaveBeenCalled()
  })
})
describe("createFile() strategy:REPLACE", () => {
  it("should replace an existing file in replace mode", () => {
    gdriveAdapter.ctx.env.runMode = RunMode.DANGEROUS
    const file = gdriveAdapter.createFile(
      `/${EXISTING_FILE_NAME}`,
      new FileContent(mocks.existingBlob),
      ConflictStrategy.REPLACE,
    )
    expect(file).toBeDefined()
    expect(mocks.rootFolder.createFile).toHaveBeenCalled()
  })
  it("should not replace an existing file if in replace mode but running in dry-run mode", () => {
    gdriveAdapter.ctx.env.runMode = RunMode.DRY_RUN
    gdriveAdapter.createFile(
      `/${EXISTING_FILE_NAME}`,
      new FileContent(mocks.existingBlob),
      ConflictStrategy.REPLACE,
    )
    expect(mocks.rootFolder.createFile).not.toHaveBeenCalled()
  })
  it("should not replace an existing file if in replace mode but running in safe mode", () => {
    gdriveAdapter.ctx.env.runMode = RunMode.SAFE_MODE
    gdriveAdapter.createFile(
      `/${EXISTING_FILE_NAME}`,
      new FileContent(mocks.existingBlob),
      ConflictStrategy.REPLACE,
    )
    expect(mocks.rootFolder.createFile).not.toHaveBeenCalled()
  })
})
describe("createFile() strategy:UPDATE", () => {
  it("should update an existing file in replace mode", () => {
    gdriveAdapter.ctx.env.runMode = RunMode.DANGEROUS
    const file = gdriveAdapter.createFile(
      `/${EXISTING_FILE_NAME}`,
      new FileContent(mocks.existingBlob),
      ConflictStrategy.UPDATE,
    )
    expect(file).toBe(mocks.existingFile)
    expect(mocks.rootFolder.createFile).not.toHaveBeenCalled()
    expect(mocks.driveApi.Files!.update).toHaveBeenCalled()
  })
  it("should update an existing file in replace mode with toMimeType", () => {
    gdriveAdapter.ctx.env.runMode = RunMode.DANGEROUS
    const file = gdriveAdapter.createFile(
      `/${EXISTING_FILE_NAME}`,
      new FileContent(
        mocks.existingBlob,
        "some-name",
        "some-description",
        "text/plain",
      ),
      ConflictStrategy.UPDATE,
    )
    expect(file).toBe(mocks.existingFile)
    expect(mocks.rootFolder.createFile).not.toHaveBeenCalled()
    expect(mocks.driveApi.Files!.update).toHaveBeenCalled()
  })
  it("should not update an existing file if in replace mode but running in dry-run mode", () => {
    gdriveAdapter.ctx.env.runMode = RunMode.DRY_RUN
    gdriveAdapter.createFile(
      `/${EXISTING_FILE_NAME}`,
      new FileContent(mocks.existingBlob),
      ConflictStrategy.UPDATE,
    )
    expect(mocks.rootFolder.createFile).not.toHaveBeenCalled()
    expect(mocks.existingFile.setContent).not.toHaveBeenCalled()
    expect(mocks.existingFile.setDescription).not.toHaveBeenCalled()
  })
  it("should not update an existing file if in replace mode but running in safe mode", () => {
    gdriveAdapter.ctx.env.runMode = RunMode.SAFE_MODE
    gdriveAdapter.createFile(
      `/${EXISTING_FILE_NAME}`,
      new FileContent(mocks.existingBlob),
      ConflictStrategy.UPDATE,
    )
    expect(mocks.rootFolder.createFile).not.toHaveBeenCalled()
    expect(mocks.existingFile.setContent).not.toHaveBeenCalled()
    expect(mocks.existingFile.setDescription).not.toHaveBeenCalled()
  })
})
describe("createFile() strategy:BACKUP, safe-mode", () => {
  it("should backup an existing file in safe mode", () => {
    gdriveAdapter.ctx.env.runMode = RunMode.SAFE_MODE

    const createdFile = gdriveAdapter.createFile(
      `/${NEW_EXISTING_FILE_NAME}`,
      new FileContent(mocks.newExistingBlob),
      ConflictStrategy.BACKUP,
    )
    expect(createdFile?.getId()).not.toEqual(EXISTING_FILE_ID)
    expect(createdFile?.getId()).toEqual(NEW_EXISTING_FILE_ID)
    expect(mocks.rootFolder.createFile).toHaveBeenCalled()
    expect(mocks.existingFile.setName).toHaveBeenCalled()
  })
})
describe("createFile() strategy:KEEP", () => {
  it("should create a duplicate new file", () => {
    gdriveAdapter.ctx.env.runMode = RunMode.SAFE_MODE
    const createdFile = gdriveAdapter.createFile(
      `/${NEW_EXISTING_FILE_NAME}`,
      new FileContent(mocks.newExistingBlob),
      ConflictStrategy.KEEP,
    )
    expect(createdFile?.getId()).not.toEqual(EXISTING_FILE_ID)
    expect(mocks.rootFolder.createFile).toHaveBeenCalled()
  })
})
describe("createFile() strategy:SKIP", () => {
  it("should not create a file if existing and skip mode", () => {
    gdriveAdapter.ctx.env.runMode = RunMode.DANGEROUS
    gdriveAdapter.createFile(
      `/${EXISTING_FILE_NAME}`,
      new FileContent(mocks.existingBlob),
      ConflictStrategy.SKIP,
    )
    expect(mocks.rootFolder.createFile).not.toHaveBeenCalled()
  })
})
describe("createFile() strategy:INCREMENT", () => {
  it("should create an incremented file if a file already exists", () => {
    gdriveAdapter.ctx.env.runMode = RunMode.DANGEROUS
    gdriveAdapter.createFile(
      `/${EXISTING_FILE_NAME}`,
      new FileContent(mocks.existingBlob),
      ConflictStrategy.INCREMENT,
    )
    expect(mocks.rootFolder.createFile).toHaveBeenCalled()
  })
  it("should not create an incremented file if in dry-run mode", () => {
    gdriveAdapter.ctx.env.runMode = RunMode.DRY_RUN
    gdriveAdapter.createFile(
      `/${EXISTING_FILE_NAME}`,
      new FileContent(mocks.existingBlob),
      ConflictStrategy.INCREMENT,
    )
    expect(mocks.rootFolder.createFile).not.toHaveBeenCalled()
  })

  it("should create an incremented file with no extension", () => {
    gdriveAdapter.ctx.env.runMode = RunMode.DANGEROUS
    const fileNameNoExt = "existing-file-no-ext"
    mocks.rootFolder.getFilesByName.mockReturnValue({
      hasNext: () => true,
      next: () => mocks.existingFile,
    } as any)
    // First iteration find conflict, second iteration check incremented name
    // Mock getFilesByName to return true for original name and false for incremented name
    mocks.rootFolder.getFilesByName
      .mockReturnValueOnce({
        hasNext: () => true,
        next: () => mocks.existingFile,
      } as any)
      .mockReturnValueOnce({ hasNext: () => false } as any)

    gdriveAdapter.createFile(
      `/${fileNameNoExt}`,
      new FileContent(mocks.existingBlob),
      ConflictStrategy.INCREMENT,
    )
    expect(mocks.rootFolder.createFile).toHaveBeenCalled()
    const file = (mocks.rootFolder.createFile as jest.Mock).mock.results[0]
      .value
    expect(file.setName).toHaveBeenCalledWith(`${fileNameNoExt} (1)`)
  })

  it("should handle multiple increments when multiple files exist", () => {
    gdriveAdapter.ctx.env.runMode = RunMode.DANGEROUS
    mocks.rootFolder.getFilesByName
      .mockReturnValueOnce({
        hasNext: () => true,
        next: () => mocks.existingFile,
      } as any) // original
      .mockReturnValueOnce({
        hasNext: () => true,
        next: () => mocks.existingFile,
      } as any) // (1)
      .mockReturnValueOnce({ hasNext: () => false } as any) // (2)

    gdriveAdapter.createFile(
      `/${EXISTING_FILE_NAME}`,
      new FileContent(mocks.existingBlob),
      ConflictStrategy.INCREMENT,
    )
    expect(mocks.rootFolder.createFile).toHaveBeenCalled()
    const file = (mocks.rootFolder.createFile as jest.Mock).mock.results[0]
      .value
    expect(file.setName).toHaveBeenCalledWith(expect.stringContaining("(2)"))
  })
})

describe("getParentFolder edge cases", () => {
  it("should use existing folder if it already exists", () => {
    // getFoldersByName returning hasNext: true triggers the parentFolder = folders.next() branch
    mocks.rootFolder.getFoldersByName.mockReturnValue({
      hasNext: () => true,
      next: () => mocks.newFolder,
    } as any)

    DriveUtils.ensureFolderExists(
      mocks.envContext,
      "/existing-segment/file.txt",
    )
    expect(mocks.rootFolder.createFolder).not.toHaveBeenCalled()
  })
})

describe("extractLocationInfo error cases", () => {
  it("should throw error for invalid location format", () => {
    // This is hard to trigger with the current regex, but we can try to find a string that fails
    // The regex is /^({id:(?<folderId>[^}]+)}\/)?(?<folderPath>[^\n]*\/)?(?<filename>[^/\n]+)$/
    // A string with only slashes might fail? No.
    // Let's try an empty string or something that doesn't match the last part.
    expect(() => DriveUtils.extractLocationInfo("\n")).toThrow(
      "Invalid location format",
    )
  })
})

describe("createFile() error case", () => {
  it("should throw an error if file exists and error mode", () => {
    gdriveAdapter.ctx.env.runMode = RunMode.DANGEROUS
    expect(() => {
      gdriveAdapter.createFile(
        `/${EXISTING_FILE_NAME}`,
        new FileContent(mocks.existingBlob),
        ConflictStrategy.ERROR,
      )
    }).toThrow(/Conflict/)
  })
})

describe("createFile() with folderId", () => {
  it("should create a file using a folderId", () => {
    gdriveAdapter.ctx.env.runMode = RunMode.DANGEROUS
    const file = gdriveAdapter.createFile(
      `{id:${ROOT_FOLDER_ID}}/${NEW_FOLDER_NAME}/${NEW_NESTED_FILE_NAME}`,
      new FileContent(mocks.newNestedBlob),
      ConflictStrategy.KEEP,
    )
    expect(mocks.envContext.env.gdriveApp.getFolderById).toHaveBeenCalledWith(
      ROOT_FOLDER_ID,
    )
    expect(file).toBe(mocks.newNestedFile)
    expect(file?.getId()).toEqual(NEW_NESTED_FILE_ID)
  })
})
describe("createFile() convert", () => {
  it("should create a file and convert to Google format", () => {
    gdriveAdapter.ctx.env.runMode = RunMode.SAFE_MODE
    const createdFile = gdriveAdapter.createFile(
      `/${NEW_EXISTING_FILE_NAME}`,
      new FileContent(
        mocks.newExistingBlob,
        NEW_EXISTING_FILE_NAME,
        "",
        "application/vnd.google-apps.spreadsheet",
      ),
      ConflictStrategy.KEEP,
    )
    expect(createdFile).not.toBe(mocks.existingFile)
    expect(mocks.rootFolder.createFile).not.toHaveBeenCalled()
    expect(
      (
        mocks.driveApi
          .Files as MockProxy<GoogleAppsScript.Drive_v3.Drive.V3.Collection.FilesCollection>
      ).copy,
    ).not.toHaveBeenCalled()
    expect(
      (
        mocks.driveApi
          .Files as MockProxy<GoogleAppsScript.Drive_v3.Drive.V3.Collection.FilesCollection>
      ).create,
    ).toHaveBeenCalled()
  })
})
describe("DriveUtils.extractLocationInfo()", () => {
  it("should parse locations with folder IDs", () => {
    const location = `{id:${ROOT_FOLDER_ID}}/${NEW_FOLDER_NAME}/${NEW_NESTED_FILE_NAME}`
    const actual = DriveUtils.extractLocationInfo(location)
    const expected: LocationInfo = {
      folderId: ROOT_FOLDER_ID,
      folderPath: `${NEW_FOLDER_NAME}`,
      filename: NEW_NESTED_FILE_NAME,
      fullPath: `${NEW_FOLDER_NAME}/${NEW_NESTED_FILE_NAME}`,
      location: location,
      pathSegments: [NEW_FOLDER_NAME],
    }
    expect(actual).toMatchObject(expected)
  })
  it("should parse locations with leading slashes", () => {
    const location = `/${NEW_FOLDER_NAME}/${NEW_NESTED_FILE_NAME}`
    const actual = DriveUtils.extractLocationInfo(location)
    const expected: LocationInfo = {
      folderPath: `${NEW_FOLDER_NAME}`,
      filename: NEW_NESTED_FILE_NAME,
      fullPath: `${NEW_FOLDER_NAME}/${NEW_NESTED_FILE_NAME}`,
      location: location,
      pathSegments: [NEW_FOLDER_NAME],
    }
    expect(actual).toMatchObject(expected)
    expect(actual.folderId).toBeUndefined()
  })
  it("should parse locations without leading slashes", () => {
    const location = `/${NEW_FOLDER_NAME}/${NEW_NESTED_FILE_NAME}`
    const actual = DriveUtils.extractLocationInfo(location)
    const expected: LocationInfo = {
      folderPath: `${NEW_FOLDER_NAME}`,
      filename: NEW_NESTED_FILE_NAME,
      fullPath: `${NEW_FOLDER_NAME}/${NEW_NESTED_FILE_NAME}`,
      location: location,
      pathSegments: [NEW_FOLDER_NAME],
    }
    expect(actual).toMatchObject(expected)
    expect(actual.folderId).toBeUndefined()
  })
})

describe("createFile() with toMimeType conversion", () => {
  it("should call driveApi.Files.create when a toMimeType is provided", () => {
    gdriveAdapter.ctx.env.runMode = RunMode.DANGEROUS
    const fileContent = new FileContent(
      mocks.newBlob,
      NEW_FILE_NAME,
      "desc",
      "application/vnd.google-apps.document",
    )
    const file = gdriveAdapter.createFile(
      NEW_FILE_PATH,
      fileContent,
      ConflictStrategy.KEEP,
    )
    expect(file).toBeDefined()
    expect(
      (
        mocks.driveApi
          .Files as MockProxy<GoogleAppsScript.Drive_v3.Drive.V3.Collection.FilesCollection>
      ).create,
    ).toHaveBeenCalled()
  })

  it("should throw an error when driveApi.Files.create returns no ID", () => {
    gdriveAdapter.ctx.env.runMode = RunMode.DANGEROUS
    ;(
      mocks.driveApi
        .Files as MockProxy<GoogleAppsScript.Drive_v3.Drive.V3.Collection.FilesCollection>
    ).create.mockReturnValueOnce({})
    const fileContent = new FileContent(
      mocks.newBlob,
      NEW_FILE_NAME,
      "desc",
      "application/vnd.google-apps.document",
    )
    expect(() =>
      gdriveAdapter.createFile(
        NEW_FILE_PATH,
        fileContent,
        ConflictStrategy.KEEP,
      ),
    ).toThrow("Failed creating file 'created-file.txt'")
  })
})

describe("extractAttachmentText()", () => {
  it("should extract text from a PDF and clean up temp file", () => {
    const attachment = mocks.attachment
    const blob = mocks.newBlob
    attachment.getName.mockReturnValue("generic.pdf")
    attachment.copyBlob.mockReturnValue(blob)

    const result = gdriveAdapter.extractAttachmentText(attachment, {
      language: "en",
    })

    expect(result.text).toBeDefined()
    expect(mocks.driveApi.Files.create).toHaveBeenCalledWith(
      expect.objectContaining({ name: "generic" }),
      blob,
      expect.objectContaining({ ocr: true }),
    )
    // The temp file should be set to trashed
    expect(mocks.newFile.setTrashed).toHaveBeenCalledWith(true)
  })

  it("should extract text from a PDF and keep the Google Doc if docsFileLocation is provided", () => {
    const attachment = mocks.attachment
    const blob = mocks.newBlob
    attachment.getName.mockReturnValue("generic.pdf")
    attachment.copyBlob.mockReturnValue(blob)

    const result = gdriveAdapter.extractAttachmentText(attachment, {
      language: "en",
      docsFileLocation: "generic-doc",
    })

    expect(result.text).toBeDefined()
    expect(mocks.driveApi.Files.create).toHaveBeenCalledWith(
      expect.objectContaining({ name: "generic-doc" }),
      blob,
      expect.objectContaining({ ocr: true }),
    )
    // The doc file should NOT be trashed
    expect(mocks.newFile.setTrashed).not.toHaveBeenCalled()
  })
})
