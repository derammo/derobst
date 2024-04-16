import { TextRangeTracking } from "../view";
import { ContextMenuActions } from "./ContextMenuActions";

export interface MinimalPlugin {
	settingsDirty: boolean;
	saveSettings(): Promise<void>;
    
    tracking: TextRangeTracking;

    /** 
     * can be called to tie context menu actions to an HTML element
     */
    registerDomContextMenuTarget(element: HTMLElement, command: ContextMenuActions): void;

    /**
     * can be called to temporarily redirect context menu actions to specific objects we created
     */ 
    setContextTarget(target: ContextMenuActions, timeStampMilliseconds: number): void;
}
