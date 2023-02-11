import { EditorView } from '@codemirror/view';
import { SyntaxNode, SyntaxNodeRef } from '@lezer/common/dist/tree';

import { MinimalPlugin } from 'derobst/interfaces';
import { ViewPluginContext } from 'derobst/view';

import { MinimalCommand } from './CommandDispatcher';

export abstract class ParsedCommand<THostPlugin extends MinimalPlugin> implements MinimalCommand<THostPlugin> {
    abstract buildWidget(context: ViewPluginContext<THostPlugin>): void;
    abstract get regex(): RegExp;

    // WARNING: this is only stable as long as the document does not change, because it contains offsets into the text
    commandNode: SyntaxNode;

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
}

