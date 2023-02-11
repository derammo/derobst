import { CommandDispatcher } from "../command/CommandDispatcher";
import { MinimalPlugin } from "./MinimalPlugin";

// minimum services for an Obsidian plugin that supports textual commands
export interface MinimalCommandHost<THostPlugin extends MinimalPlugin> extends MinimalPlugin {
    commands: CommandDispatcher<THostPlugin>;

    // pass through to Obsidian API
    registerDomEvent<K extends keyof WindowEventMap>(el: Window, type: K, callback: (this: HTMLElement, ev: WindowEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    registerDomEvent<K extends keyof DocumentEventMap>(el: Document, type: K, callback: (this: HTMLElement, ev: DocumentEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    registerDomEvent<K extends keyof HTMLElementEventMap>(el: HTMLElement, type: K, callback: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
}
