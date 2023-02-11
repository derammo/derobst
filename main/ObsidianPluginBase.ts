import { EditorView, ViewPlugin } from "@codemirror/view";
import { Plugin } from 'obsidian';

import { MinimalPlugin } from "../interfaces";
import { ViewPluginBase } from "../view";

export abstract class ObsidianPluginBase extends Plugin implements MinimalPlugin {
	settingsDirty: boolean;

	registerViewPlugin<THostPlugin extends MinimalPlugin, TViewPlugin extends ViewPluginBase<THostPlugin>>(viewPluginClass: { new(view: EditorView): TViewPlugin; }) {
		this.registerEditorExtension(ViewPlugin.fromClass(viewPluginClass, { decorations: (value: TViewPlugin) => value.decorations }));
	}
}
