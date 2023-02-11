import { Decoration } from "@codemirror/view";
import { editorLivePreviewField } from "obsidian";
import { ExtensionContext } from "../main/ExtensionContext";
export class ViewPluginContext extends ExtensionContext {
}
// base for CodeMirror view plugins, which are children of the Obsidian plugin "THostPlugin" that get
// called to create or update decorations in source and live preview modes
export class ViewPluginBase {
    constructor(view) {
        this.decorations = Decoration.none;
        this.decorations = this.buildDecorations(view);
    }
    update(update) {
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
    checkForBypassInCurrentMode(update) {
        return !update.state.field(editorLivePreviewField);
    }
    destroy() { }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVmlld1BsdWdpbkJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJWaWV3UGx1Z2luQmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ04sVUFBVSxFQUdWLE1BQU0sa0JBQWtCLENBQUM7QUFFMUIsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQ2xELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBRzVELE1BQU0sT0FBTyxpQkFBcUQsU0FBUSxnQkFBNkI7Q0FFdEc7QUFFRCxxR0FBcUc7QUFDckcsMEVBQTBFO0FBQzFFLE1BQU0sT0FBZ0IsY0FBYztJQUduQyxZQUFZLElBQWdCO1FBRjVCLGdCQUFXLEdBQWtCLFVBQVUsQ0FBQyxJQUFJLENBQUM7UUFHNUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVELE1BQU0sQ0FBQyxNQUFrQjtRQUN4QixJQUFJLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUM3Qyw2REFBNkQ7WUFDN0QsSUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDO1lBQ25DLE9BQU87U0FDUDtRQUVELElBQUksTUFBTSxDQUFDLFVBQVUsSUFBSSxNQUFNLENBQUMsZUFBZSxJQUFJLElBQUksQ0FBQyxXQUFXLEtBQUssVUFBVSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsYUFBYSxFQUFFO1lBQzFILElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN0RCxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQztTQUN2QztJQUNGLENBQUM7SUFFRCwwR0FBMEc7SUFDaEcsMkJBQTJCLENBQUMsTUFBa0I7UUFDdkQsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLHNCQUFzQixDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUVELE9BQU8sS0FBSyxDQUFDO0NBS2IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG5cdERlY29yYXRpb24sXHJcblx0RGVjb3JhdGlvblNldCxcclxuXHRFZGl0b3JWaWV3LCBQbHVnaW5WYWx1ZSwgVmlld1VwZGF0ZVxyXG59IGZyb20gXCJAY29kZW1pcnJvci92aWV3XCI7XHJcblxyXG5pbXBvcnQgeyBlZGl0b3JMaXZlUHJldmlld0ZpZWxkIH0gZnJvbSBcIm9ic2lkaWFuXCI7XHJcbmltcG9ydCB7IEV4dGVuc2lvbkNvbnRleHQgfSBmcm9tIFwiLi4vbWFpbi9FeHRlbnNpb25Db250ZXh0XCI7XHJcbmltcG9ydCB7IE1pbmltYWxQbHVnaW4gfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9NaW5pbWFsUGx1Z2luXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVmlld1BsdWdpbkNvbnRleHQ8VEhvc3RQbHVnaW4gZXh0ZW5kcyBNaW5pbWFsUGx1Z2luPiBleHRlbmRzIEV4dGVuc2lvbkNvbnRleHQ8VEhvc3RQbHVnaW4+IHtcclxuXHQvLyBubyBhZGRpdGlvbmFsIGNvZGUgYXQgdGhpcyB0aW1lXHJcbn1cclxuXHJcbi8vIGJhc2UgZm9yIENvZGVNaXJyb3IgdmlldyBwbHVnaW5zLCB3aGljaCBhcmUgY2hpbGRyZW4gb2YgdGhlIE9ic2lkaWFuIHBsdWdpbiBcIlRIb3N0UGx1Z2luXCIgdGhhdCBnZXRcclxuLy8gY2FsbGVkIHRvIGNyZWF0ZSBvciB1cGRhdGUgZGVjb3JhdGlvbnMgaW4gc291cmNlIGFuZCBsaXZlIHByZXZpZXcgbW9kZXNcclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFZpZXdQbHVnaW5CYXNlPFRIb3N0UGx1Z2luIGV4dGVuZHMgTWluaW1hbFBsdWdpbj4gaW1wbGVtZW50cyBQbHVnaW5WYWx1ZSB7XHJcblx0ZGVjb3JhdGlvbnM6IERlY29yYXRpb25TZXQgPSBEZWNvcmF0aW9uLm5vbmU7XHJcblxyXG5cdGNvbnN0cnVjdG9yKHZpZXc6IEVkaXRvclZpZXcpIHtcclxuXHRcdHRoaXMuZGVjb3JhdGlvbnMgPSB0aGlzLmJ1aWxkRGVjb3JhdGlvbnModmlldyk7XHJcblx0fVxyXG5cclxuXHR1cGRhdGUodXBkYXRlOiBWaWV3VXBkYXRlKSB7XHJcblx0XHRpZiAodGhpcy5jaGVja0ZvckJ5cGFzc0luQ3VycmVudE1vZGUodXBkYXRlKSkge1xyXG5cdFx0XHQvLyBsaXZlIHByZXZpZXcgb25seSwgbm90IHJlbmRlcmVkIGluIHN0cmljdCBzb3VyY2UgY29kZSB2aWV3XHJcblx0XHRcdHRoaXMuZGVjb3JhdGlvbnMgPSBEZWNvcmF0aW9uLm5vbmU7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodXBkYXRlLmRvY0NoYW5nZWQgfHwgdXBkYXRlLnZpZXdwb3J0Q2hhbmdlZCB8fCB0aGlzLmRlY29yYXRpb25zID09PSBEZWNvcmF0aW9uLm5vbmUgfHwgdGhpcy5nZXRQbHVnaW4oKS5zZXR0aW5nc0RpcnR5KSB7XHJcblx0XHRcdHRoaXMuZGVjb3JhdGlvbnMgPSB0aGlzLmJ1aWxkRGVjb3JhdGlvbnModXBkYXRlLnZpZXcpO1xyXG5cdFx0XHR0aGlzLmdldFBsdWdpbigpLnNldHRpbmdzRGlydHkgPSBmYWxzZTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8vIG92ZXJyaWRlIHRoaXMgdG8gY29udHJvbCB3aGVuIHRoZSBkZWNvcmF0aW9ucyBhcmUgc2hvd24sIHRoZSBkZWZhdWx0IGlzIHRvIHNob3cgd2hlbiBub3QgaW4gc291cmNlIG1vZGVcclxuXHRwcm90ZWN0ZWQgY2hlY2tGb3JCeXBhc3NJbkN1cnJlbnRNb2RlKHVwZGF0ZTogVmlld1VwZGF0ZSkge1xyXG5cdFx0cmV0dXJuICF1cGRhdGUuc3RhdGUuZmllbGQoZWRpdG9yTGl2ZVByZXZpZXdGaWVsZCk7XHJcblx0fVxyXG5cclxuXHRkZXN0cm95KCkgeyB9XHJcblxyXG5cdGFic3RyYWN0IGdldFBsdWdpbigpOiBUSG9zdFBsdWdpbjtcclxuXHJcblx0YWJzdHJhY3QgYnVpbGREZWNvcmF0aW9ucyh2aWV3OiBFZGl0b3JWaWV3KTogRGVjb3JhdGlvblNldDtcclxufVxyXG4iXX0=