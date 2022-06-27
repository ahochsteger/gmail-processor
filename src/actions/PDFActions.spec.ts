import { mock } from "jest-mock-extended"
import { PDFActions } from "./PDFActions"

it("should provide the action 'exportThreadAsPdfToGDrive'", () => {
  const mockedGDriveApp = mock<GoogleAppsScript.Drive.DriveApp>()
  const pdfActions = new PDFActions(mockedGDriveApp)
  const action = pdfActions.getActions().get("thread.exportAsPdfToGDrive")
  expect(action ? action.constructor.name : null).toEqual("ThreadAction")
})
test.todo("should use filenameTo as the output filename") // See PR #61
