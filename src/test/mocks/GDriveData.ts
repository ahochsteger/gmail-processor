import { MockProxy, mock } from "jest-mock-extended"

export enum EntryScope {
  CREATED = "created",
  EXISTING = "existing",
}

export enum EntryType {
  FILE = "file",
  FOLDER = "folder",
}

class EntryData<
  T extends GoogleAppsScript.Drive.File | GoogleAppsScript.Drive.Folder =
    | GoogleAppsScript.Drive.File
    | GoogleAppsScript.Drive.Folder,
> {
  constructor(
    public entry: MockProxy<T>,
    public id: string,
    public name: string,
    public scope: EntryScope = EntryScope.EXISTING,
    public entryType: EntryType,
  ) {}
}

export class FileData extends EntryData<GoogleAppsScript.Drive.File> {
  constructor(
    public entry: MockProxy<GoogleAppsScript.Drive.File>,
    public id: string,
    public name: string,
    public blob: GoogleAppsScript.Base.Blob = mock<GoogleAppsScript.Base.Blob>(),
    public scope: EntryScope = EntryScope.EXISTING,
    public content = `Contents of blob ${name}`,
    public contentType = "text/plain",
  ) {
    super(entry, id, name, scope, EntryType.FILE)
  }
}

export class FolderData extends EntryData<GoogleAppsScript.Drive.Folder> {
  constructor(
    public entry: MockProxy<GoogleAppsScript.Drive.Folder>,
    public id: string,
    public name: string,
    public scope: EntryScope = EntryScope.EXISTING,
    public entries: EntryData<
      GoogleAppsScript.Drive.File | GoogleAppsScript.Drive.Folder
    >[] = [],
  ) {
    super(entry, id, name, scope, EntryType.FOLDER)
  }
  public getEntries<T extends FileData | FolderData = FileData | FolderData>(
    entryType?: EntryType,
    scope?: EntryScope,
  ): T[] {
    return this.entries.filter(
      (e) =>
        (entryType === undefined || e.entryType === entryType) &&
        (scope === undefined || e.scope === scope),
    ) as T[]
  }
  public getFiles(scope?: EntryScope): FileData[] {
    return this.getEntries<FileData>(EntryType.FILE, scope)
  }
  public getFolders(scope?: EntryScope): FolderData[] {
    return this.getEntries<FolderData>(EntryType.FOLDER, scope)
  }
  public getNestedEntries<
    T extends FileData | FolderData = FileData | FolderData,
  >(entryType?: EntryType, scope?: EntryScope): T[] {
    let entries: T[] = []
    if (entryType === undefined || entryType === EntryType.FOLDER) {
      entries.push(this as unknown as T)
    }
    if (entryType === undefined || entryType === EntryType.FILE) {
      for (const e of this.entries.filter(
        (e) =>
          e.entryType === EntryType.FILE &&
          (scope === undefined || e.scope === scope),
      )) {
        entries.push(e as T)
      }
    }
    for (const childFolder of this.getFolders(scope)) {
      entries = entries.concat(
        childFolder.getNestedEntries<T>(entryType, scope),
      )
    }
    return entries
  }
  public getFilesByName(name: string): FileData[] {
    return this.getFiles().filter((e) => e.name === name)
  }
  public getFoldersByName(name: string): FolderData[] {
    return this.getFolders().filter((e) => e.name === name)
  }
  public getNestedFiles(scope?: EntryScope): FileData[] {
    return this.getNestedEntries<FileData>(EntryType.FILE, scope)
  }
  public getNestedFolders(scope?: EntryScope): FolderData[] {
    return this.getNestedEntries<FolderData>(EntryType.FOLDER, scope)
  }
}

export class GDriveData extends FolderData {
  public getCreatedFileById(id: string): FileData | null {
    return this.getFileById(id, EntryScope.CREATED)
  }
  public getCreatedFolderById(id: string): FolderData | null {
    return this.getFolderById(id, EntryScope.CREATED)
  }
  public getFileById(
    id: string,
    scope: EntryScope = EntryScope.EXISTING,
  ): FileData | null {
    return this.getNestedFiles(scope).filter((e) => e.id === id)?.[0] || null
  }
  public getFolderById(
    id: string,
    scope: EntryScope = EntryScope.EXISTING,
  ): FolderData | null {
    return this.getNestedFolders(scope).filter((e) => e.id === id)?.[0] || null
  }
}
