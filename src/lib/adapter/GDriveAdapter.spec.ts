import {
  CREATED_FILE_ID,
  CREATED_FILE_NAME,
  CREATED_FOLDER_NAME,
  CREATED_NESTED_FILE_NAME,
  EXISTING_FILE_NAME,
  ROOT_FOLDER_ID,
} from "../../test/mocks/GDriveMocks"
import { MockFactory, Mocks } from "../../test/mocks/MockFactory"
import { RunMode } from "../Context"
import { newConfig } from "../config/Config"
import { ConflictStrategy, FileData, GDriveAdapter } from "./GDriveAdapter"

let mocks: Mocks
let gdriveAdapter: GDriveAdapter
const PLAIN_TEXT_CONTENT: FileData = {
  content: "some content",
  mimeType: "text/plain",
  description: "some description",
}

beforeEach(() => {
  mocks = MockFactory.newMocks(newConfig(), RunMode.DANGEROUS)
  gdriveAdapter = new GDriveAdapter(mocks.envContext)
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
      `/${CREATED_FILE_NAME}`,
      PLAIN_TEXT_CONTENT,
      ConflictStrategy.ERROR,
    )
    expect(file.getId()).toEqual(CREATED_FILE_ID)
    expect(mocks.rootFolder.createFile).toBeCalled()
  })
})
describe("createFile() strategy:REPLACE", () => {
  it("should replace an existing file in replace mode", () => {
    gdriveAdapter.ctx.env.runMode = RunMode.DANGEROUS
    const file = gdriveAdapter.createFile(
      `/${EXISTING_FILE_NAME}`,
      PLAIN_TEXT_CONTENT,
      ConflictStrategy.REPLACE,
    )
    expect(file).toBeDefined()
    expect(mocks.rootFolder.createFile).toBeCalled()
  })
  it("should not replace an existing file if in replace mode but running in dry-run mode", () => {
    gdriveAdapter.ctx.env.runMode = RunMode.DRY_RUN
    gdriveAdapter.createFile(
      `/${EXISTING_FILE_NAME}`,
      PLAIN_TEXT_CONTENT,
      ConflictStrategy.REPLACE,
    )
    expect(mocks.rootFolder.createFile).not.toBeCalled()
  })
  it("should not replace an existing file if in replace mode but running in safe mode", () => {
    gdriveAdapter.ctx.env.runMode = RunMode.SAFE_MODE
    gdriveAdapter.createFile(
      `/${EXISTING_FILE_NAME}`,
      PLAIN_TEXT_CONTENT,
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
      PLAIN_TEXT_CONTENT,
      ConflictStrategy.UPDATE,
    )
    expect(file).toBe(mocks.existingFile)
    expect(mocks.rootFolder.createFile).not.toBeCalled()
    expect(mocks.existingFile.setContent).toBeCalled()
    expect(mocks.existingFile.setDescription).toBeCalled()
  })
  it("should not update an existing file if in replace mode but running in dry-run mode", () => {
    gdriveAdapter.ctx.env.runMode = RunMode.DRY_RUN
    gdriveAdapter.createFile(
      `/${EXISTING_FILE_NAME}`,
      PLAIN_TEXT_CONTENT,
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
      PLAIN_TEXT_CONTENT,
      ConflictStrategy.UPDATE,
    )
    expect(mocks.rootFolder.createFile).not.toBeCalled()
    expect(mocks.existingFile.setContent).not.toBeCalled()
    expect(mocks.existingFile.setDescription).not.toBeCalled()
  })
})
describe("createFile() strategy:BACKUP", () => {
  it("should backup an existing file", () => {
    gdriveAdapter.ctx.env.runMode = RunMode.DANGEROUS
    const createdFile = gdriveAdapter.createFile(
      `/${EXISTING_FILE_NAME}`,
      PLAIN_TEXT_CONTENT,
      ConflictStrategy.BACKUP,
    )
    expect(createdFile).not.toBe(mocks.existingFile)
    expect(mocks.rootFolder.createFile).toBeCalled()
    expect(mocks.existingFile.setName).toBeCalled()
  })
})
describe("createFile() strategy:KEEP", () => {
  it("should create a duplicate new file", () => {
    gdriveAdapter.ctx.env.runMode = RunMode.SAFE_MODE
    const createdFile = gdriveAdapter.createFile(
      `/${EXISTING_FILE_NAME}`,
      PLAIN_TEXT_CONTENT,
      ConflictStrategy.KEEP,
    )
    expect(createdFile).not.toBe(mocks.existingFile)
    expect(mocks.rootFolder.createFile).toBeCalled()
  })
})
describe("createFile() strategy:SKIP", () => {
  it("should not create a file if existing and skip mode", () => {
    gdriveAdapter.ctx.env.runMode = RunMode.DANGEROUS
    gdriveAdapter.createFile(
      `/${EXISTING_FILE_NAME}`,
      PLAIN_TEXT_CONTENT,
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
        PLAIN_TEXT_CONTENT,
        ConflictStrategy.ERROR,
      )
    }).toThrowError(/Conflict/)
  })
})
describe("createFile() with folderId", () => {
  it("should create a file using a folderId", () => {
    gdriveAdapter.ctx.env.runMode = RunMode.DANGEROUS
    gdriveAdapter.createFile(
      `{id:${ROOT_FOLDER_ID}}/${CREATED_FOLDER_NAME}/${CREATED_NESTED_FILE_NAME}`,
      PLAIN_TEXT_CONTENT,
      ConflictStrategy.KEEP,
    )
    expect(mocks.rootFolder.createFolder).toBeCalled()
    expect(mocks.newFolder.createFile).toBeCalled()
  })
})

test.todo("should transparently create a folder or return an existing one")
test.todo(
  "should get a collection of files within a folder matching the given name",
)
