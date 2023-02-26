import { EditorView } from '@codemirror/view';
import { SyntaxNodeRef } from '@lezer/common/dist/tree';

import { Editor, EditorPosition } from 'obsidian';

import { MinimalCommandHost, WidgetContext } from '../interfaces';
import { UpdatedTextRange, ViewPluginContext } from '../view';

import { ContextMenuActions } from '../interfaces/ContextMenuActions';
import { MinimalCommand } from './CommandDispatcher';

export abstract class ParsedCommand<THostPlugin extends MinimalCommandHost<THostPlugin>> implements MinimalCommand<THostPlugin>, ContextMenuActions {
    commandRange: UpdatedTextRange | undefined = undefined;

    abstract buildWidget(context: ViewPluginContext<THostPlugin>, commandNodeRef: SyntaxNodeRef): void;

    abstract get regex(): RegExp;

    parse(context: WidgetContext<THostPlugin>, text: string, commandNodeRef: SyntaxNodeRef): RegExpMatchArray | null {
        if (this.commandRange !== undefined) {
            throw new Error("must not reuse ParsedCommand object, since it carries state and is referenced by clients")
        }
        const match: RegExpMatchArray | null = text.match(this.regex);
        if (match === null) {
            return match;
        }

        this.commandRange = context.plugin.tracking.register(context.state, commandNodeRef);
        return match;
    }

	async handleUsed(_view: EditorView) {
        // no code
	}

    canDelete = true;

    /**
     * Delete using editor interface, as called from menu.  Can't access the state of the document, since we don't have it.
     * @param editor 
     * @returns 
     */
    delete(editor: Editor): boolean {
        if (this.commandRange === undefined) {
            return false;
        }
        const range = this.commandRange.fetchCurrentRange();
        if (range === null) {
            return false;
        }
        const from: EditorPosition = editor.offsetToPos(range.from-1);
        const to: EditorPosition = editor.offsetToPos(range.to+1);
        editor.replaceRange("", from, to);
        return true;

    }
}

