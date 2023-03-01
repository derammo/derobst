import { EditorView } from '@codemirror/view';
import { SyntaxNodeRef } from '@lezer/common/dist/tree';
import { MinimalCommandHost } from '../interfaces';
import { CommandContext } from './CommandDispatcher';
import { ParsedCommand } from './ParsedCommandBase';

export abstract class ParsedCommandWithParameters<THostPlugin extends MinimalCommandHost<THostPlugin>> extends ParsedCommand<THostPlugin> {
    parameters: { [key: string]: boolean | string; } = {};

    async handleUsed(view: EditorView) {
        super.handleUsed(view);
        if (!this.parameters.remove) {
            return;
        } 
        const range = this.commandRange?.fetchCurrentRange() ?? null;
        if (range === null) {
            return;
        }
        view.dispatch({
            changes: { from: range.from - 1, to: range.to + 1 }
        });
    }

    parse(context: CommandContext<THostPlugin>, text: string, commandNodeRef: SyntaxNodeRef): RegExpMatchArray | null {
        const match = super.parse(context, text, commandNodeRef);
        if (match === null) {
            return match;
        }
        if (match[1] !== undefined) {
            // string values, supporting double quotes
            for (const parameterMatch of match[1].matchAll(/([^= ]+)=(?:"(.+?)"|([^=\s]+(?=\s|$)))/g)) {
                if (parameterMatch[2] !== undefined) {
                    this.parameters[parameterMatch[1]] = parameterMatch[2];
                } else if (parameterMatch[3] !== undefined) {
                    this.parameters[parameterMatch[1]] = parameterMatch[3];
                }
            }
            // boolean values
            for (const parameterMatch of match[1].matchAll(/(?:^|\s)([^"= ]+)(?:\s|$)/g)) {
                this.parameters[parameterMatch[1]] = true;
            }
        }
        return match;
    }
}
