import { MockProxy } from "jest-mock-extended"
import {
  EXISTING_FILE_ID,
  EXISTING_FILE_NAME,
  NEW_EXISTING_FILE_ID,
  NEW_EXISTING_FILE_NAME,
  NEW_FILE_ID,
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

beforeEach(() => {
  mocks = MockFactory.newMocks()
  gdriveAdapter = new GDriveAdapter(
    mocks.envContext,
    mocks.processingContext.proc.config.settings,
  )
})

/*describe("getFolderFromPath()", () => {
  it("should find folder from path", () => {
    const actual = gdriveAdapter.getFolderFromPath("some-folder")
    expect(actual).toMatchObject({})
  })
  it("should find folder from root path", () => {
    mocks.fileIterator.hasNext.mockReset()
    const actual = gdriveAdapter.getFolderFromPath("/some-folder")
    expect(actual).toMatchObject({})
  })
  test.todo("should throw error if folder is not found")
  // it("should throw error if folder is not found", () => {
  //   expect(() => {
  //     gdriveAdapter.getFolderFromPath("/some-non-existing-folder")
  //   }).toThrowError(/not found/)
  // })
})
*/

describe("createFile() strategy:ERROR", () => {
  it("should create a non-existing file in the root folder", () => {
    gdriveAdapter.ctx.env.runMode = RunMode.DANGEROUS
    const file = gdriveAdapter.createFile(
      NEW_FILE_PATH,
      new FileContent(mocks.newBlob),
      ConflictStrategy.ERROR,
    )
    expect(file?.getId()).toEqual(NEW_FILE_ID)
    expect(mocks.rootFolder.createFile).toBeCalled()
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
    expect(mocks.rootFolder.createFile).toBeCalled()
  })
  it("should not replace an existing file if in replace mode but running in dry-run mode", () => {
    gdriveAdapter.ctx.env.runMode = RunMode.DRY_RUN
    gdriveAdapter.createFile(
      `/${EXISTING_FILE_NAME}`,
      new FileContent(mocks.existingBlob),
      ConflictStrategy.REPLACE,
    )
    expect(mocks.rootFolder.createFile).not.toBeCalled()
  })
  it("should not replace an existing file if in replace mode but running in safe mode", () => {
    gdriveAdapter.ctx.env.runMode = RunMode.SAFE_MODE
    gdriveAdapter.createFile(
      `/${EXISTING_FILE_NAME}`,
      new FileContent(mocks.existingBlob),
      ConflictStrategy.REPLACE,
    )
    expect(mocks.rootFolder.createFile).not.toBeCalled()
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
    expect(mocks.rootFolder.createFile).not.toBeCalled()
    expect(mocks.existingFile.setContent).not.toBeCalled()
    expect(mocks.existingFile.setDescription).not.toBeCalled()
  })
  it("should not update an existing file if in replace mode but running in safe mode", () => {
    gdriveAdapter.ctx.env.runMode = RunMode.SAFE_MODE
    gdriveAdapter.createFile(
      `/${EXISTING_FILE_NAME}`,
      new FileContent(mocks.existingBlob),
      ConflictStrategy.UPDATE,
    )
    expect(mocks.rootFolder.createFile).not.toBeCalled()
    expect(mocks.existingFile.setContent).not.toBeCalled()
    expect(mocks.existingFile.setDescription).not.toBeCalled()
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
    expect(mocks.rootFolder.createFile).toBeCalled()
    expect(mocks.existingFile.setName).toBeCalled()
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
    expect(mocks.rootFolder.createFile).toBeCalled()
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
    expect(mocks.rootFolder.createFile).not.toBeCalled()
  })
})
describe("createFile() strategy:ERROR", () => {
  it("should throw an error if file exists and error mode", () => {
    gdriveAdapter.ctx.env.runMode = RunMode.DANGEROUS
    expect(() => {
      gdriveAdapter.createFile(
        `/${EXISTING_FILE_NAME}`,
        new FileContent(mocks.existingBlob),
        ConflictStrategy.ERROR,
      )
    }).toThrowError(/Conflict/)
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
    expect(mocks.rootFolder.createFolder).toBeCalled()
    expect(mocks.newFolder.createFile).toBeCalled()
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
          .Files as MockProxy<GoogleAppsScript.Drive.Collection.FilesCollection>
      ).copy,
    ).not.toHaveBeenCalled()
    expect(
      (
        mocks.driveApi
          .Files as MockProxy<GoogleAppsScript.Drive.Collection.FilesCollection>
      ).insert,
    ).toBeCalled()
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
test.todo("should transparently create a folder or return an existing one")
test.todo(
  "should get a collection of files within a folder matching the given name",
)
