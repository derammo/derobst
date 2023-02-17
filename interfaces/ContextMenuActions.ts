import { Editor } from "obsidian";

export interface ContextMenuActions {
	canDelete: boolean;
    
    /**
     * @returns true if the document was modified
     */
	delete(edito: Editor): boolean;
}
