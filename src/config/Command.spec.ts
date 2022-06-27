import { plainToInstance } from "class-transformer"
import { Command } from "./Command"
import { MockFactory } from "../../test/mocks/MockFactory"

it("should map values from JSON", () => {
  const command = plainToInstance(Command, MockFactory.newDefaultCommandJson())
  const expectedCommand = new Command()
  expectedCommand.name = "file.storeToGDrive"
  expectedCommand.args = {
    folderType: "path",
    folder: "Folder2/Subfolder2/${message.subject.match.1}",
    filename: "${message.subject} - ${match.file.1}.jpg",
    onExists: "replace",
  }
  expect(command).toEqual(expectedCommand)
})
