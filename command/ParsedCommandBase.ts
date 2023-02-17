import { EditorView } from '@codemirror/view';
import { SyntaxNode, SyntaxNodeRef } from '@lezer/common/dist/tree';

import { MinimalPlugin } from '../interfaces';
import { ViewPluginContext } from '../view';

import { MinimalCommand } from './CommandDispatcher';
import { ContextMenuActions } from '../interfaces/ContextMenuActions';
import { Editor, EditorPosition } from 'obsidian';

export abstract class ParsedCommand<THostPlugin extends MinimalPlugin> implements MinimalCommand<THostPlugin>, ContextMenuActions {
    abstract buildWidget(context: ViewPluginContext<THostPlugin>): void;
    abstract get regex(): RegExp;

    // WARNING: this is only stable as long as the document does not change, because it contains offsets into the text
    commandNode: SyntaxNode | undefined = undefined;

    parse(text: string, commandNodeRef: SyntaxNodeRef): RegExpMatchArray | null {
        if (this.commandNode !== undefined) {
            throw new Error("must not reuse ParsedCommand object, since it carries state and is referenced by clients")
        }
        const match: RegExpMatchArray | null = text.match(this.regex);
        if (match === null) {
            return match;
        }

        // freeze to retain this node
        this.commandNode = commandNodeRef.node; 
        return match;
    }

	async handleUsed(_view: EditorView) {
        // no code
	}

    canDelete = true;

    delete(editor: Editor): boolean {
        if (this.commandNode === undefined) {
            return false;
        }
        const from: EditorPosition = editor.offsetToPos(this.commandNode.from-1);
        const to: EditorPosition = editor.offsetToPos(this.commandNode.to+1);
        editor.replaceRange("", from, to);
        return true;
    }
}

