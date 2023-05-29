import { MockFactory, Mocks } from "../../test/mocks/MockFactory"
import { RunMode } from "../Context"
import { newConfig } from "../config/Config"
import { GDriveAdapter } from "./GDriveAdapter"

let mocks: Mocks
let gdriveAdapter: GDriveAdapter

beforeEach(() => {
  mocks = MockFactory.newMocks(newConfig(), RunMode.DANGEROUS)
  gdriveAdapter = new GDriveAdapter(mocks.envContext)
})

it("should find folder from path", () => {
  const actual = gdriveAdapter.getFolderFromPath("some-path")
  expect(actual).toMatchObject({})
})
test.todo("should be able to create files")
test.todo("should transparently create a folder or return an existing one")
test.todo(
  "should get a collection of files within a folder matching the given name",
)
