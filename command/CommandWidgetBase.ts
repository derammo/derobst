import { WidgetType } from "@codemirror/view";
import { MinimalPlugin } from "derobst/interfaces";
import { ParsedCommand } from "./ParsedCommandBase";

export abstract class CommandWidgetBase<THostPlugin extends MinimalPlugin> extends WidgetType {
	host: THostPlugin;
	command: ParsedCommand<THostPlugin>;

	constructor(host: THostPlugin, command: ParsedCommand<THostPlugin>) {
		super();
		this.host = host;
		this.command = command;
	}

	private debugEventsBrutally(control: HTMLElement) {
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
