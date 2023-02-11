import { CachedMetadata, TFile } from "obsidian";
import { GlobalMetaData } from "./GlobalMetaData";

type TagInfo = { [key: string]: unknown; }

export class Definitions {
    stale = false;
    items: Map<string, TagInfo> = new Map<string, TagInfo>();
    effective: TagInfo | undefined = undefined;

    add(definingPath: string, info: TagInfo) {
        this.items.set(definingPath, info);
        this.stale = true;
    }

    remove(definingPath: string) {
        this.items.delete(definingPath);
        this.stale = true;
    }

    rename(newPath: string, oldPath: string) {
        const info = this.items.get(oldPath);
        if (info === undefined) {
            return;
        }
        this.items.delete(oldPath);
        this.items.set(newPath, info);
        this.stale = true;
    }

    get value(): TagInfo | undefined {
        if (this.stale) {
            this.effective = this.computeEffective();
            this.stale = false;
        }
        return this.effective;
    }

    private computeEffective(): TagInfo | undefined {
        // We don't bother to keep these sorted, since usually there are
        // very few redefinitions.   If that were to change, we would need
        // to maintain a sorted arrray with binary search.
        let highestPriorityPath: string;
        let effectiveValue: TagInfo | undefined = undefined;
        this.items.forEach((value, key) => {
            if (highestPriorityPath === undefined || highestPriorityPath > key) {
                highestPriorityPath = key;
                effectiveValue = value;
            }
        });
        return effectiveValue;
    }
}

type FileDefinitions = { 
    /**
     * Storage key under which this is also stored, as back reference in case of removal.
     */
    key: string; 

    /**
     * Definitions of the meta data from various files that define this key
     */
    value: Definitions; 
}[];

export abstract class GlobalFrontMatter extends GlobalMetaData<FileDefinitions> {
    protected rootKey = "example-meta-data";

    protected considerEntry(file: TFile, fileMeta: CachedMetadata | null): FileDefinitions | undefined {
        if (fileMeta === undefined || fileMeta === null) {
            return undefined;
        }
        const frontMatter = fileMeta.frontmatter;

        // WARNING: there is some use of null in meta data
        const collection = frontMatter?.[this.rootKey] ?? undefined;
        if (collection === undefined) {
            return undefined;
        }

        const fileData: FileDefinitions = [];
        for (const key of Object.getOwnPropertyNames(collection)) {
            const value = collection[key];
            const record: Definitions | undefined = this.resolveRecord(key);
            if (record === undefined) {
                // not interested in this key
                return undefined;
            }
            record.add(file.path, value);
            fileData.push({ key: key, value: record });
        }

        // don't bother tracking files that define no keys
        if (fileData.length === 0) {
            return undefined;
        }

        return fileData;
    }

    // storage detail
    protected abstract resolveRecord(key: string): Definitions | undefined;

    // storage detail
    protected abstract removeRecord(key: string): void;

    protected updateEntry(file: TFile, current: FileDefinitions, newData: CachedMetadata | null): FileDefinitions | undefined {
        // unoptimized, simply start over
        this.removeEntry(file, current);
        return this.considerEntry(file, newData);
    }

    protected removeEntry(file: TFile, current: FileDefinitions): void {
        for (const record of current) {
            record.value.remove(file.path);
            if (record.value.items.size === 0) {
                // no longer has any definitions, so clean it up
                this.removeRecord(record.key);
            }
        }
    }

    protected renameEntry(current: FileDefinitions, newPath: string, oldPath: string): FileDefinitions {
        // we are allowed to destructively modify and return the input array
        for (const record of current) {
            record.value.rename(newPath, oldPath);
        }
        return current;
    }
}
