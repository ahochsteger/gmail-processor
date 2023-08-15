import { LOGSHEET_FILE_ID } from "./GDriveMocks"
import { Mocks } from "./MockFactory"

export class SpreadsheetMocks {
  public static setupAllMocks(mocks: Mocks) {
    mocks.logSheet.getLastRow.mockReturnValue(3).mockName("getLastRow")
    mocks.logSheet.getRange
      .mockReturnValue(mocks.logSheetRange)
      .mockName("getRange")
    mocks.logSheet.appendRow
      .mockReturnValue(mocks.logSheet)
      .mockName("appendRow")
    mocks.logSheetRange.setValues
      .mockReturnValue(mocks.logSheetRange)
      .mockName("setValues")
    mocks.logSpreadsheet.getId
      .mockReturnValue(LOGSHEET_FILE_ID)
      .mockName("getId")
    mocks.logSpreadsheet.getSheets
      .mockReturnValue([mocks.logSheet])
      .mockName("getSheets")
    mocks.spreadsheetApp.create
      .mockReturnValue(mocks.logSpreadsheet)
      .mockName("create")
    mocks.spreadsheetApp.openById
      .mockReturnValue(mocks.logSpreadsheet)
      .mockName("openById")
    mocks.logSpreadsheetFile.moveTo
      .mockReturnValue(mocks.logSpreadsheetFile)
      .mockName("moveTo")
  }
}
