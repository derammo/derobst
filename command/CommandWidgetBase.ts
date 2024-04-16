import { WidgetType } from "@codemirror/view";
import { TextRange } from "derobst/view";
import { MinimalCommandHost, WidgetContext } from "../interfaces";
import { ParsedCommand } from "./ParsedCommandBase";

export abstract class CommandWidgetBase<THostPlugin extends MinimalCommandHost<THostPlugin>> extends WidgetType {
	readonly host: THostPlugin;
	readonly command: ParsedCommand<THostPlugin>;

	constructor(context: WidgetContext<THostPlugin>, command: ParsedCommand<THostPlugin>) {
		super();
		this.host = context.plugin;
		this.command = command;
	}

	/**
	 * REVISIT: at least for some classes, this could return the end of the editor if the connection has been lost, so output is not lost?
	 * @returns an array containing the updated range containing the command text including all document edits, or an empty array
	 */
	public fetchCurrentRanges(): TextRange[] {
		const range = this.command.commandRange?.fetchCurrentRange();
		if (range === null) {
			return [];
		}
		if (range === undefined) {
			return [];
		}
		return [range];
	}

	private debugEventsBrutally(control: HTMLElement) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		Object.keys((control as any).__proto__.__proto__).forEach((key: string) => {
			if (key.startsWith("on")) {
				control.addEventListener(key.slice(2), this.debugEventLogger);
			}
		});
	}

	private debugEventLogger(event: Event) {
		if (event.type.startsWith('mousemove')) {
			return;
		}
		if (event.type.startsWith('pointerraw')) {
			return;
		}
		if (event.type.startsWith('pointermove')) {
			return;
		}
		console.log(`EVENT ${event.type}`);
	}
}
