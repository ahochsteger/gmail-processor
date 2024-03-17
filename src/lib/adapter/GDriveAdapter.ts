import { EnvContext, RunMode } from "../Context"
import {
  AttachmentExtractTextArgs,
  StoreActionBaseArgs,
} from "../config/ActionConfig"
import { SettingsConfig } from "../config/SettingsConfig"
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

export type LocationInfo = {
  filename: string
  folderId?: string
  folderPath: string
  fullPath: string
  location: string
  pathSegments: string[]
}

export class FileContent {
  constructor(
    public blob: GoogleAppsScript.Base.Blob,
    public name: string = blob.getName() ?? "",
    public description = "",
    public toMimeType?: string,
  ) {}
}

export class DriveUtils {
  public static findFilesByLocation(ctx: EnvContext, location: string) {
    const locationInfo = this.extractLocationInfo(location)

    const { filename } = locationInfo
    const parentFolder = this.getParentFolder(ctx.env.gdriveApp, locationInfo)

    if (!parentFolder) {
      const errorMessage = `Invalid parent folder: ${location}`
      ctx.log.error(errorMessage)
      throw new Error(errorMessage)
    }

    const existingFiles = parentFolder.getFilesByName(filename)
    return {
      locationInfo,
      parentFolder,
      existingFiles,
    }
  }

  public static createFile(
    ctx: EnvContext,
    location: string,
    fileData: FileContent,
    conflictStrategy: ConflictStrategy,
  ): GoogleAppsScript.Drive.File | undefined {
    const { locationInfo, parentFolder, existingFiles } =
      this.findFilesByLocation(ctx, location)
    let file: GoogleAppsScript.Drive.File | undefined
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
          file = this.createFileInParent(
            ctx,
            parentFolder,
            locationInfo.filename,
            fileData,
          )
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
              locationInfo.filename,
              fileData,
            )
          } else {
            ctx.log.warn(
              `A file with the same name already exists at location: ${location}. Skipping replacing due to runMode ...`,
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
              `A file with the same name already exists at location: ${location}. Skipping update due to runMode ...`,
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
      file = this.createFileInParent(
        ctx,
        parentFolder,
        locationInfo.filename,
        fileData,
      )
    }
    return file
  }

  public static ensureFolderExists(ctx: EnvContext, location: string) {
    const locationInfo = this.extractLocationInfo(location)

    const parentFolder = this.getParentFolder(ctx.env.gdriveApp, locationInfo)
    return parentFolder
  }

  public static extractLocationInfo(location: string): LocationInfo {
    // See regex tests on regex101.com: https://regex101.com/r/rIxb5B/4
    const locationRegex =
      /^({id:(?<folderId>[^}]+)}\/)?(?<folderPath>[^\n]*\/)?(?<filename>[^/\n]+)$/
    const matches = locationRegex.exec(location)
    if (!matches?.groups) {
      throw new Error(`Invalid location format: ${location}`)
    }
    const folderId = matches.groups.folderId
    let folderPath = matches.groups.folderPath ?? ""
    if (folderPath.startsWith("/")) folderPath = folderPath.slice(1)
    if (folderPath.endsWith("/")) folderPath = folderPath.slice(0, -1)
    const filename = matches.groups.filename
    const fullPath = `${folderPath ? folderPath + "/" : ""}${filename}`
    return {
      location,
      folderId,
      pathSegments: folderPath ? folderPath.split("/") : [],
      filename,
      folderPath: folderPath,
      fullPath: fullPath,
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
  ): GoogleAppsScript.Drive.File | undefined {
    const filename = existingFile.getName()
    const nameParts = filename.split(".")
    const baseName = nameParts.slice(0, -1).join(".")
    const extension = nameParts[nameParts.length - 1]
    const backupFilename = `${baseName} (Backup).${extension}`
    ctx.log.info(`Backing up existing file to '${backupFilename}' ...`)
    existingFile.setName(backupFilename)
    const file = this.createFileInParent(ctx, folder, filename, fileData)
    return file
  }

  private static createFileInParent(
    ctx: EnvContext,
    parentFolder: GoogleAppsScript.Drive.Folder,
    filename: string,
    fileData: FileContent,
  ): GoogleAppsScript.Drive.File | undefined {
    ctx.log.info(
      `Creating file '${filename}' in folder '${parentFolder.getName()}' ...`,
    )
    if (!fileData.toMimeType) {
      // Store original document
      const file = parentFolder.createFile(fileData.blob)
      file.setName(filename)
      file.setDescription(fileData.description)
      return file
    } else {
      // Convert converted document
      const fileMetadata: GoogleAppsScript.Drive.Schema.File = {
        description: fileData.description,
        mimeType: fileData.toMimeType,
        parents: [{ id: parentFolder.getId() }],
        title: filename,
      }
      const createdFile = ctx.env.driveApi.Files!.insert(
        fileMetadata,
        fileData.blob,
      )
      if (!createdFile?.id) {
        throw new Error(
          `Failed creating file '${filename}' ${fileData.toMimeType ? " (using MimeType '" + fileData.toMimeType + "')" : ""}!`,
        )
      }
      return ctx.env.gdriveApp.getFileById(createdFile.id)
    }
  }

  private static deleteFile(
    ctx: EnvContext,
    file: GoogleAppsScript.Drive.File,
  ): void {
    ctx.log.info(`Deleting existing file '${file.getName()}' ...`)
    file.setTrashed(true)
  }

  private static updateExistingFile(
    ctx: EnvContext,
    file: GoogleAppsScript.Drive.File,
    fileData: FileContent,
  ): GoogleAppsScript.Drive.File {
    ctx.log.info(`Updating existing file '${file.getName()}' ...`)
    ctx.env.driveApi.Files!.update(
      {
        mimeType: fileData.toMimeType ?? file.getMimeType(),
        description: fileData.description,
      },
      file.getId(),
      fileData.blob,
    )
    return file
  }
}

export class GDriveAdapter extends BaseAdapter {
  constructor(
    public ctx: EnvContext,
    public settings: SettingsConfig,
  ) {
    super(ctx, settings)
  }

  /**
   * Creates a new file in Google Drive
   * @param location - The location of the file including the filename
   * @param content - The content of the file as a string representation
   * @param mimeType - The mime-type of the file
   * @param description - The description of the file
   * @param conflictStrategy - The conflict strategy in case a file already exists at the file location (skip, replace)
   */
  public createFile(
    location: string,
    fileData: FileContent,
    conflictStrategy: ConflictStrategy,
  ): GoogleAppsScript.Drive.File | undefined {
    const file = DriveUtils.createFile(
      this.ctx,
      location,
      fileData,
      conflictStrategy,
    )
    return file
  }

  public extractAttachmentText(
    attachment: GoogleAppsScript.Gmail.GmailAttachment,
    args: AttachmentExtractTextArgs,
  ): {
    text: string | null
    file?: GoogleAppsScript.Drive.File
  } {
    this.ctx.log.debug(
      `GDriveAdapter.extractAttachmentText(): attachment={name:${attachment.getName()},hash:${attachment.getHash()},contentType:${attachment.getContentType()}}, args=${JSON.stringify(args)}`,
    )
    const blob = attachment.copyBlob()

    // Use OCR to convert PDF to a temporary Google Document
    // Restrict the response to include file Id and Title fields only
    const docsFileLocation = args.docsFileLocation
      ? args.docsFileLocation
      : attachment.getName().replace(/\.pdf$/, "")
    const insertResource = {
      title: docsFileLocation, // TODO: Location contains path but this is not allowed here!
      mimeType: attachment.getContentType(), // TODO: Allow overriding content type
    }
    const insertOptionalArgs = {
      ocr: true,
      ocrLanguage: args.language ?? "en",
      fields: "id,title",
    }
    this.ctx.log.debug(
      `GDriveAdapter.extractAttachmentText(): inserting file resource=${JSON.stringify(insertResource)}, optionalArgs=${JSON.stringify(insertOptionalArgs)} ...`,
    )
    const docsFile = this.ctx.env.driveApi.Files!.insert(
      insertResource,
      blob,
      insertOptionalArgs,
    )
    this.ctx.log.debug(
      `GDriveAdapter.extractAttachmentText(): -> ${JSON.stringify(docsFile)}`,
    )
    const id = docsFile?.id
    if (!id) return { text: null }
    const file = this.ctx.env.gdriveApp.getFileById(id)

    // Use the Document API to extract text from the Google Document
    this.ctx.log.debug(
      `GDriveAdapter.extractAttachmentText(): getting document by ID ${id} ...`,
    )
    const document = this.ctx.env.documentApp.openById(id) // TODO: Full exception message is not reported back!
    // Exception: You do not have permission to call DocumentApp.openById. Required permissions: https://www.googleapis.com/auth/documents
    this.ctx.log.debug(
      `GDriveAdapter.extractAttachmentText(): documentApp.openById(): {id:${document.getId()},name:${document.getName()},language:${document.getLanguage()},...}`,
    )
    const body = document.getBody()
    this.ctx.log.debug(
      `GDriveAdapter.extractAttachmentText(): body.getBody(): {type:${body.getType()},attributes:${JSON.stringify(body.getAttributes())},...}`,
    )
    const textContent = body.getText()
    this.ctx.log.debug(
      `GDriveAdapter.extractAttachmentText(): body.getText(): ${textContent}`,
    )

    // Delete the temporary Google Document since it is no longer needed
    if (!args.docsFileLocation) {
      this.ctx.log.debug(
        `GDriveAdapter.extractAttachmentText(): Removing temporary docs file with ID ${id} from location ${docsFileLocation} ...`,
      )
      this.ctx.env.gdriveApp.getFileById(id).setTrashed(true)
    } else {
      this.ctx.log.debug(
        `GDriveAdapter.extractAttachmentText(): Keeping docs file with ID ${id} at location ${docsFileLocation}`,
      )
    }

    return {
      text: textContent,
      file: file,
    }
  }

  public storeAttachment(
    attachment: GoogleAppsScript.Gmail.GmailAttachment,
    args: StoreActionBaseArgs,
  ): GoogleAppsScript.Drive.File | undefined {
    this.ctx.log.info(
      `Storing attachment '${attachment.getName()}' to '${args.location}' ...`,
    )
    const fileData = new FileContent(
      attachment.copyBlob(),
      attachment.getName(),
      args.description,
      args.toMimeType,
    )
    const file = DriveUtils.createFile(
      this.ctx,
      args.location,
      fileData,
      args.conflictStrategy,
    )
    return file
  }
}
