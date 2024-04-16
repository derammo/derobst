import { Editor } from "obsidian";

export interface ContextMenuActions {
    /**
     * if true, then the context menu should show the delete action
     */
	canDelete: boolean;
    
    /**
     * @returns true if the document was modified
     */
	delete(edito: Editor): boolean;
}
