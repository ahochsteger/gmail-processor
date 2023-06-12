import { LOGSHEET_FILE_ID } from "./GDriveMocks"
import { Mocks } from "./MockFactory"

export class SpreadsheetMocks {
  public static setupAllMocks(mocks: Mocks) {
    mocks.logSheet.getLastRow.mockReturnValue(3)
    mocks.logSheet.getRange.mockReturnValue(mocks.logSheetRange)
    mocks.logSheetRange.setValues.mockReturnValue(mocks.logSheetRange)
    mocks.logSpreadsheet.getId.mockReturnValue(LOGSHEET_FILE_ID)
    mocks.logSpreadsheet.getSheets.mockReturnValue([mocks.logSheet])
    mocks.spreadsheetApp.create.mockReturnValue(mocks.logSpreadsheet)
    mocks.spreadsheetApp.openById.mockReturnValue(mocks.logSpreadsheet)
    mocks.logSpreadsheetFile.moveTo.mockReturnValue(mocks.logSpreadsheetFile)
  }
}
