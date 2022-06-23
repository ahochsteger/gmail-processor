import { mock } from "jest-mock-extended"

export class MockObjects {
  public console = mock<Console>()
  public gmailApp = mock<GoogleAppsScript.Gmail.GmailApp>()
  public gdriveApp = mock<GoogleAppsScript.Drive.DriveApp>()
  public utilities = mock<GoogleAppsScript.Utilities.Utilities>()
}
