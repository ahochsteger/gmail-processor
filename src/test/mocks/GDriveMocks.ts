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
export const EXISTING_FILE_PATH = `/${EXISTING_FILE_NAME}`
export const EXISTING_FOLDER_ID = "folder-1-id"
export const EXISTING_FOLDER_NAME = "Folder 1"
export const GENERIC_NEW_FILE_ID = "generic-created-file-id"
export const GENERIC_NEW_FILE_NAME = "generic-created-file.txt"
export const GENERIC_NEW_FOLDER_ID = "generic-created-folder-id"
export const GENERIC_NEW_FOLDER_NAME = "generic-created-folder"
export const LOGSHEET_FILE_ID = "logsheet-file-id"
export const LOGSHEET_FILE_NAME = "logsheet-${date.now:date::yyyy-MM}"
export const LOGSHEET_FILE_PATH = `/${E2E_BASE_FOLDER_NAME}/${LOGSHEET_FILE_NAME}`
export const MESSAGE_PDF_FILE_ID = "created-message-pdf-file-id"
export const MESSAGE_PDF_FILE_NAME = "created-message-pdf-file.pdf"
export const NEW_DOCS_FILE_CONTENT =
  "...\nInvoice date: 2024-03-13\nInvoice number: 12345678\n..."
export const NEW_DOCS_FILE_ID = "created-docs-file-id"
export const NEW_DOCS_FILE_NAME = "created-docs-file"
export const NEW_EXISTING_FILE_ID = "new-existing-file-id"
export const NEW_EXISTING_FILE_NAME = EXISTING_FILE_NAME
export const NEW_FILE_ID = "created-file-id"
export const NEW_FILE_NAME = "created-file.txt"
export const NEW_FILE_PATH = `/${NEW_FILE_NAME}`
export const NEW_FOLDER_ID = "created-folder-id"
export const NEW_FOLDER_NAME = "created-folder"
export const NEW_PDF_FILE_CONTENT = "PDF Content"
export const NEW_PDF_FILE_ID = "created-pdf-file-id"
export const NEW_PDF_FILE_NAME = "created-pdf-file.pdf"
export const NEW_NESTED_FILE_ID = "created-nested-file-id"
export const NEW_NESTED_FILE_NAME = "created-nested-file.txt"
export const NEW_NESTED_FOLDER_ID = "subject-1-id"
export const NEW_NESTED_FOLDER_NAME = "Subject 1"
export const NEW_HTML_FILE_CONTENT = "HTML Content"
export const NEW_HTML_FILE_ID = "created-html-file-id"
export const NEW_HTML_FILE_NAME = "created-html-file.html"
export const NO_FILE_ID = "no-file-id"
export const NO_FILE_NAME = "no-file.txt"
export const NO_FOLDER_ID = "no-folder-id"
export const NO_FOLDER_NAME = "no-folder"
export const ROOT_FOLDER_ID = "root-folder-id"
export const ROOT_FOLDER_NAME = "root-folder"

export const genericNewFileNamePatterns = [
  "example",
  "generic",
  "^Message Subject 1 - 1\\.jpg$",
]
export const genericNewFolderNamePatterns = [
  "example",
  "generic",
  "^Subject 2$",
]

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
    blob.getContentType
      .mockReturnValue(fileData.contentType)
      .mockName("getContentType")
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
    genericNewFile: MockProxy<GoogleAppsScript.Drive.File> = mock<GoogleAppsScript.Drive.File>(),
    genericNewFolder: MockProxy<GoogleAppsScript.Drive.Folder> = mock<GoogleAppsScript.Drive.Folder>(),
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
        const fileName = blobSource?.getBlob()?.getName()
        for (const p of genericNewFileNamePatterns) {
          if (fileName && new RegExp(p).exec(fileName)) {
            file = genericNewFile
          }
        }
        folderData
          .getFiles()
          .filter(
            (spec) =>
              spec.scope === EntryScope.CREATED && spec.name === fileName,
          )
          .forEach((spec) => {
            file = this.setupFileMocks(spec, folderData)
          })
        if (file) {
          return file
        } else {
          throw new Error(
            `Cannot create file '${fileName}' - no mock data available!`,
          )
        }
      })
      .mockName("createFile-error")
    folder.createFolder
      .calledWith(anyString())
      .mockImplementation((name: string) => {
        for (const p of genericNewFolderNamePatterns) {
          if (name && new RegExp(p).exec(name)) {
            return genericNewFolder
          }
        }
        throw new Error(
          `Cannot create folder '${name}' - no mock data available!`,
        )
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
      this.setupFolderMocks(spec, genericNewFile, genericNewFolder, folderData)
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

  public static setupDocumentAppMocks(
    _driveSpec: GDriveData,
    documentApp: MockProxy<GoogleAppsScript.Document.DocumentApp>,
  ): MockProxy<GoogleAppsScript.Document.DocumentApp> {
    // Mocks for GDriveAdapter.extractAttachmentText()
    const body = mock<GoogleAppsScript.Document.Body>()
    body.getText.mockReturnValue(NEW_DOCS_FILE_CONTENT)
    const document = mock<GoogleAppsScript.Document.Document>()
    documentApp.openById.mockReturnValue(document)
    document.getBody.mockReturnValue(body)
    return documentApp
  }

  public static setupDriveApiMocks(
    driveSpec: GDriveData,
    driveApi: MockProxy<GoogleAppsScript.Drive>,
    genericNewFile: MockProxy<GoogleAppsScript.Drive.File>,
  ): MockProxy<GoogleAppsScript.Drive> {
    const files: MockProxy<GoogleAppsScript.Drive.Collection.FilesCollection> =
      mock<GoogleAppsScript.Drive.Collection.FilesCollection>()
    files.copy
      .mockReturnValue({ id: genericNewFile.getId() })
      .mockName("copy-default")
    files.insert
      .mockImplementation((resource) => {
        let file: GoogleAppsScript.Drive.File | null = null
        const fileName = resource.title
        for (const p of genericNewFileNamePatterns) {
          if (fileName && new RegExp(p).exec(fileName)) {
            file = genericNewFile
          }
        }
        driveSpec
          .getNestedFiles()
          .filter(
            (spec) =>
              spec.scope === EntryScope.CREATED && spec.name === fileName,
          )
          .forEach((spec) => {
            file = spec.entry
          })
        if (file) {
          return { id: file.getId() }
        } else {
          throw new Error(
            `Cannot create file '${fileName}' - no mock data available!`,
          )
        }
      })
      .mockName("insert-default")
    driveApi.Files = files
    return driveApi
  }

  public static setupGDriveAppMocks(
    driveSpec: GDriveData,
    gdriveApp: MockProxy<GoogleAppsScript.Drive.DriveApp>,
    genericNewFile: MockProxy<GoogleAppsScript.Drive.File>,
    genericNewFolder: MockProxy<GoogleAppsScript.Drive.Folder>,
  ): MockProxy<GoogleAppsScript.Drive.DriveApp> {
    const rootFolder = GDriveMocks.setupFolderMocks(
      driveSpec,
      genericNewFile,
      genericNewFolder,
    )
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
          mocks.genericNewFile,
          NEW_FILE_ID,
          NEW_FILE_NAME,
          mocks.genericNewBlob,
          EntryScope.CREATED,
        ),
        new FolderData(
          mocks.genericNewFolder,
          NEW_FOLDER_ID,
          NEW_FOLDER_NAME,
          EntryScope.CREATED,
        ),
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
            new FileData(
              mocks.newHtmlFile,
              NEW_HTML_FILE_ID,
              NEW_HTML_FILE_NAME,
              mocks.newHtmlBlob,
              EntryScope.CREATED,
              NEW_HTML_FILE_CONTENT,
              "text/html",
            ),
            new FileData(
              mocks.newPdfFile,
              NEW_PDF_FILE_ID,
              NEW_PDF_FILE_NAME,
              mocks.newPdfBlob,
              EntryScope.CREATED,
              NEW_PDF_FILE_CONTENT,
              "application/pdf",
            ),
            new FileData(
              mocks.newDocsFile,
              NEW_DOCS_FILE_ID,
              NEW_DOCS_FILE_NAME,
              mocks.newDocsBlob,
              EntryScope.CREATED,
              NEW_DOCS_FILE_CONTENT,
              "application/vnd.google-apps.document",
            ),
          ],
        ),
      ],
    )
  }

  public static setupAllMocks(mocks: Mocks) {
    const driveSpec = this.getSampleDriveData(mocks)
    // Setup special mocks:
    this.setupFileMocks(
      new FileData(
        mocks.genericNewFile,
        GENERIC_NEW_FILE_ID,
        `/${GENERIC_NEW_FILE_NAME}`,
      ),
      driveSpec,
    )
    GDriveMocks.setupGDriveAppMocks(
      driveSpec,
      mocks.gdriveApp,
      mocks.genericNewFile,
      mocks.genericNewFolder,
    )
    GDriveMocks.setupDriveApiMocks(
      driveSpec,
      mocks.driveApi,
      mocks.genericNewFile,
    )
    GDriveMocks.setupDocumentAppMocks(driveSpec, mocks.documentApp)
    mocks.newHtmlBlob.getAs.mockReturnValue(mocks.newPdfBlob)
  }
}
