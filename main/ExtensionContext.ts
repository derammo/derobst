import { EditorState, RangeSetBuilder } from "@codemirror/state";
import { Decoration } from "@codemirror/view";
import { MinimalPlugin, WidgetContext } from "../interfaces";

// services used during construction of decorations for extensions, including state fields and view plugins
export class ExtensionContext<THostPlugin extends MinimalPlugin> implements WidgetContext<THostPlugin> {
	builder: RangeSetBuilder<Decoration>;
	plugin: THostPlugin;
	state: EditorState;

	public constructor({ builder, plugin, state }: { builder: RangeSetBuilder<Decoration>, plugin: THostPlugin, state: EditorState}) {
		this.builder = builder;
		this.plugin = plugin;
		this.state = state;
	}
}
