import { withTimeout } from "../main/PromiseTimeout";

type WaitingClient<T> = { resolve: (api: T) => void; reject: (error: unknown) => void; };

export interface PluginInterface<T> {
    api: T | undefined;
    waitingClients: WaitingClient<T>[] | undefined;
}

// these function used to access the shared API information in a type-safe way
// will be frozen to the version imported by the client
export interface PluginABI<T> {
    initializeInterface(record: PluginInterface<T>): void;
    getInterface(): PluginInterface<T> | undefined;
}

export function getAPI<T>(abi: PluginABI<T>, timeoutMilliseconds?: number): Promise<T> {
    const record = initialize<T>(abi);
    if (record.api !== undefined) {
        // is ready
        return Promise.resolve(record.api);
    }
    record.waitingClients = record.waitingClients ?? [];
    const future = new Promise<T>((resolve, reject) => {
        record.waitingClients.push({ resolve, reject });
    });
    if (timeoutMilliseconds === undefined) {
        return future;
    }
    return withTimeout(future, timeoutMilliseconds);
}

export function publishAPI<T>(abi: PluginABI<T>, api: T | undefined): void {
    const record = initialize<T>(abi);
    if (record.api !== undefined) {
        console.error(`${typeof api} already set`);
        return;
    }
    record.api = api;

    if (api === undefined) {
        console.debug(`resetting ${typeof api}, no notifications needed`);
        record.waitingClients = undefined;
        return;
    }

    if (record.waitingClients === undefined) {
        console.debug(`${typeof api} no waiting clients`);
        return;
    }

    // notify any clients who started before us and are therefore waiting
    for (let client of record.waitingClients) {
        client.resolve(api);
    }
    
    // satisfied all waiting clients
    record.waitingClients = undefined;
}

export function rejectAPI<T>(abi: PluginABI<T>, error: unknown): void {
    const record = initialize<T>(abi);
    record.api = undefined;
    if (record.waitingClients === undefined) {
        return;
    }

    // notify any clients who started before us and are therefore waiting
    for (let client of record.waitingClients) {
        client.reject(error);
    }
    
    // informed all waiting clients
    record.waitingClients = undefined;
}

function initialize<T>(abi: PluginABI<T>) {
    let current = abi.getInterface();
    if (current === undefined) {
        current = { api: undefined, waitingClients: undefined };
        abi.initializeInterface(current);
    }
    return current;
}