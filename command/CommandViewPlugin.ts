import { syntaxTree } from "@codemirror/language";
import { RangeSetBuilder } from "@codemirror/state";
import {
	Decoration,
	DecorationSet,
	EditorView
} from "@codemirror/view";

import { MinimalCommandHost } from "../interfaces/MinimalCommandHost";
import { ViewPluginBase } from "../view/ViewPluginBase";
import { ExtensionContext } from "../main/ExtensionContext";

// CodeMirror ViewPlugin to replace recognized commands with UI elements in Edit view
export abstract class CommandViewPlugin<THostPlugin extends MinimalCommandHost<THostPlugin>> extends ViewPluginBase<THostPlugin> {
	abstract getPlugin(): THostPlugin;
	
	buildDecorations(view: EditorView): DecorationSet {
		// stash these for closure
		const host = this.getPlugin();
		const context = new ExtensionContext<THostPlugin>({ 
			builder: new RangeSetBuilder<Decoration>(), 
			plugin: host,
			state: view.state
		});

		const syntax = syntaxTree(view.state);
		for (let { from, to } of view.visibleRanges) {
			host.commands.walk(context, syntax, from, to);
		}
		return context.builder.finish();
	}
}


