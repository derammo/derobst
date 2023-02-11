import { syntaxTree } from "@codemirror/language";
import { RangeSetBuilder } from "@codemirror/state";
import { ViewPluginBase } from "../view/ViewPluginBase";
import { ExtensionContext } from "../main/ExtensionContext";
// CodeMirror ViewPlugin to replace recognized commands with UI elements in Edit view
export class CommandViewPlugin extends ViewPluginBase {
    buildDecorations(view) {
        // stash these for closure
        const host = this.getPlugin();
        const context = new ExtensionContext({
            builder: new RangeSetBuilder(),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tbWFuZFZpZXdQbHVnaW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJDb21tYW5kVmlld1BsdWdpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDbEQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBUXBELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUN4RCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUU1RCxxRkFBcUY7QUFDckYsTUFBTSxPQUFnQixpQkFBdUUsU0FBUSxjQUEyQjtJQUcvSCxnQkFBZ0IsQ0FBQyxJQUFnQjtRQUNoQywwQkFBMEI7UUFDMUIsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQzlCLE1BQU0sT0FBTyxHQUFHLElBQUksZ0JBQWdCLENBQWM7WUFDakQsT0FBTyxFQUFFLElBQUksZUFBZSxFQUFjO1lBQzFDLE1BQU0sRUFBRSxJQUFJO1lBQ1osS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO1NBQ2pCLENBQUMsQ0FBQztRQUVILE1BQU0sTUFBTSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdEMsS0FBSyxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDNUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7U0FDOUM7UUFDRCxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDakMsQ0FBQztDQUNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgc3ludGF4VHJlZSB9IGZyb20gXCJAY29kZW1pcnJvci9sYW5ndWFnZVwiO1xyXG5pbXBvcnQgeyBSYW5nZVNldEJ1aWxkZXIgfSBmcm9tIFwiQGNvZGVtaXJyb3Ivc3RhdGVcIjtcclxuaW1wb3J0IHtcclxuXHREZWNvcmF0aW9uLFxyXG5cdERlY29yYXRpb25TZXQsXHJcblx0RWRpdG9yVmlld1xyXG59IGZyb20gXCJAY29kZW1pcnJvci92aWV3XCI7XHJcblxyXG5pbXBvcnQgeyBNaW5pbWFsQ29tbWFuZEhvc3QgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9NaW5pbWFsQ29tbWFuZEhvc3RcIjtcclxuaW1wb3J0IHsgVmlld1BsdWdpbkJhc2UgfSBmcm9tIFwiLi4vdmlldy9WaWV3UGx1Z2luQmFzZVwiO1xyXG5pbXBvcnQgeyBFeHRlbnNpb25Db250ZXh0IH0gZnJvbSBcIi4uL21haW4vRXh0ZW5zaW9uQ29udGV4dFwiO1xyXG5cclxuLy8gQ29kZU1pcnJvciBWaWV3UGx1Z2luIHRvIHJlcGxhY2UgcmVjb2duaXplZCBjb21tYW5kcyB3aXRoIFVJIGVsZW1lbnRzIGluIEVkaXQgdmlld1xyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQ29tbWFuZFZpZXdQbHVnaW48VEhvc3RQbHVnaW4gZXh0ZW5kcyBNaW5pbWFsQ29tbWFuZEhvc3Q8VEhvc3RQbHVnaW4+PiBleHRlbmRzIFZpZXdQbHVnaW5CYXNlPFRIb3N0UGx1Z2luPiB7XHJcblx0YWJzdHJhY3QgZ2V0UGx1Z2luKCk6IFRIb3N0UGx1Z2luO1xyXG5cdFxyXG5cdGJ1aWxkRGVjb3JhdGlvbnModmlldzogRWRpdG9yVmlldyk6IERlY29yYXRpb25TZXQge1xyXG5cdFx0Ly8gc3Rhc2ggdGhlc2UgZm9yIGNsb3N1cmVcclxuXHRcdGNvbnN0IGhvc3QgPSB0aGlzLmdldFBsdWdpbigpO1xyXG5cdFx0Y29uc3QgY29udGV4dCA9IG5ldyBFeHRlbnNpb25Db250ZXh0PFRIb3N0UGx1Z2luPih7IFxyXG5cdFx0XHRidWlsZGVyOiBuZXcgUmFuZ2VTZXRCdWlsZGVyPERlY29yYXRpb24+KCksIFxyXG5cdFx0XHRwbHVnaW46IGhvc3QsXHJcblx0XHRcdHN0YXRlOiB2aWV3LnN0YXRlXHJcblx0XHR9KTtcclxuXHJcblx0XHRjb25zdCBzeW50YXggPSBzeW50YXhUcmVlKHZpZXcuc3RhdGUpO1xyXG5cdFx0Zm9yIChsZXQgeyBmcm9tLCB0byB9IG9mIHZpZXcudmlzaWJsZVJhbmdlcykge1xyXG5cdFx0XHRob3N0LmNvbW1hbmRzLndhbGsoY29udGV4dCwgc3ludGF4LCBmcm9tLCB0byk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gY29udGV4dC5idWlsZGVyLmZpbmlzaCgpO1xyXG5cdH1cclxufVxyXG5cclxuXHJcbiJdfQ==