import {
  CREATED_FILE_ID,
  CREATED_FILE_NAME,
  EXISTING_FILE_NAME,
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

describe("createFile()", () => {
  it("should create a non-existing file in the root folder", () => {
    const file = gdriveAdapter.createFile(
      `/${CREATED_FILE_NAME}`,
      PLAIN_TEXT_CONTENT,
      ConflictStrategy.ERROR,
    )
    expect(file.getId()).toEqual(CREATED_FILE_ID)
    expect(mocks.rootFolder.createFile).toBeCalled()
  })
  it("should create a file if existing and replace mode", () => {
    const it = mocks.rootFolder.getFilesByName(EXISTING_FILE_NAME)
    expect(it.hasNext).not.toBeCalled()
    expect(it.hasNext()).toBeTruthy()
    expect(it.hasNext).toBeCalledTimes(1)
    jest.clearAllMocks()
    expect(it.hasNext).not.toBeCalled()
    const file = gdriveAdapter.createFile(
      `/${EXISTING_FILE_NAME}`,
      PLAIN_TEXT_CONTENT,
      ConflictStrategy.REPLACE,
    )
    expect(file).toBeDefined()
    expect(mocks.rootFolder.createFile).toBeCalled()
  })
  it("should not create a file if file exists and replace mode but running in dry-run mode", () => {
    gdriveAdapter.ctx.env.runMode = RunMode.DRY_RUN
    gdriveAdapter.createFile(
      `/${EXISTING_FILE_NAME}`,
      PLAIN_TEXT_CONTENT,
      ConflictStrategy.REPLACE,
    )
    expect(mocks.rootFolder.createFile).not.toBeCalled()
  })
  it("should throw an error if file exists and replace mode but running in safe mode", () => {
    gdriveAdapter.ctx.env.runMode = RunMode.SAFE_MODE
    gdriveAdapter.createFile(
      `/${EXISTING_FILE_NAME}`,
      PLAIN_TEXT_CONTENT,
      ConflictStrategy.REPLACE,
    )
    expect(mocks.rootFolder.createFile).not.toBeCalled()
  })
  it("should not create a file if existing and skip mode", () => {
    gdriveAdapter.createFile(
      `/${EXISTING_FILE_NAME}`,
      PLAIN_TEXT_CONTENT,
      ConflictStrategy.SKIP,
    )
    expect(mocks.rootFolder.createFile).not.toBeCalled()
  })
  it("should throw an error if file exists and error mode", () => {
    expect(() => {
      gdriveAdapter.createFile(
        `/${EXISTING_FILE_NAME}`,
        PLAIN_TEXT_CONTENT,
        ConflictStrategy.ERROR,
      )
    }).toThrowError(/Conflict/)
  })
})

test.todo("should transparently create a folder or return an existing one")
test.todo(
  "should get a collection of files within a folder matching the given name",
)
