import { EditorView, ViewPlugin } from "@codemirror/view";
import { Plugin } from 'obsidian';

import { MinimalPlugin } from "../interfaces";
import { ViewPluginBase } from "../view";

export abstract class ObsidianPluginBase<TSettings> extends Plugin implements MinimalPlugin {
	settingsDirty: boolean;
	settings: TSettings;

	async saveSettings() {
		this.settingsDirty = true;
		await this.saveData(this.settings);
		this.app.workspace.updateOptions();
	}	

	registerViewPlugin<THostPlugin extends MinimalPlugin, TViewPlugin extends ViewPluginBase<THostPlugin>>(viewPluginClass: { new(view: EditorView): TViewPlugin; }) {
		this.registerEditorExtension(ViewPlugin.fromClass(viewPluginClass, { decorations: (value: TViewPlugin) => value.decorations }));
	}
}
