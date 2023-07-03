import { EnvContext, RunMode } from "../Context"
import { BaseAdapter } from "./BaseAdapter"

/** Strategy that defines how to deal in case of conflicts with already existing files at the desired location in Google Drive. */
export enum ConflictStrategy {
  /** Create a backup of the existing file by renaming it. */
  BACKUP = "backup",
  /** Terminate processing with an error. */
  ERROR = "error",
  /** Keep the existing file and create the new one with the same name. */
  KEEP = "keep",
  /** Replace the existing file with the new one. */
  REPLACE = "replace",
  /** Skip creating the new file and keep the existing one. */
  SKIP = "skip",
  /** Update the existing file with the contents of the new one (keep it's file ID). */
  UPDATE = "update",
}

type LocationInfo = {
  filename: string
  folderId: string | null
  folderPath: string
  fullPath: string
  location: string
  pathSegments: string[]
}

export type FileContent = {
  content: string
  mimeType: string
  description: string
}

export class DriveUtils {
  public static createFile(
    ctx: EnvContext,
    location: string,
    fileData: FileContent,
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

    let file: GoogleAppsScript.Drive.File
    if (existingFiles.hasNext()) {
      const existingFile = existingFiles.next()

      switch (conflictStrategy) {
        case ConflictStrategy.BACKUP:
          file = this.createWithBackup(
            ctx,
            parentFolder,
            existingFile,
            fileData,
          )
          break
        case ConflictStrategy.KEEP:
          file = this.createFileInParent(ctx, parentFolder, filename, fileData)
          break
        case ConflictStrategy.SKIP:
          ctx.log.warn(
            `A file with the same name already exists at location: ${location}. Skipping file creation.`,
          )
          file = existingFile
          break
        case ConflictStrategy.REPLACE:
          if (ctx.env.runMode === RunMode.DANGEROUS) {
            ctx.log.warn(
              `A file with the same name already exists at location: ${location}. Replacing ...`,
            )
            this.deleteFile(ctx, existingFile)
            file = this.createFileInParent(
              ctx,
              parentFolder,
              filename,
              fileData,
            )
          } else {
            ctx.log.warn(
              `A file with the same name already exists at location: ${location}. Skipping replacing due to runmode ...`,
            )
            file = existingFile
          }
          break
        case ConflictStrategy.UPDATE:
          if (ctx.env.runMode === RunMode.DANGEROUS) {
            ctx.log.warn(
              `A file with the same name already exists at location: ${location}. Updating the file contents.`,
            )
            file = this.updateExistingFile(ctx, existingFile, fileData)
          } else {
            ctx.log.warn(
              `A file with the same name already exists at location: ${location}. Skipping update due to runmode ...`,
            )
            file = existingFile
          }
          break
        case ConflictStrategy.ERROR: {
          const errorMessage = `Conflict: A file with the same name already exists at location: ${location}`
          ctx.log.error(errorMessage)
          throw new Error(errorMessage)
        }
      }
    } else {
      file = this.createFileInParent(ctx, parentFolder, filename, fileData)
    }
    return file
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
    fileData: FileContent,
  ): GoogleAppsScript.Drive.File {
    const filename = existingFile.getName()
    const nameParts = filename.split(".")
    const baseName = nameParts.slice(0, -1).join(".")
    const extension = nameParts[nameParts.length - 1]
    const backupFilename = `${baseName} (Backup).${extension}`
    existingFile.setName(backupFilename)
    const file = this.createFileInParent(ctx, folder, filename, fileData)
    return file
  }

  private static createFileInParent(
    _ctx: EnvContext,
    parentFolder: GoogleAppsScript.Drive.Folder,
    filename: string,
    fileData: FileContent,
  ): GoogleAppsScript.Drive.File {
    const file = parentFolder.createFile(
      filename,
      fileData.content,
      fileData.mimeType,
    )
    file.setDescription(fileData.description)
    return file
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
    fileData: FileContent,
  ): GoogleAppsScript.Drive.File {
    file = file
      .setContent(fileData.content)
      .setDescription(fileData.description)
    return file
  }
}

export class GDriveAdapter extends BaseAdapter {
  constructor(public ctx: EnvContext) {
    super(ctx)
  }

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
    fileData: FileContent,
    conflictStrategy: ConflictStrategy,
  ): GoogleAppsScript.Drive.File {
    const file = DriveUtils.createFile(
      this.ctx,
      location,
      fileData,
      conflictStrategy,
    )
    return file
  }

  public storeAttachment(
    attachment: GoogleAppsScript.Gmail.GmailAttachment,
    location: string,
    conflictStrategy: ConflictStrategy,
    description: string,
  ): GoogleAppsScript.Drive.File {
    this.ctx.log.info(
      `Storing attachment '${attachment.getName()}' to '${location}' ...`,
    )
    const fileData: FileContent = {
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
}
