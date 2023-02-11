import {
	Decoration,
	DecorationSet,
	EditorView, PluginValue, ViewUpdate
} from "@codemirror/view";

import { editorLivePreviewField } from "obsidian";
import { ExtensionContext } from "../main/ExtensionContext";
import { MinimalPlugin } from "../interfaces/MinimalPlugin";

export class ViewPluginContext<THostPlugin extends MinimalPlugin> extends ExtensionContext<THostPlugin> {
	// no additional code at this time
}

// base for CodeMirror view plugins, which are children of the Obsidian plugin "THostPlugin" that get
// called to create or update decorations in source and live preview modes
export abstract class ViewPluginBase<THostPlugin extends MinimalPlugin> implements PluginValue {
	decorations: DecorationSet = Decoration.none;

	constructor(view: EditorView) {
		this.decorations = this.buildDecorations(view);
	}

	update(update: ViewUpdate) {
		if (this.checkForBypassInCurrentMode(update)) {
			// live preview only, not rendered in strict source code view
			this.decorations = Decoration.none;
			return;
		}

		if (update.docChanged || update.viewportChanged || this.decorations === Decoration.none || this.getPlugin().settingsDirty) {
			this.decorations = this.buildDecorations(update.view);
			this.getPlugin().settingsDirty = false;
		}
	}

	// override this to control when the decorations are shown, the default is to show when not in source mode
	protected checkForBypassInCurrentMode(update: ViewUpdate) {
		return !update.state.field(editorLivePreviewField);
	}

	destroy() { }

	abstract getPlugin(): THostPlugin;

	abstract buildDecorations(view: EditorView): DecorationSet;
}
