import { withTimeout } from "../main/PromiseTimeout";

type WaitingClient<T> = { resolve: (api: T) => void; reject: (error: unknown) => void; };

/**
 * A record for each API that is exported from a plugin or that is imported by a client.
 * This record will exist even if the plugin that is supposed to provide the API is not
 * installed or has not yet been started.
 */
export interface PluginInterface<T> {
    api: T | undefined;
    rejected: unknown | undefined;
    waitingClients: WaitingClient<T>[] | undefined;
}

/**
 * These function used to access the shared API information in a type-safe way
 * and will be frozen to the version imported by the client.
 * 
 * @remarks It is critically important that this storage is always operational,
 * even when plugins have not yet been initialized.  For example, the popular
 * Obsidian location of `app.plugins.plugins` is not suitable.
 */
export interface PluginABI<T> {
    /**
     * Callback to store interface record.  The provided record must be returned by future calls to {@link getInterface} and may be mutated by the caller
     * in the interim.
     * 
     * @remarks
     * This function will usually need to lazy initialize the storage for APIs.
     * 
     * @param record will be a usually empty record constructed by the caller
     */
    initializeInterface(record: PluginInterface<T>): void;

    /**
     * Callback to retrieve the interface record for this specific interface.  Must return the same record as was passed to {@link initializeInterface}.
     * 
     * @returns undefined if the storage for APIs is not yet initialized or if no record has been stored for this interface via {@link initializeInterface}
     */
    getInterface(): PluginInterface<T> | undefined;
}

/**
 * Default implementation of ABI that uses global "window" storage for all interfaces.
 */
export class DefaultABI<T> implements PluginABI<T> {
    /**
     * @param version must uniquely identify a specific version of a specific interface, e.g. "mydomain.myinterface.v1"
     */
    constructor(private readonly version: string) {
        // no code
    }

    initializeInterface(record: PluginInterface<T>): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-undef
        const storage = window as any;
        storage["derammo.api"] = storage["derammo.api"] ?? { interfaces: {} };
        storage["derammo.api"].interfaces = storage["derammo.api"].interfaces ?? {}; 
        storage["derammo.api"].interfaces[this.version] = record;
    }

    getInterface(): PluginInterface<T> | undefined {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-undef
        const storage = window as any;
        return storage["derammo.api"]?.interfaces?.[this.version];
    }
}

export function getAPI<T>(abi: PluginABI<T>, timeoutMilliseconds?: number): Promise<T> {
    const record = initialize<T>(abi);
    if (record.api !== undefined) {
        // is ready
        return Promise.resolve(record.api);
    }
    if (record.rejected !== undefined) {
        // is failed
        return Promise.reject(record.rejected);
    }
    record.waitingClients = record.waitingClients ?? [];
    const future = new Promise<T>((resolve, reject) => {
        record.waitingClients?.push({ resolve, reject });
    });
    if (timeoutMilliseconds === undefined) {
        return future;
    }
    return withTimeout(future, timeoutMilliseconds);
}

export function publishAPI<T>(abi: PluginABI<T>, api: T | undefined): void {
    const record = initialize<T>(abi);
    if (api !== undefined && record.api !== undefined) {
        console.error(`API already set`);
        return;
    }
    record.api = api;
    record.rejected = undefined;

    if (api === undefined) {
        console.debug(`resetting API, not notifying clients until API is actually published`);
        return;
    }

    if (record.waitingClients === undefined) {
        console.debug(`no clients waiting for API`);
        return;
    }

    // notify any clients who started before us and are therefore waiting
    for (const client of record.waitingClients) {
        client.resolve(api);
    }
    
    // satisfied all waiting clients
    record.waitingClients = undefined;
}

export function rejectAPI<T>(abi: PluginABI<T>, error: unknown): void {
    const record = initialize<T>(abi);
    record.api = undefined;
    record.rejected = error;
    if (record.waitingClients === undefined) {
        return;
    }

    // notify any clients who started before us and are therefore waiting
    for (const client of record.waitingClients) {
        client.reject(error);
    }
    
    // informed all waiting clients
    record.waitingClients = undefined;
}

function initialize<T>(abi: PluginABI<T>) {
    let current = abi.getInterface();
    if (current === undefined) {
        current = { api: undefined, rejected: undefined, waitingClients: undefined };
        abi.initializeInterface(current);
    }
    return current;
}