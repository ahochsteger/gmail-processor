import { MockProxy, anyString, matches, mock } from "jest-mock-extended"
import {
  EntryScope,
  EntryType,
  FileData,
  FolderData,
  GDriveData,
} from "./GDriveData"
import { Mocks } from "./MockFactory"

export const E2E_BASE_FOLDER_ID = "GmailProcessor-Tests-id"
export const E2E_BASE_FOLDER_NAME = "GmailProcessor-Tests"
export const E2E_TEST_FOLDER_ID = "e2e01-id"
export const E2E_TEST_FOLDER_NAME = "e2e01"
export const EXISTING_FILE_ID = "some-existing-file-id"
export const EXISTING_FILE_NAME = "some-existing-file.txt"
export const EXISTING_FOLDER_ID = "folder-1-id"
export const EXISTING_FOLDER_NAME = "Folder 1"
export const LOGSHEET_FILE_ID = "logsheet-file-id"
export const LOGSHEET_FILE_NAME = "logsheet-${date.now:format:yyyy-MM}"
export const LOGSHEET_FILE_PATH = `/${E2E_BASE_FOLDER_NAME}/${LOGSHEET_FILE_NAME}`
export const MESSAGE_PDF_FILE_ID = "created-message-pdf-file-id"
export const MESSAGE_PDF_FILE_NAME = "created-message-pdf-file.pdf"
export const NEW_EXISTING_FILE_ID = "new-existing-file-id"
export const NEW_EXISTING_FILE_NAME = EXISTING_FILE_NAME
export const NEW_FILE_ID = "created-file-id"
export const NEW_FILE_NAME = "created-file.txt"
export const NEW_FOLDER_ID = "created-folder-id"
export const NEW_FOLDER_NAME = "created-folder"
export const NEW_NESTED_FILE_ID = "created-nested-file-id"
export const NEW_NESTED_FILE_NAME = "created-nested-file.txt"
export const NEW_NESTED_FOLDER_ID = "subject-1-id"
export const NEW_NESTED_FOLDER_NAME = "Subject 1"
export const NO_FILE_ID = "no-file-id"
export const NO_FILE_NAME = "no-file.txt"
export const NO_FOLDER_ID = "no-folder-id"
export const NO_FOLDER_NAME = "no-folder"
export const ROOT_FOLDER_ID = "root-folder-id"
export const ROOT_FOLDER_NAME = "root-folder"
export const NEW_PDF_FILE_ID = "created-thread-pdf-file-id"
export const NEW_PDF_FILE_NAME = "created-thread-pdf-file.pdf"

export class GDriveMocks {
  public static setupBlobMocks(
    fileData: FileData,
  ): MockProxy<GoogleAppsScript.Base.Blob> {
    const blob = fileData.blob as MockProxy<GoogleAppsScript.Base.Blob>
    blob.getAs.mockReturnValue(blob).mockName("getAs")
    blob.getBlob.mockReturnValue(blob).mockName("getBlob")
    blob.getDataAsString
      .mockReturnValue(fileData.content)
      .mockName("getDataAsString")
    blob.getName.mockReturnValue(fileData.name).mockName("getName")
    return blob
  }

  public static setupFileMocks(
    fileData: FileData,
    parentFolder: FolderData,
  ): MockProxy<GoogleAppsScript.Drive.File> {
    const file = fileData.entry
    file.getId.mockReturnValue(fileData.id).mockName("getId")
    file.getName.mockReturnValue(fileData.name).mockName("getName")
    // file.getMimeType.mockReturnValue(fileData.mimeType)
    // file.getAs.mockReturnValue(fileData.content)
    file.setContent.mockReturnValue(file).mockName("setContent")
    file.setDescription.mockReturnValue(file).mockName("setDescription")
    file.setName.mockReturnValue(file).mockName("setName")
    file.moveTo.mockReturnValue(file).mockName("moveTo")
    file.setTrashed.mockReturnValue(file).mockName("setTrashed")
    file.getParents
      .mockReturnValue(this.setupFolderIterator([parentFolder]))
      .mockName("getParents")
    this.setupBlobMocks(fileData)
    return file
  }

  public static setupFolderMocks(
    folderData: FolderData,
    parentFolder?: FolderData,
  ): MockProxy<GoogleAppsScript.Drive.Folder> {
    const folder = folderData.entry
    folder.getId.mockReturnValue(folderData.id).mockName("getId")
    folder.getName.mockReturnValue(folderData.name).mockName("getName")
    if (parentFolder) {
      folder.getParents
        .mockReturnValue(this.setupFolderIterator([parentFolder]))
        .mockName("getParents")
    }

    // Default behavior for (non-existing) getFilesByName/getFoldersByName:
    folder.getFilesByName
      .calledWith(anyString())
      .mockReturnValue(this.setupFileIterator())
      .mockName("getFilesByName-empty")
    folder.getFoldersByName
      .calledWith(anyString())
      .mockReturnValue(this.setupFolderIterator())
      .mockName("getFoldersByName-empty")

    // Default behavior for createFile/createFolder:
    type CreateFileWithBlob = (
      blobSource: GoogleAppsScript.Base.BlobSource,
    ) => GoogleAppsScript.Drive.File
    ;(folder.createFile as MockProxy<CreateFileWithBlob>) = jest
      .fn((blobSource: GoogleAppsScript.Base.BlobSource) => {
        let file: GoogleAppsScript.Drive.File | null = null
        folderData
          .getFiles()
          .filter(
            (spec) =>
              spec.scope === EntryScope.CREATED &&
              spec.name === blobSource.getBlob().getName(),
          )
          .forEach((spec) => {
            file = this.setupFileMocks(spec, folderData)
          })
        return file ?? mock<GoogleAppsScript.Drive.File>()
      })
      .mockName("createFile-error")
    folder.createFolder
      .calledWith(anyString())
      .mockImplementation((name: string) => {
        throw Error(`Cannot create folder '${name}' - no mock data available!`)
      })
      .mockName("createFolder-error")

    // Setup contained files:
    for (const spec of folderData.getFiles()) {
      if (spec.scope === EntryScope.EXISTING) {
        folder.getFilesByName
          .calledWith(matches((name) => name === spec.name))
          .mockReturnValue(this.setupFileIterator([spec]))
          .mockName("getFilesByName-existing")
      }
      this.setupFileMocks(spec, folderData)
    }

    // Setup contained folders:
    for (const spec of folderData.getFolders()) {
      if (spec.scope === EntryScope.EXISTING) {
        folder.getFoldersByName
          .calledWith(matches((name) => name === spec.name))
          .mockReturnValue(this.setupFolderIterator([spec]))
          .mockName("getFoldersByName-existing")
      }
      if (spec.scope === EntryScope.CREATED) {
        folder.createFolder
          .calledWith(matches((name) => name === spec.name))
          .mockReturnValue(spec.entry)
          .mockName("createFolder-ok")
      }
      // Setup nested folders:
      this.setupFolderMocks(spec, folderData)
    }

    return folder
  }

  public static setupFileIterator(
    specs: FileData[] = [],
    iterator: MockProxy<GoogleAppsScript.Drive.FileIterator> = mock<GoogleAppsScript.Drive.FileIterator>(),
  ): MockProxy<GoogleAppsScript.Drive.FileIterator> {
    iterator.hasNext.mockReturnValue(false).mockName("hasNext-false")
    iterator.next
      .mockImplementation(() => {
        throw Error("No next file!")
      })
      .mockName("next-error")
    for (const spec of specs) {
      iterator.hasNext.mockReturnValueOnce(true).mockName("hasNext-true-once")
      iterator.next
        .mockImplementationOnce(() => spec.entry)
        .mockName("next-ok-once")
    }
    return iterator
  }

  public static setupFolderIterator(
    specs: FolderData[] = [],
    iterator: MockProxy<GoogleAppsScript.Drive.FolderIterator> = mock<GoogleAppsScript.Drive.FolderIterator>(),
  ): MockProxy<GoogleAppsScript.Drive.FolderIterator> {
    iterator.hasNext.mockReturnValue(false).mockName("hasNext-false")
    iterator.next
      .mockImplementation(() => {
        throw Error("No next folder!")
      })
      .mockName("next-error")
    for (const spec of specs) {
      iterator.hasNext.mockReturnValueOnce(true).mockName("hasNext-true-once")
      iterator.next.mockReturnValueOnce(spec.entry).mockName("next-ok-once")
    }
    return iterator
  }

  public static setupGDriveAppMocks(
    driveSpec: GDriveData,
    gdriveApp: MockProxy<GoogleAppsScript.Drive.DriveApp> = mock<GoogleAppsScript.Drive.DriveApp>(),
  ): MockProxy<GoogleAppsScript.Drive.DriveApp> {
    const rootFolder = GDriveMocks.setupFolderMocks(driveSpec)
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

    for (const spec of driveSpec.getNestedFiles()) {
      if (spec.entryType === EntryType.FILE) {
        gdriveApp.getFileById
          .calledWith(matches((id) => id === spec.id))
          .mockReturnValue(spec.entry)
        if (spec.scope === EntryScope.EXISTING) {
          gdriveApp.getFilesByName
            .calledWith(matches((name) => name === spec.name))
            .mockReturnValue(this.setupFileIterator([spec]))
        }
      }
    }
    for (const spec of driveSpec.getNestedFolders()) {
      if (spec.entryType === EntryType.FOLDER) {
        gdriveApp.getFolderById
          .calledWith(matches((id) => id === spec.id))
          .mockReturnValue(spec.entry)
        if (spec.scope === EntryScope.EXISTING) {
          gdriveApp.getFoldersByName
            .calledWith(matches((name) => name === spec.name))
            .mockReturnValue(this.setupFolderIterator([spec]))
        }
      }
    }
    return gdriveApp
  }

  public static getSampleDriveData(mocks: Mocks) {
    return new GDriveData(
      mocks.rootFolder,
      ROOT_FOLDER_ID,
      ROOT_FOLDER_NAME,
      EntryScope.EXISTING,
      [
        new FileData(
          mocks.existingFile,
          EXISTING_FILE_ID,
          EXISTING_FILE_NAME,
          mocks.existingBlob,
          EntryScope.EXISTING,
        ),
        new FileData(
          mocks.newExistingFile,
          NEW_EXISTING_FILE_ID,
          NEW_EXISTING_FILE_NAME,
          mocks.newExistingBlob,
          EntryScope.CREATED,
        ),
        new FolderData(
          mocks.existingFolder,
          EXISTING_FOLDER_ID,
          EXISTING_FOLDER_NAME,
          EntryScope.EXISTING,
          [
            new FolderData(
              mocks.newNestedFolder,
              NEW_NESTED_FOLDER_ID,
              NEW_NESTED_FOLDER_NAME,
              EntryScope.CREATED,
            ),
          ],
        ),
        new FileData(
          mocks.newFile,
          NEW_FILE_ID,
          NEW_FILE_NAME,
          mocks.newBlob,
          EntryScope.CREATED,
        ),
        new FileData(
          mocks.newPdfFile,
          NEW_PDF_FILE_ID,
          NEW_PDF_FILE_NAME,
          mocks.newPdfBlob,
          EntryScope.CREATED,
          "PDF Content",
        ),
        new FolderData(
          mocks.newFolder,
          NEW_FOLDER_ID,
          NEW_FOLDER_NAME,
          EntryScope.CREATED,
          [
            new FileData(
              mocks.newNestedFile,
              NEW_NESTED_FILE_ID,
              NEW_NESTED_FILE_NAME,
              mocks.newNestedBlob,
              EntryScope.CREATED,
            ),
          ],
        ),
        new FolderData(
          mocks.e2eBaseFolder,
          E2E_BASE_FOLDER_ID,
          E2E_BASE_FOLDER_NAME,
          EntryScope.CREATED,
          [
            new FolderData(
              mocks.e2eTestFolder,
              E2E_TEST_FOLDER_ID,
              E2E_TEST_FOLDER_NAME,
              EntryScope.CREATED,
            ),
            new FileData(
              mocks.logSpreadsheetFile,
              LOGSHEET_FILE_ID,
              LOGSHEET_FILE_NAME,
              mocks.logSpreadsheetBlob,
            ),
          ],
        ),
      ],
    )
  }

  public static setupAllMocks(mocks: Mocks) {
    const driveSpec = this.getSampleDriveData(mocks)
    GDriveMocks.setupGDriveAppMocks(driveSpec, mocks.gdriveApp)
  }
}
