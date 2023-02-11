import { MinimalPlugin } from "../interfaces/MinimalPlugin";
import { ExtensionContext } from "../main";
import { SyntaxNodeRef, Tree, NodeType } from '@lezer/common';

export const REQUIRED_COMMAND_PREFIX = /^\s*!/;

export interface MinimalCommand<THostPlugin extends MinimalPlugin> {
    parse(text: string, commandNodeRef: SyntaxNodeRef): RegExpMatchArray | null;

    buildWidget(context: ExtensionContext<THostPlugin>): void;

    observe?(node: SyntaxNodeRef): void;
}

export interface MinimalCommandClass<THostPlugin extends MinimalPlugin> {
    new(): MinimalCommand<THostPlugin>;

    // statically check if command text matches this command, to avoid even constructing
    // an instance of this class if that is not necessary
    match(text: string): boolean;

    // if true, this command is always instantiated and receives all tokens in the syntax tree
    observes?: boolean;
}

export class CommandDispatcher<THostPlugin extends MinimalPlugin> {
    private observerClasses: MinimalCommandClass<THostPlugin>[] = [];
    private commandOnlyClasses: MinimalCommandClass<THostPlugin>[] = [];

    registerCommand(commandClass: MinimalCommandClass<THostPlugin>): void {
        if (commandClass.observes ?? false) {
            this.observerClasses.push(commandClass);
        } else {
            this.commandOnlyClasses.push(commandClass);
        }
    }

    matchAny(text: string): boolean {
        return this.commandOnlyClasses.find(command => command.match(text)) !== undefined ||
            this.observerClasses.find(command => command.match(text)) !== undefined;
    }

    walk(context: ExtensionContext<THostPlugin>, tree: Tree, from?: number, to?: number): void {
        // laid out with all observers first so they match the "observers" and "this.observerClasses" array offsets
        let classes: MinimalCommandClass<THostPlugin>[] = this.commandOnlyClasses;
        const numObservers = this.observerClasses.length;
        let observers: MinimalCommand<THostPlugin>[] | undefined = undefined;
        if (numObservers > 0) {
            classes = this.observerClasses.concat(classes);
            observers = this.observerClasses.map(commandClass => new commandClass());
        }

        tree.iterate({
            from,
            to,
            enter: (node: SyntaxNodeRef) => {
                // this is an extremely frequent check, so we don't even set up iteration if not needed
                if (observers !== undefined) {
                    for (let observer of observers) {
                        observer.observe!(node);
                    }
                }
                switch (node.type.name) {
                    case "inline-code":
                    case "inline-code_quote_quote-1":
                        const text = context.state.doc.sliceString(node.from, node.to);
                        if (text.match(REQUIRED_COMMAND_PREFIX) === null) {
                            return;
                        }
                        let index: number = -1;
                        for (let commandClass of classes) {
                            index++;
                            if (!commandClass.match(text)) {
                                // don't even construct commands that are not matched, to avoid churn
                                continue;
                            }
                            let command: MinimalCommand<THostPlugin>;
                            let match: RegExpMatchArray | null;
                            if (index < numObservers) {
                                // parser is also an observer, always allocated already
                                command = observers![index];
                                match = command.parse(text, node);

                                // need to install fresh instance for use as observer, since
                                // parse cannot be called twice on the same instance
                                observers![index] = new commandClass();
                            } else {
                                command = new commandClass();
                                match = command.parse(text, node);
                            }
                            if (match !== null) {
                                command.buildWidget(context);
                                // dispatched command, the rest of the handlers don't get called
                                break;
                            }
                            // XXX log parse failure, also log details in parse(...) function
                        }
                        break;
                }
            }
        });
    }
}
