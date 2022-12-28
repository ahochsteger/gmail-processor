import { BaseAdapter } from "./BaseAdapter"

export enum ConflictStrategy {
  KEEP = "keep",
  SKIP = "skip",
  REPLACE = "replace",
  ERROR = "error",
}

export class GDriveAdapter extends BaseAdapter {

  constructor(
    public logger: Console = console,
    public dryRun: boolean = false,
    public driveApp: GoogleAppsScript.Drive.DriveApp,
  ) {
    super(logger, dryRun)
  }

  // TODO: Continue here!!!
  // * Test the new functions (storeAttachment, processAttachmentRule, eval*, buildSubstitutionMap)

  // =================== PRIVATE METHODS ======================

  /**
   * Returns the GDrive folder with the given path.
   */
  public getFolderFromPath(path: string): GoogleAppsScript.Drive.Folder {
    const parts = path.split("/")

    if (parts[0] === "") {
      parts.shift()
    } // Did path start at root, '/'?

    let folder = this.driveApp.getRootFolder()
    // for (let i = 0; i < parts.length; i++) {
    for (const subfolder of parts) {
      const result = folder.getFoldersByName(subfolder)
      if (result.hasNext()) {
        folder = result.next()
      } else {
        this.logger.error("Folder '" + path + "' not found.")
        throw new Error("Folder '" + path + "' not found.")
      }
    }
    return folder
  }

  // =================== PUBLIC METHODS ======================

  /**
   * Creates a new file in Google Drive
   * @param location The location of the file including the filename
   * @param content The content of the file as a string representation
   * @param mimeType The mime-type of the file
   * @param description The description of the file
   * @param conflictStrategy The conflict strategy in case a file already exists at the file location (skip, replace)
   */
  public createFile(
    location: string,
    content: string,
    mimeType: string,
    description: string,
    conflictStrategy: ConflictStrategy,
  ): GoogleAppsScript.Drive.File {
    const folderpath = this.getFolderPathFromLocation(location)
    const filename = this.getFilenameFromLocation(location)
    const folder = this.getOrCreateFolderFromPath(folderpath)
    const existingFiles = this.getFilesFromPath(location)

    // Handle conflicts with existing files:
    if (
      existingFiles != null &&
      existingFiles.hasNext() &&
      conflictStrategy === ConflictStrategy.SKIP
    ) {
      this.logger.warn(
        "   Skipping existing file '" +
          location +
          "' (using conflict strategy 'SKIP')!",
      )
      return existingFiles.next()
    } else if (
      existingFiles != null &&
      existingFiles.hasNext() &&
      conflictStrategy === ConflictStrategy.REPLACE
    ) {
      while (existingFiles.hasNext()) {
        const existingFile = existingFiles.next()
        const existingFileId = existingFile.getId()
        const removeStatus = this.driveApp.removeFile(existingFile)
        this.logger.warn(
          '   Existing file "' +
            existingFile +
            '" (id:"' +
            existingFileId +
            '", status:' +
            removeStatus +
            ") has been deleted (using conflict strategy 'REPLACE')!",
        )
      }
    } else if (
      existingFiles != null &&
      existingFiles.hasNext() &&
      conflictStrategy === ConflictStrategy.ERROR
    ) {
      throw new Error(
        "Conflict with existing file at location '" +
          location +
          "' (using conflict strategy 'ERROR')!",
      )
    }

    // Create file:
    const file: GoogleAppsScript.Drive.File = folder.createFile(
      filename,
      content,
      mimeType,
    )
    file.setDescription(description)
    return file
  }

  public storeAttachment(
    attachment: GoogleAppsScript.Gmail.GmailAttachment,
    location: string,
    conflictStrategy: ConflictStrategy,
    description: string,
  ) {
    if (
      this.checkDryRun(
        `Storing attachment '${attachment.getName()}' to '${location}' ...`,
      )
    )
      return
    const file = this.createFile(
      location,
      attachment.getDataAsString(),
      attachment.getContentType(),
      description,
      conflictStrategy,
    )
    return file
  }

  /**
   * Returns the GDrive folder with the given name or creates it if not existing.
   */
  private getOrCreateFolderFromPath(
    path: string,
  ): GoogleAppsScript.Drive.Folder {
    let folder: GoogleAppsScript.Drive.Folder
    try {
      folder = this.getFolderFromPath(path)
    } catch (e) {
      const folderArray = path.split("/")
      folder = this.getOrCreateSubFolder(
        this.driveApp.getRootFolder(),
        folderArray,
      )
    }
    return folder
  }

  private getFilesFromPath(location: string) {
    const folderPath = this.getFolderPathFromLocation(location)
    const filename = this.getFilenameFromLocation(location)
    let folder = this.getFolderFromPath(folderPath)
    let fileIterator = folder.getFilesByName(filename)
    return fileIterator
  }

  /**
   * Recursive function to create and return a complete folder path.
   */
  private getOrCreateSubFolder(
    baseFolder: GoogleAppsScript.Drive.Folder,
    folderArray: string[],
  ): GoogleAppsScript.Drive.Folder {
    if (folderArray.length === 0) {
      return baseFolder
    }
    const nextFolderName = folderArray.shift()
    let nextFolder = null
    const folders = baseFolder.getFolders()
    while (folders.hasNext()) {
      const folder = folders.next()
      if (folder.getName() === nextFolderName) {
        nextFolder = folder
        break
      }
    }
    if (nextFolder == null && nextFolderName != null) {
      // Folder does not exist - create it.
      nextFolder = baseFolder.createFolder(nextFolderName)
    }
    if (nextFolder == null) {
      throw new Error("Cannot create folder '" + nextFolderName + "'!")
    }
    return this.getOrCreateSubFolder(nextFolder, folderArray)
  }

  private getFolderPathFromLocation(location: string) {
    return location.substring(0, location.lastIndexOf("/"))
  }

  private getFilenameFromLocation(location: string) {
    return location.substring(location.lastIndexOf("/") + 1)
  }
}
