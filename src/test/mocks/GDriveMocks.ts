import { MockProxy, anyString, matches, mock } from "jest-mock-extended"
import { EntryScope, FileData, FolderData, GDriveData } from "./GDriveData"
import { Mocks } from "./MockFactory"

export const CREATED_FILE_ID = "created-file-id"
export const CREATED_FILE_NAME = "created-file.txt"
export const CREATED_FOLDER_ID = "created-folder-id"
export const CREATED_FOLDER_NAME = "created-folder"
export const CREATED_NESTED_FILE_ID = "created-nested-file-id"
export const CREATED_NESTED_FILE_NAME = "created-nested-file.txt"
export const EXISTING_FILE_ID = "some-existing-file-id"
export const EXISTING_FILE_NAME = "some-existing-file.txt"
export const EXISTING_FOLDER_ID = "some-existing-folder-id"
export const EXISTING_FOLDER_NAME = "some-existing-folder"
export const NO_FILE_ID = "no-file-id"
export const NO_FILE_NAME = "no-file.txt"
export const NO_FOLDER_ID = "no-folder-id"
export const NO_FOLDER_NAME = "no-folder"
export const ROOT_FOLDER_ID = "root-folder-id"
export const ROOT_FOLDER_NAME = "root-folder"
export const LOGSHEET_FILE_ID = "logsheet-file-id"
export const LOGSHEET_FILE_NAME = "logsheet-file-name"

export class GDriveMocks {
  public static setupFileMocks(
    fileData: FileData,
    file: MockProxy<GoogleAppsScript.Drive.File>,
    parentFolder: MockProxy<GoogleAppsScript.Drive.Folder> = mock<GoogleAppsScript.Drive.Folder>(),
  ): MockProxy<GoogleAppsScript.Drive.File> {
    file.getId.mockReturnValue(fileData.id)
    file.getName.mockReturnValue(fileData.name)
    file.setContent.mockReturnValue(file)
    file.setDescription.mockReturnValue(file)
    file.setName.mockReturnValue(file)
    file.moveTo.mockReturnValue(file)
    file.setTrashed.mockReturnValue(file)
    file.getParents.mockReturnValue(
      this.setupFolderIterator([
        new FolderData(parentFolder, ROOT_FOLDER_ID, ROOT_FOLDER_NAME),
      ]),
    )
    return file
  }

  public static setupFolderMocks(
    FolderData: FolderData,
    folder: MockProxy<GoogleAppsScript.Drive.Folder> = mock<GoogleAppsScript.Drive.Folder>(),
  ): MockProxy<GoogleAppsScript.Drive.Folder> {
    // Default behavior for (non-existing) getFilesByName/getFoldersByName:
    folder.getFilesByName
      .calledWith(anyString())
      .mockReturnValue(this.setupFileIterator())
    folder.getFoldersByName
      .calledWith(anyString())
      .mockReturnValue(this.setupFolderIterator())

    // Setup existing files + folders:
    for (const spec of FolderData.getFiles(EntryScope.EXISTING)) {
      folder.getFilesByName
        .calledWith(matches((name) => name === spec.name))
        .mockReturnValue(this.setupFileIterator([spec]))
    }
    for (const spec of FolderData.getFolders(EntryScope.EXISTING)) {
      folder.getFoldersByName
        .calledWith(matches((name) => name === spec.name))
        .mockReturnValue(this.setupFolderIterator([spec]))
      this.setupFolderMocks(
        spec,
        spec.entry as MockProxy<GoogleAppsScript.Drive.Folder>,
      )
    }

    // Default behavior for createFile/createFolder:
    folder.createFile.mockReturnValue(
      FolderData.getFiles(EntryScope.CREATED)?.[0]?.entry ||
        mock<GoogleAppsScript.Drive.File>(),
    )
    folder.createFolder.mockReturnValue(
      FolderData.getFolders(EntryScope.CREATED)?.[0]?.entry ||
        mock<GoogleAppsScript.Drive.Folder>(),
    )

    // Setup created files + folders:
    for (const spec of FolderData.getFiles(EntryScope.CREATED)) {
      folder.createFile
        .calledWith(
          matches((name) => name === spec.name),
          anyString(),
          anyString(),
        )
        .mockReturnValue(spec.entry)
    }
    for (const spec of FolderData.getFolders(EntryScope.CREATED)) {
      folder.createFolder
        .calledWith(matches((name) => name === spec.name))
        .mockReturnValue(spec.entry)
      this.setupFolderMocks(
        spec,
        spec.entry as MockProxy<GoogleAppsScript.Drive.Folder>,
      )
    }

    return folder
  }

  public static setupFileIterator(
    specs: FileData[] = [],
    iterator: MockProxy<GoogleAppsScript.Drive.FileIterator> = mock<GoogleAppsScript.Drive.FileIterator>(),
  ): MockProxy<GoogleAppsScript.Drive.FileIterator> {
    iterator.hasNext.mockReturnValue(false)
    iterator.next.mockImplementation(() => {
      throw Error("No next file!")
    })
    for (const spec of specs) {
      iterator.hasNext.mockReturnValueOnce(true)
      iterator.next.mockReturnValueOnce(spec.entry)
    }
    return iterator
  }

  public static setupFolderIterator(
    specs: FolderData[] = [],
    iterator: MockProxy<GoogleAppsScript.Drive.FolderIterator> = mock<GoogleAppsScript.Drive.FolderIterator>(),
  ): MockProxy<GoogleAppsScript.Drive.FolderIterator> {
    iterator.hasNext.mockReturnValue(false)
    iterator.next.mockImplementation(() => {
      throw Error("No next folder!")
    })
    for (const spec of specs) {
      iterator.hasNext.mockReturnValueOnce(true)
      iterator.next.mockReturnValueOnce(spec.entry)
    }
    return iterator
  }

  public static setupGDriveAppMocks(
    driveSpec: GDriveData,
    gdriveApp: MockProxy<GoogleAppsScript.Drive.DriveApp> = mock<GoogleAppsScript.Drive.DriveApp>(),
    rootFolder: MockProxy<GoogleAppsScript.Drive.Folder> = mock<GoogleAppsScript.Drive.Folder>(),
  ): MockProxy<GoogleAppsScript.Drive.DriveApp> {
    rootFolder = GDriveMocks.setupFolderMocks(driveSpec, rootFolder)
    gdriveApp.getRootFolder.mockReturnValue(rootFolder)
    gdriveApp.getFileById.calledWith(anyString()).mockImplementation((id) => {
      throw Error(`No such file id: ${id}`)
    })
    gdriveApp.getFilesByName
      .calledWith(anyString())
      .mockReturnValue(this.setupFileIterator())
    gdriveApp.getFolderById.calledWith(anyString()).mockImplementation((id) => {
      throw Error(`No such folder id: ${id}`)
    })
    gdriveApp.getFoldersByName
      .calledWith(anyString())
      .mockReturnValue(this.setupFolderIterator())

    for (const spec of driveSpec.getNestedFiles(
      driveSpec,
      EntryScope.EXISTING,
    )) {
      gdriveApp.getFileById
        .calledWith(matches((id) => id === spec.id))
        .mockReturnValue(spec.entry)
      gdriveApp.getFilesByName
        .calledWith(matches((name) => name === spec.name))
        .mockReturnValue(this.setupFileIterator([spec]))
    }
    for (const spec of driveSpec.getNestedFolders(
      driveSpec,
      EntryScope.EXISTING,
    )) {
      gdriveApp.getFolderById
        .calledWith(matches((id) => id === spec.id))
        .mockReturnValue(spec.entry)
      gdriveApp.getFoldersByName
        .calledWith(matches((name) => name === spec.name))
        .mockReturnValue(this.setupFolderIterator([spec]))
    }
    return gdriveApp
  }

  public static setupAllMocks(mocks: Mocks) {
    const existingFileData = new FileData(
      mocks.existingFile,
      EXISTING_FILE_ID,
      EXISTING_FILE_NAME,
      EntryScope.EXISTING,
    )
    const newFileData = new FileData(
      mocks.newFile,
      CREATED_FILE_ID,
      CREATED_FILE_NAME,
      EntryScope.CREATED,
    )
    mocks.newFile = GDriveMocks.setupFileMocks(
      newFileData,
      mocks.newFile,
      mocks.rootFolder,
    )
    mocks.existingFile = GDriveMocks.setupFileMocks(
      existingFileData,
      mocks.existingFile,
      mocks.rootFolder,
    )
    const driveSpec = new GDriveData(
      mocks.rootFolder,
      ROOT_FOLDER_ID,
      ROOT_FOLDER_NAME,
      EntryScope.EXISTING,
      [
        existingFileData,
        new FileData(
          mocks.logSpreadsheetFile,
          LOGSHEET_FILE_ID,
          LOGSHEET_FILE_NAME,
        ),
        new FolderData(
          mocks.existingFolder,
          EXISTING_FOLDER_ID,
          EXISTING_FOLDER_NAME,
        ),
        new FileData(
          mocks.newFile,
          CREATED_FILE_ID,
          CREATED_FILE_NAME,
          EntryScope.CREATED,
        ),
        new FolderData(
          mocks.newFolder,
          CREATED_FOLDER_ID,
          CREATED_FOLDER_NAME,
          EntryScope.CREATED,
          [
            new FileData(
              mocks.newNestedFile,
              CREATED_NESTED_FILE_ID,
              CREATED_NESTED_FILE_NAME,
              EntryScope.CREATED,
            ),
          ],
        ),
      ],
    )

    mocks.gdriveApp = GDriveMocks.setupGDriveAppMocks(
      driveSpec,
      mocks.gdriveApp,
      mocks.rootFolder,
    )
  }
}
