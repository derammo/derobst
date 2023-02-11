import { MarkdownPostProcessor, MarkdownPostProcessorContext, MarkdownRenderChild } from "obsidian";
import { MinimalPlugin } from "../interfaces/MinimalPlugin";
import { CommandDispatcher } from "./CommandDispatcher";

export function createCommandRemovalPostProcessor<THostPlugin extends MinimalPlugin>(commands: CommandDispatcher<THostPlugin>): MarkdownPostProcessor {
    return (element: HTMLElement, context: MarkdownPostProcessorContext): Promise<any> | void => {
        const codeblocks = element.querySelectorAll("code");

        for (let index = 0; index < codeblocks.length; index++) {
            const codeblock = codeblocks.item(index);
            const text = codeblock.innerText.trim();
            if (commands.matchAny(text)) {
                context.addChild(new RemoveMarkdownRenderer(codeblock));
            }
        }
    }
}

export class RemoveMarkdownRenderer extends MarkdownRenderChild {
    constructor(container: HTMLElement) {
        super(container);
    }

    onload() {
        this.containerEl.remove();
    }
}
