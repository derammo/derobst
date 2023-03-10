import { EditorView, ViewPlugin } from "@codemirror/view";
import { Plugin } from 'obsidian';
import { ContextMenuActions, MinimalPlugin } from "../interfaces";
import { createTextRangeUpdater, TextRangeTracking, ViewPluginBase } from "../view";
import { ContextMenuActionsTarget } from "./ContextMenuActionsTarget";

export abstract class ObsidianPluginBase<TSettings> extends Plugin implements MinimalPlugin {
	// This is only ever accessed after onLoad(), so that our settings are always valid.
	settings!: TSettings;
	settingsDirty = false;
	
	readonly tracking: TextRangeTracking = createTextRangeUpdater();

	protected contextTarget: ContextMenuActionsTarget = new ContextMenuActionsTarget();

	async loadSettings(defaultSettings: TSettings) {
		this.settings = Object.assign({}, defaultSettings, await this.loadData());
	}

	async saveSettings() {
		this.settingsDirty = true;
		await this.saveData(this.settings);
		this.app.workspace.updateOptions();
	}	

	registerViewPlugin<THostPlugin extends MinimalPlugin, TViewPlugin extends ViewPluginBase<THostPlugin>>(viewPluginClass: { new(view: EditorView): TViewPlugin; }) {
		this.registerEditorExtension(ViewPlugin.fromClass(viewPluginClass, { decorations: (value: TViewPlugin) => value.decorations }));
	}

	registerDomContextMenuTarget(element: HTMLElement, command: ContextMenuActions) {
		this.registerDomEvent(element, "contextmenu", async (_event) => {
			// we receive this event before Obsidian pops its context menu, so we can stash a reference to our component,
			// to be used in the context menu
			// we don't use the event timestamp because those are relative to the creation of a particular window
			this.contextTarget.set(command, Date.now())
		});
	}

    setContextTarget(target: ContextMenuActions): void {
		this.contextTarget.set(target, Date.now());
	}

	/**
	 * register a state field that tracks current positions of registered text ranges
	 */
	protected registerTextRangeTracker() {
		this.registerEditorExtension(this.tracking.createExtensions());
	}

	/**
	 * register a context menu action to delete embedded content or commands by right-clicking on their UI elements
	 */
	protected registerContextMenuDeleteElement() {
		this.registerEvent(
			this.app.workspace.on("editor-menu", (menu, editor, _view) => {
				const target = this.contextTarget.get();
				if (target === undefined) {
					return;
				}
				if (!target.canDelete) {
					return;
				}
				menu.addItem((item) => { item
					.setTitle("Delete UI Element")
					.setIcon("trash")
					.onClick(async () => {
						target.delete(editor);
					});
				})
			})
		);
	}
}
