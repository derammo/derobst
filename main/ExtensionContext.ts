import { Decoration } from "@codemirror/view";
import { RangeSetBuilder, EditorState } from "@codemirror/state";
import { MinimalPlugin } from "../interfaces/MinimalPlugin";

// services used during construction of decorations for extensions, including state fields and view plugins
export class ExtensionContext<THostPlugin extends MinimalPlugin> {
	builder: RangeSetBuilder<Decoration>;
	plugin: THostPlugin;
	state: EditorState;

	public constructor({ builder, plugin, state }: { builder: RangeSetBuilder<Decoration>, plugin: THostPlugin, state: EditorState}) {
		this.builder = builder;
		this.plugin = plugin;
		this.state = state;
	}
}
