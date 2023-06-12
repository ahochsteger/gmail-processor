import { EnvContext, RunMode } from "../Context"
import { BaseAdapter } from "./BaseAdapter"

export enum ConflictStrategy {
  ERROR = "error",
  BACKUP = "backup",
  KEEP = "keep",
  REPLACE = "replace",
  SKIP = "skip",
  UPDATE = "update",
}

export type LocationInfo = {
  filename: string
  folderId: string | null
  folderPath: string
  fullPath: string // TODO: Rename to filePath
  location: string
  pathSegments: string[]
}

export type FileData = {
  content: string
  mimeType: string
  description: string
}

export class DriveUtils {
  public static createFile(
    ctx: EnvContext,
    location: string,
    fileData: FileData,
    conflictStrategy: ConflictStrategy,
  ): GoogleAppsScript.Drive.File {
    const locationInfo = this.extractLocationInfo(location)

    const { filename } = locationInfo
    const parentFolder = this.getParentFolder(ctx.env.gdriveApp, locationInfo)

    if (!parentFolder) {
      const errorMessage = `Invalid parent folder: ${location}`
      ctx.log.error(errorMessage)
      throw new Error(errorMessage)
    }

    const existingFiles = parentFolder.getFilesByName(filename)

    if (existingFiles.hasNext()) {
      const existingFile = existingFiles.next()

      switch (conflictStrategy) {
        case ConflictStrategy.BACKUP:
          return this.createWithBackup(
            ctx,
            parentFolder,
            existingFile,
            fileData,
          )
        case ConflictStrategy.KEEP:
          return this.createFileInParent(ctx, parentFolder, filename, fileData)
        case ConflictStrategy.SKIP:
          ctx.log.warn(
            `A file with the same name already exists at location: ${location}. Skipping file creation.`,
          )
          return existingFile
        case ConflictStrategy.REPLACE:
          if (ctx.env.runMode === RunMode.DANGEROUS) {
            ctx.log.warn(
              `A file with the same name already exists at location: ${location}. Replacing ...`,
            )
            this.deleteFile(ctx, existingFile)
            return this.createFileInParent(
              ctx,
              parentFolder,
              filename,
              fileData,
            )
          } else {
            ctx.log.warn(
              `A file with the same name already exists at location: ${location}. Skipping replacing due to runmode ...`,
            )
            return existingFile
          }
        case ConflictStrategy.UPDATE:
          if (ctx.env.runMode === RunMode.DANGEROUS) {
            ctx.log.warn(
              `A file with the same name already exists at location: ${location}. Updating the file contents.`,
            )
            return this.updateExistingFile(ctx, existingFile, fileData)
          } else {
            ctx.log.warn(
              `A file with the same name already exists at location: ${location}. Skipping update due to runmode ...`,
            )
            return existingFile
          }
        case ConflictStrategy.ERROR: {
          const errorMessage = `Conflict: A file with the same name already exists at location: ${location}`
          ctx.log.error(errorMessage)
          throw new Error(errorMessage)
        }
      }
    } else {
      return this.createFileInParent(ctx, parentFolder, filename, fileData)
    }
  }

  public static ensureFolderExists(ctx: EnvContext, location: string) {
    const locationInfo = this.extractLocationInfo(location)

    const parentFolder = this.getParentFolder(ctx.env.gdriveApp, locationInfo)
    return parentFolder
  }

  public static extractLocationInfo(location: string): LocationInfo {
    const folderIdRegex = /^{id:([^}]*)}/
    const matches = location.match(folderIdRegex)

    let folderId: string | null = null
    let path: string

    if (matches) {
      folderId = matches[1]
      path = location.replace(folderIdRegex, "")
    } else if (location.startsWith("/")) {
      path = location.slice(1)
    } else {
      path = location
    }

    const pathSegments = path.split("/").filter((segment) => segment !== "")

    if (pathSegments.length === 0) {
      throw new Error(`Invalid location format: ${location}`)
    }

    const filename = pathSegments.pop()?.toString() ?? ""
    const folderPath = pathSegments.join("/")

    return {
      location,
      folderId,
      pathSegments,
      filename,
      folderPath,
      fullPath: `${folderPath}/${filename}`,
    }
  }

  private static getParentFolder(
    gdriveApp: GoogleAppsScript.Drive.DriveApp,
    locationInfo: LocationInfo,
  ): GoogleAppsScript.Drive.Folder {
    let parentFolder: GoogleAppsScript.Drive.Folder

    const { folderId, pathSegments } = locationInfo
    if (folderId) {
      parentFolder = gdriveApp.getFolderById(folderId)
      if (!parentFolder) {
        throw new Error(`Invalid parent folder ID: ${folderId}`)
      }
    } else {
      parentFolder = gdriveApp.getRootFolder()
    }

    for (const segment of pathSegments) {
      const folders = parentFolder.getFoldersByName(segment)

      if (folders.hasNext()) {
        parentFolder = folders.next()
      } else {
        parentFolder = parentFolder.createFolder(segment)
      }
    }

    return parentFolder
  }

  private static createWithBackup(
    ctx: EnvContext,
    folder: GoogleAppsScript.Drive.Folder,
    existingFile: GoogleAppsScript.Drive.File,
    fileData: FileData,
  ): GoogleAppsScript.Drive.File {
    const filename = existingFile.getName()
    const nameParts = filename.split(".")
    const baseName = nameParts.slice(0, -1).join(".")
    const extension = nameParts[nameParts.length - 1]
    const backupFilename = `${baseName} (Backup).${extension}`
    existingFile.setName(backupFilename)
    return this.createFileInParent(ctx, folder, filename, fileData)
  }

  private static createFileInParent(
    _ctx: EnvContext,
    parentFolder: GoogleAppsScript.Drive.Folder,
    filename: string,
    fileData: FileData,
  ): GoogleAppsScript.Drive.File {
    return parentFolder
      .createFile(filename, fileData.content, fileData.mimeType)
      .setDescription(fileData.description)
  }

  private static deleteFile(
    ctx: EnvContext,
    file: GoogleAppsScript.Drive.File,
  ): void {
    ctx.log.info(`Deleting existing file: ${file.getName()}`)
    file.setTrashed(true)
  }

  private static updateExistingFile(
    _ctx: EnvContext,
    file: GoogleAppsScript.Drive.File,
    fileData: FileData,
  ): GoogleAppsScript.Drive.File {
    return file
      .setContent(fileData.content)
      .setDescription(fileData.description)
  }
}

export class GDriveAdapter extends BaseAdapter {
  //private gdriveApp: GoogleAppsScript.Drive.DriveApp
  constructor(public ctx: EnvContext) {
    super(ctx)
    //this.gdriveApp = ctx.env.gdriveApp
  }

  // TODO: Continue here!!!
  // * Test the new functions (storeAttachment, processAttachmentRule, eval*, buildSubstitutionMap)

  // =================== PRIVATE METHODS ======================

  /**
   * Returns the GDrive folder with the given path.
   */
  /*
  private getFolderFromPath(path: string): GoogleAppsScript.Drive.Folder {
    const parts = path.split("/")

    if (parts[0] === "") {
      parts.shift()
    } // Did path start at root, '/'?

    let folder = this.gdriveApp.getRootFolder()
    // for (let i = 0; i < parts.length; i++) {
    for (const subfolder of parts) {
      const result = folder.getFoldersByName(subfolder)
      if (result.hasNext()) {
        folder = result.next()
      } else {
        console.error("Folder '" + path + "' not found.")
        throw new Error("Folder '" + path + "' not found.")
      }
    }
    return folder
  }
  */

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
    fileData: FileData,
    conflictStrategy: ConflictStrategy,
  ): GoogleAppsScript.Drive.File {
    return DriveUtils.createFile(this.ctx, location, fileData, conflictStrategy)
  }
  /*
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
    const existingFiles = folder.getFilesByName(filename)
    const fileExists = existingFiles.hasNext()

    // Handle conflicts with existing files:
    if (fileExists && conflictStrategy === ConflictStrategy.SKIP) {
      console.warn(
        `Skipping existing file '${location}' (using conflict strategy 'SKIP')!`,
      )
      return existingFiles.next()
    } else if (fileExists && conflictStrategy === ConflictStrategy.REPLACE) {
      if (this.ctx.env.runMode !== RunMode.DANGEROUS) {
        throw new Error(
          `Skipped replacing existing file '${location}' due to run mode ${this.ctx.env.runMode}!`,
        )
      }
      const existingFile = existingFiles.next()
      const existingFileId = existingFile.getId()
      const removeStatus = this.gdriveApp.removeFile(existingFile)
      console.warn(
        '   Existing file "' +
          existingFile +
          '" (id:"' +
          existingFileId +
          '", status:' +
          removeStatus +
          ") has been deleted (using conflict strategy 'REPLACE')!",
      )
    } else if (fileExists && conflictStrategy === ConflictStrategy.ERROR) {
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
  }*/

  public storeAttachment(
    attachment: GoogleAppsScript.Gmail.GmailAttachment,
    location: string,
    conflictStrategy: ConflictStrategy,
    description: string,
  ): GoogleAppsScript.Drive.File {
    console.info(
      `Storing attachment '${attachment.getName()}' to '${location}' ...`,
    )
    const fileData: FileData = {
      content: attachment.getDataAsString(),
      mimeType: attachment.getContentType(),
      description,
    }
    const file = DriveUtils.createFile(
      this.ctx,
      location,
      fileData,
      conflictStrategy,
    )
    return file
  }

  /**
   * Returns the GDrive folder with the given name or creates it if not existing.
   */
  /*
  private getOrCreateFolderFromPath(
    path: string,
  ): GoogleAppsScript.Drive.Folder {
    let folder: GoogleAppsScript.Drive.Folder
    try {
      folder = this.getFolderFromPath(path)
    } catch (e) {
      const folderArray = path.split("/")
      folder = this.getOrCreateSubFolder(
        this.gdriveApp.getRootFolder(),
        folderArray,
      )
    }
    return folder
  }
  */

  /**
   * Recursive function to create and return a complete folder path.
   */
  /*
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
      console.info("Creating folder ${nextFolderName} ...")
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
  */
}
