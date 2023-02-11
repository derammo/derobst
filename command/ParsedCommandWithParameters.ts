import { EditorView } from '@codemirror/view';
import { SyntaxNodeRef } from '@lezer/common/dist/tree';
import { MinimalPlugin } from 'derobst/interfaces';
import { ParsedCommand } from './ParsedCommandBase';

export abstract class ParsedCommandWithParameters<THostPlugin extends MinimalPlugin> extends ParsedCommand<THostPlugin> {
    parameters: { [key: string]: boolean | string; } = {};

    async handleUsed(view: EditorView) {
        super.handleUsed(view);
        if (this.parameters.remove && this.commandNode !== undefined) {
            view.dispatch({
                changes: { from: this.commandNode.from - 1, to: this.commandNode.to + 1 }
            });
        }
    }

    parse(text: string, commandNodeRef: SyntaxNodeRef): RegExpMatchArray | null {
        const match = super.parse(text, commandNodeRef);
        if (match === null) {
            return match;
        }
        if (match[1] !== undefined) {
            match[1].split(/\s+/).forEach((setting: string) => {
                const equals = setting.indexOf("=");
                if (equals == 0) {
                    // discard any work we did
                    // XXX log parse error
                    this.parameters = {};
                    return null;
                }
                if (equals > 0) {
                    this.parameters[setting.slice(0, equals)] = setting.slice(equals + 1);
                } else {
                    this.parameters[setting] = true;
                }
            });
        }
        return match;
    }
}
