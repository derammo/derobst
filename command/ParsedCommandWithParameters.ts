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
            match[1].split(/\s+/).forEach((setting: string) => {
                const equals = setting.indexOf("=");
                if (equals == 0) {
                    // discard any work we did
                    console.log(`ignored command parameters containing invalid setting that was supposed to be of format KEY[=VALUE]: '${setting}'`)
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
