import { withTimeout } from "../main/PromiseTimeout";

export type WaitingClient<T> = { resolve: (api: T) => void; reject: (error: unknown) => void; };

// these function used to access the shared API information in a type-safe way
// will be frozen to the version imported by the client, since the closures are passed in by 
// the client
export interface PluginABI<T> {
    // to be provided if interfaces are not going to be stored at window["derammo.api"], to lazy initialize
    // whatever storage is used
    initialize?(): void;

    getAPI(): T | undefined;
    setAPI(api: T | undefined): void;
    getClients(): WaitingClient<T>[] | undefined;
    setClients(clients: WaitingClient<T>[] | undefined): void;
}

function initialize<T>(abi: PluginABI<T>) {
    if (abi.initialize !== undefined) {
        abi.initialize();
    } else {
        // our default storage location
        if ((window as any)["derammo.api"] === undefined) {
            (window as any)["derammo.api"] = { providers: {}, clients: {} };
        }
    }
}

export function getAPI<T>(abi: PluginABI<T>, timeoutMilliseconds?: number): Promise<T> {
    initialize<T>(abi);
    const current = abi.getAPI();
    if (current !== undefined) {
        return Promise.resolve(current);
    }
    const future = new Promise<T>((resolve, reject) => {
        if (abi.getClients() === undefined) {
            abi.setClients([]);
        }
        abi.getClients()!.push({ resolve, reject });
    });
    if (timeoutMilliseconds === undefined) {
        return future;
    }
    return withTimeout(future, timeoutMilliseconds);
}

export function publishAPI<T>(abi: PluginABI<T>, api: T | undefined): void {
    initialize<T>(abi);
    if (abi.getAPI() !== undefined && api !== undefined) {
        console.error(`${typeof api} already set`);
        return;
    }
    abi.setAPI(api);

    if (api === undefined) {
        console.debug(`resetting ${typeof api}, no notifications needed`);
        return;
    }

    if (abi.getClients() === undefined) {
        console.debug(`${typeof api} no waiting clients`);
        return;
    }

    // notify any clients who started before us and are therefore waiting
    const clients: WaitingClient<T>[] = abi.getClients()!;
    for (let client of clients) {
        client.resolve(api);
    }
    
    // satisfied all waiting clients
    abi.setClients(undefined);
}

export function rejectAPI<T>(abi: PluginABI<T>, error: unknown): void {
    initialize<T>(abi);
    abi.setAPI(undefined);
    if (abi.getClients() === undefined) {
        return;
    }

    // notify any clients who started before us and are therefore waiting
    const clients: WaitingClient<T>[] = abi.getClients()!;
    for (let client of clients) {
        client.reject(error);
    }
    
    // informed all waiting clients
    abi.setClients(undefined);
}
