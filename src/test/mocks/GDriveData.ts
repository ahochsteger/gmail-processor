export enum EntryScope {
  CREATED = "created",
  EXISTING = "existing",
}

export enum EntryType {
  FILE = "file",
  FOLDER = "folder",
}

export class EntryData<
  T extends GoogleAppsScript.Drive.File | GoogleAppsScript.Drive.Folder =
    | GoogleAppsScript.Drive.File
    | GoogleAppsScript.Drive.Folder,
> {
  constructor(
    public entry: T,
    public id: string,
    public name: string,
    public scope: EntryScope = EntryScope.EXISTING,
    public entryType: EntryType,
  ) {}
}

export class FileData extends EntryData<GoogleAppsScript.Drive.File> {
  constructor(
    public entry: GoogleAppsScript.Drive.File,
    public id: string,
    public name: string,
    public scope: EntryScope = EntryScope.EXISTING,
  ) {
    super(entry, id, name, scope, EntryType.FILE)
  }
}

export class FolderData extends EntryData<GoogleAppsScript.Drive.Folder> {
  constructor(
    public entry: GoogleAppsScript.Drive.Folder,
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
    scope: EntryScope = EntryScope.EXISTING,
  ): T[] {
    return this.entries.filter(
      (e) =>
        (entryType === undefined || e.entryType === entryType) &&
        e.scope === scope,
    ) as T[]
  }
  public getFiles(scope: EntryScope = EntryScope.EXISTING): FileData[] {
    return this.getEntries<FileData>(EntryType.FILE, scope)
  }
  public getFolders(scope: EntryScope = EntryScope.EXISTING): FolderData[] {
    return this.getEntries<FolderData>(EntryType.FOLDER, scope)
  }
  public getNestedEntries<
    T extends FileData | FolderData = FileData | FolderData,
  >(
    folder: FolderData = this,
    entryType?: EntryType,
    scope: EntryScope = EntryScope.EXISTING,
  ): T[] {
    let entries: T[] = []
    for (const e of folder.entries.filter(
      (e) =>
        (entryType === undefined || e.entryType === entryType) &&
        e.scope === scope,
    )) {
      entries.push(e as T)
    }
    for (const childFolder of folder.getFolders(scope)) {
      entries = entries.concat(
        folder.getNestedEntries<T>(childFolder as FolderData, entryType, scope),
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
  public getNestedFiles(
    folder: FolderData = this,
    scope: EntryScope = EntryScope.EXISTING,
  ): FileData[] {
    return folder.getNestedEntries<FileData>(folder, EntryType.FILE, scope)
  }
  public getNestedFolders(
    folder: FolderData = this,
    scope: EntryScope = EntryScope.EXISTING,
  ): FolderData[] {
    return folder.getNestedEntries<FolderData>(folder, EntryType.FOLDER, scope)
  }
}

export class GDriveData extends FolderData {
  public getFileById(
    id: string,
    scope: EntryScope = EntryScope.EXISTING,
  ): FileData | null {
    return (
      this.getNestedFiles(this, scope).filter((e) => e.id === id)?.[0] || null
    )
  }
  public getFolderById(
    id: string,
    scope: EntryScope = EntryScope.EXISTING,
  ): FolderData | null {
    return (
      this.getNestedFolders(this, scope).filter((e) => e.id === id)?.[0] || null
    )
  }
}
