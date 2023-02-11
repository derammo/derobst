import { CachedMetadata, Plugin, TAbstractFile, TFile, Vault } from "obsidian";

export abstract class GlobalMetaData<T> {
    private initialized = false;
    protected managedPaths: Map<string, T> = new Map<string, T>();

    constructor(private plugin: Plugin) {
        // no code
    }

    initialize() {
		if (this.initialized) {
            return;
        }

		this.plugin.registerEvent(this.plugin.app.metadataCache.on('changed', (file: TFile, data: string, cache: CachedMetadata) => this.onMetadataChanged(file, data, cache)));
        this.plugin.registerEvent(this.plugin.app.metadataCache.on('deleted', (file: TFile, prevCache: CachedMetadata | null) => this.onMetadataDeleted(file, prevCache)));
        this.plugin.registerEvent(this.plugin.app.vault.on('rename', (file: TAbstractFile, oldPath: string) => this.onFileRenamed(file, oldPath)));
        this.plugin.registerEvent(this.plugin.app.vault.on('closed', () => this.onVaultClosed()));

        this.scan();
        this.initialized = true;
    }

    shutdown() {
        this.managedPaths.clear();
    }
    
	scan() {
		Vault.recurseChildren(app.vault.getRoot(), (entry: TAbstractFile) => {
            if (entry instanceof TFile) {
                const file = entry as TFile;
                this.handleChange(file, app.metadataCache.getFileCache(file));
            }
        });
	}

    protected onFileRenamed(entry: TAbstractFile, oldPath: string): void {
        // this will be called if rename happens inside the Obsidian UI, otherwise it is delivered as delete/create
        if (!(entry instanceof TFile)) {
            return;
        }
        const file = entry as TFile;
        const cache = app.metadataCache.getFileCache(file);
        let fileData = this.managedPaths.get(oldPath);
        if (fileData === undefined) {
            // wasn't managed before, so probably won't be now either, but let's check it
            this.handleChange(file, cache);
            return;
        }

        // assuming contents remain the same
        this.managedPaths.delete(oldPath);

        fileData = this.renameEntry(fileData, file.path, oldPath);
        this.managedPaths.set(file.path, fileData);
    }

    protected onVaultClosed(): void {
        this.shutdown();
    }

	protected onMetadataChanged(file: TFile, data: string, cache: CachedMetadata): void {
        // WARNING this is signaled for every change to the file, since paragraph and line info 
        // are considered metadata
        this.handleChange(file, cache);
	}

	protected onMetadataDeleted(file: TFile, _prevCache: CachedMetadata | null): void {
        const fileData: T | undefined = this.managedPaths.get(file.path);
        if (fileData === undefined) {
            return;
        }
        this.removeEntry(file, fileData);  
        this.managedPaths.delete(file.path);
	}    

    protected handleChange(file: TFile, cache: CachedMetadata | null): void {
        let fileData: T | undefined = this.managedPaths.get(file.path);
        if (fileData === undefined) {
            // need to check if we now have content
            fileData = this.considerEntry(file, cache);
            if (fileData !== undefined) {
                this.managedPaths.set(file.path, fileData);
            }
            return;
        }

        // updating existing file
        fileData = this.updateEntry(file, fileData, cache);
        if (fileData === undefined) {
            // no longer qualified
            this.managedPaths.delete(file.path);
        } else {
            // just change
            this.managedPaths.set(file.path, fileData);  
        }
    }

    protected abstract considerEntry(file: TFile, fileMeta: CachedMetadata | null): T | undefined;
    protected abstract updateEntry(file: TFile, current: T, newData: CachedMetadata | null): T | undefined;
    protected abstract removeEntry(file: TFile, current: T): void;
    protected abstract renameEntry(current: T, newPath: string, oldPath: string): T;
}
