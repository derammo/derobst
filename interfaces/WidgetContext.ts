import { EditorState } from "@codemirror/state";
import { MinimalPlugin } from "./MinimalPlugin";


export interface WidgetContext<THostPlugin extends MinimalPlugin> {
	plugin: THostPlugin;
	state: EditorState;
}
