import { MockFactory, Mocks } from "../../test/mocks/MockFactory"
import { RunMode } from "../Context"
import { newConfig } from "../config/Config"
import { ConflictStrategy, GDriveAdapter } from "./GDriveAdapter"

let mocks: Mocks
let gdriveAdapter: GDriveAdapter

beforeEach(() => {
  mocks = MockFactory.newMocks(newConfig(), RunMode.DANGEROUS)
  gdriveAdapter = new GDriveAdapter(mocks.envContext)
})

describe("getFolderFromPath()", () => {
  it("should find folder from path", () => {
    const actual = gdriveAdapter.getFolderFromPath("some-folder")
    expect(actual).toMatchObject({})
  })
  it("should find folder from root path", () => {
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

describe("createFile()", () => {
  it("should create a file if not yet existing", () => {
    const file = gdriveAdapter.createFile(
      "/some-file.txt",
      "some content",
      "text/plain",
      "some description",
      ConflictStrategy.KEEP,
    )
    expect(file).toBeDefined()
    expect(mocks.rootFolder.createFile).toBeCalled()
  })
  it("should not create a file if existing and replace mode", () => {
    const file = gdriveAdapter.createFile(
      "/some-file.txt",
      "some content",
      "text/plain",
      "some description",
      ConflictStrategy.REPLACE,
    )
    expect(file).toBeDefined()
    expect(mocks.rootFolder.createFile).toBeCalled()
  })
  it("should not create a file if existing and skip mode", () => {
    gdriveAdapter.createFile(
      "/some-file.txt",
      "some content",
      "text/plain",
      "some description",
      ConflictStrategy.SKIP,
    )
    expect(mocks.rootFolder.createFile).not.toBeCalled()
  })
})

test.todo("should transparently create a folder or return an existing one")
test.todo(
  "should get a collection of files within a folder matching the given name",
)
