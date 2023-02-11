import { __awaiter } from "tslib";
import { ParsedCommand } from './ParsedCommandBase';
export class ParsedCommandWithParameters extends ParsedCommand {
    constructor() {
        super(...arguments);
        this.parameters = {};
    }
    handleUsed(view) {
        const _super = Object.create(null, {
            handleUsed: { get: () => super.handleUsed }
        });
        return __awaiter(this, void 0, void 0, function* () {
            _super.handleUsed.call(this, view);
            if (this.parameters.remove && this.commandNode !== undefined) {
                view.dispatch({
                    changes: { from: this.commandNode.from - 1, to: this.commandNode.to + 1 }
                });
            }
        });
    }
    parse(text, commandNodeRef) {
        const match = super.parse(text, commandNodeRef);
        if (match === null) {
            return match;
        }
        if (match[1] !== undefined) {
            match[1].split(/\s+/).forEach((setting) => {
                const equals = setting.indexOf("=");
                if (equals == 0) {
                    // discard any work we did
                    // XXX log parse error
                    this.parameters = {};
                    return null;
                }
                if (equals > 0) {
                    this.parameters[setting.slice(0, equals)] = setting.slice(equals + 1);
                }
                else {
                    this.parameters[setting] = true;
                }
            });
        }
        return match;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFyc2VkQ29tbWFuZFdpdGhQYXJhbWV0ZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiUGFyc2VkQ29tbWFuZFdpdGhQYXJhbWV0ZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFHQSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFFcEQsTUFBTSxPQUFnQiwyQkFBK0QsU0FBUSxhQUEwQjtJQUF2SDs7UUFDSSxlQUFVLEdBQXlDLEVBQUUsQ0FBQztJQWtDMUQsQ0FBQztJQWhDUyxVQUFVLENBQUMsSUFBZ0I7Ozs7O1lBQzdCLE9BQU0sVUFBVSxZQUFDLElBQUksRUFBRTtZQUN2QixJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxXQUFXLEtBQUssU0FBUyxFQUFFO2dCQUMxRCxJQUFJLENBQUMsUUFBUSxDQUFDO29CQUNWLE9BQU8sRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRTtpQkFDNUUsQ0FBQyxDQUFDO2FBQ047UUFDTCxDQUFDO0tBQUE7SUFFRCxLQUFLLENBQUMsSUFBWSxFQUFFLGNBQTZCO1FBQzdDLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBQ2hELElBQUksS0FBSyxLQUFLLElBQUksRUFBRTtZQUNoQixPQUFPLEtBQUssQ0FBQztTQUNoQjtRQUNELElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLFNBQVMsRUFBRTtZQUN4QixLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQWUsRUFBRSxFQUFFO2dCQUM5QyxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNwQyxJQUFJLE1BQU0sSUFBSSxDQUFDLEVBQUU7b0JBQ2IsMEJBQTBCO29CQUMxQixzQkFBc0I7b0JBQ3RCLElBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO29CQUNyQixPQUFPLElBQUksQ0FBQztpQkFDZjtnQkFDRCxJQUFJLE1BQU0sR0FBRyxDQUFDLEVBQUU7b0JBQ1osSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO2lCQUN6RTtxQkFBTTtvQkFDSCxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQztpQkFDbkM7WUFDTCxDQUFDLENBQUMsQ0FBQztTQUNOO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztDQUNKIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRWRpdG9yVmlldyB9IGZyb20gJ0Bjb2RlbWlycm9yL3ZpZXcnO1xyXG5pbXBvcnQgeyBTeW50YXhOb2RlUmVmIH0gZnJvbSAnQGxlemVyL2NvbW1vbi9kaXN0L3RyZWUnO1xyXG5pbXBvcnQgeyBNaW5pbWFsUGx1Z2luIH0gZnJvbSAnZGVyb2JzdC9pbnRlcmZhY2VzJztcclxuaW1wb3J0IHsgUGFyc2VkQ29tbWFuZCB9IGZyb20gJy4vUGFyc2VkQ29tbWFuZEJhc2UnO1xyXG5cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFBhcnNlZENvbW1hbmRXaXRoUGFyYW1ldGVyczxUSG9zdFBsdWdpbiBleHRlbmRzIE1pbmltYWxQbHVnaW4+IGV4dGVuZHMgUGFyc2VkQ29tbWFuZDxUSG9zdFBsdWdpbj4ge1xyXG4gICAgcGFyYW1ldGVyczogeyBba2V5OiBzdHJpbmddOiBib29sZWFuIHwgc3RyaW5nOyB9ID0ge307XHJcblxyXG4gICAgYXN5bmMgaGFuZGxlVXNlZCh2aWV3OiBFZGl0b3JWaWV3KSB7XHJcbiAgICAgICAgc3VwZXIuaGFuZGxlVXNlZCh2aWV3KTtcclxuICAgICAgICBpZiAodGhpcy5wYXJhbWV0ZXJzLnJlbW92ZSAmJiB0aGlzLmNvbW1hbmROb2RlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdmlldy5kaXNwYXRjaCh7XHJcbiAgICAgICAgICAgICAgICBjaGFuZ2VzOiB7IGZyb206IHRoaXMuY29tbWFuZE5vZGUuZnJvbSAtIDEsIHRvOiB0aGlzLmNvbW1hbmROb2RlLnRvICsgMSB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwYXJzZSh0ZXh0OiBzdHJpbmcsIGNvbW1hbmROb2RlUmVmOiBTeW50YXhOb2RlUmVmKTogUmVnRXhwTWF0Y2hBcnJheSB8IG51bGwge1xyXG4gICAgICAgIGNvbnN0IG1hdGNoID0gc3VwZXIucGFyc2UodGV4dCwgY29tbWFuZE5vZGVSZWYpO1xyXG4gICAgICAgIGlmIChtYXRjaCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbWF0Y2g7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChtYXRjaFsxXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIG1hdGNoWzFdLnNwbGl0KC9cXHMrLykuZm9yRWFjaCgoc2V0dGluZzogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBlcXVhbHMgPSBzZXR0aW5nLmluZGV4T2YoXCI9XCIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGVxdWFscyA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZGlzY2FyZCBhbnkgd29yayB3ZSBkaWRcclxuICAgICAgICAgICAgICAgICAgICAvLyBYWFggbG9nIHBhcnNlIGVycm9yXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJhbWV0ZXJzID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoZXF1YWxzID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFyYW1ldGVyc1tzZXR0aW5nLnNsaWNlKDAsIGVxdWFscyldID0gc2V0dGluZy5zbGljZShlcXVhbHMgKyAxKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJhbWV0ZXJzW3NldHRpbmddID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBtYXRjaDtcclxuICAgIH1cclxufVxyXG4iXX0=