export const REQUIRED_COMMAND_PREFIX = /^\s*!/;
export class CommandDispatcher {
    constructor() {
        this.observerClasses = [];
        this.commandOnlyClasses = [];
    }
    registerCommand(commandClass) {
        var _a;
        if ((_a = commandClass.observes) !== null && _a !== void 0 ? _a : false) {
            this.observerClasses.push(commandClass);
        }
        else {
            this.commandOnlyClasses.push(commandClass);
        }
    }
    matchAny(text) {
        return this.commandOnlyClasses.find(command => command.match(text)) !== undefined ||
            this.observerClasses.find(command => command.match(text)) !== undefined;
    }
    walk(context, tree, from, to) {
        // laid out with all observers first so they match the "observers" and "this.observerClasses" array offsets
        let classes = this.commandOnlyClasses;
        const numObservers = this.observerClasses.length;
        let observers = undefined;
        if (numObservers > 0) {
            classes = this.observerClasses.concat(classes);
            observers = this.observerClasses.map(commandClass => new commandClass());
        }
        tree.iterate({
            from,
            to,
            enter: (node) => {
                // this is an extremely frequent check, so we don't even set up iteration if not needed
                if (observers !== undefined) {
                    for (let observer of observers) {
                        observer.observe(node);
                    }
                }
                switch (node.type.name) {
                    case "inline-code":
                    case "inline-code_quote_quote-1":
                        const text = context.state.doc.sliceString(node.from, node.to);
                        if (text.match(REQUIRED_COMMAND_PREFIX) === null) {
                            return;
                        }
                        let index = -1;
                        for (let commandClass of classes) {
                            index++;
                            if (!commandClass.match(text)) {
                                // don't even construct commands that are not matched, to avoid churn
                                continue;
                            }
                            let command;
                            let match;
                            if (index < numObservers) {
                                // parser is also an observer, always allocated already
                                command = observers[index];
                                match = command.parse(text, node);
                                // need to install fresh instance for use as observer, since
                                // parse cannot be called twice on the same instance
                                observers[index] = new commandClass();
                            }
                            else {
                                command = new commandClass();
                                match = command.parse(text, node);
                            }
                            if (match !== null) {
                                command.buildWidget(context);
                                // dispatched command, the rest of the handlers don't get called
                                break;
                            }
                            // XXX log parse failure, also log details in parse(...) function
                        }
                        break;
                }
            }
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tbWFuZERpc3BhdGNoZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJDb21tYW5kRGlzcGF0Y2hlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFJQSxNQUFNLENBQUMsTUFBTSx1QkFBdUIsR0FBRyxPQUFPLENBQUM7QUFxQi9DLE1BQU0sT0FBTyxpQkFBaUI7SUFBOUI7UUFDWSxvQkFBZSxHQUF1QyxFQUFFLENBQUM7UUFDekQsdUJBQWtCLEdBQXVDLEVBQUUsQ0FBQztJQTJFeEUsQ0FBQztJQXpFRyxlQUFlLENBQUMsWUFBOEM7O1FBQzFELElBQUksTUFBQSxZQUFZLENBQUMsUUFBUSxtQ0FBSSxLQUFLLEVBQUU7WUFDaEMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7U0FDM0M7YUFBTTtZQUNILElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7U0FDOUM7SUFDTCxDQUFDO0lBRUQsUUFBUSxDQUFDLElBQVk7UUFDakIsT0FBTyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLFNBQVM7WUFDN0UsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssU0FBUyxDQUFDO0lBQ2hGLENBQUM7SUFFRCxJQUFJLENBQUMsT0FBc0MsRUFBRSxJQUFVLEVBQUUsSUFBYSxFQUFFLEVBQVc7UUFDL0UsMkdBQTJHO1FBQzNHLElBQUksT0FBTyxHQUF1QyxJQUFJLENBQUMsa0JBQWtCLENBQUM7UUFDMUUsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUM7UUFDakQsSUFBSSxTQUFTLEdBQThDLFNBQVMsQ0FBQztRQUNyRSxJQUFJLFlBQVksR0FBRyxDQUFDLEVBQUU7WUFDbEIsT0FBTyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQy9DLFNBQVMsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLElBQUksWUFBWSxFQUFFLENBQUMsQ0FBQztTQUM1RTtRQUVELElBQUksQ0FBQyxPQUFPLENBQUM7WUFDVCxJQUFJO1lBQ0osRUFBRTtZQUNGLEtBQUssRUFBRSxDQUFDLElBQW1CLEVBQUUsRUFBRTtnQkFDM0IsdUZBQXVGO2dCQUN2RixJQUFJLFNBQVMsS0FBSyxTQUFTLEVBQUU7b0JBQ3pCLEtBQUssSUFBSSxRQUFRLElBQUksU0FBUyxFQUFFO3dCQUM1QixRQUFRLENBQUMsT0FBUSxDQUFDLElBQUksQ0FBQyxDQUFDO3FCQUMzQjtpQkFDSjtnQkFDRCxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO29CQUNwQixLQUFLLGFBQWEsQ0FBQztvQkFDbkIsS0FBSywyQkFBMkI7d0JBQzVCLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFDL0QsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLHVCQUF1QixDQUFDLEtBQUssSUFBSSxFQUFFOzRCQUM5QyxPQUFPO3lCQUNWO3dCQUNELElBQUksS0FBSyxHQUFXLENBQUMsQ0FBQyxDQUFDO3dCQUN2QixLQUFLLElBQUksWUFBWSxJQUFJLE9BQU8sRUFBRTs0QkFDOUIsS0FBSyxFQUFFLENBQUM7NEJBQ1IsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0NBQzNCLHFFQUFxRTtnQ0FDckUsU0FBUzs2QkFDWjs0QkFDRCxJQUFJLE9BQW9DLENBQUM7NEJBQ3pDLElBQUksS0FBOEIsQ0FBQzs0QkFDbkMsSUFBSSxLQUFLLEdBQUcsWUFBWSxFQUFFO2dDQUN0Qix1REFBdUQ7Z0NBQ3ZELE9BQU8sR0FBRyxTQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7Z0NBQzVCLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztnQ0FFbEMsNERBQTREO2dDQUM1RCxvREFBb0Q7Z0NBQ3BELFNBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDOzZCQUMxQztpQ0FBTTtnQ0FDSCxPQUFPLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztnQ0FDN0IsS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDOzZCQUNyQzs0QkFDRCxJQUFJLEtBQUssS0FBSyxJQUFJLEVBQUU7Z0NBQ2hCLE9BQU8sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7Z0NBQzdCLGdFQUFnRTtnQ0FDaEUsTUFBTTs2QkFDVDs0QkFDRCxpRUFBaUU7eUJBQ3BFO3dCQUNELE1BQU07aUJBQ2I7WUFDTCxDQUFDO1NBQ0osQ0FBQyxDQUFDO0lBQ1AsQ0FBQztDQUNKIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTWluaW1hbFBsdWdpbiB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL01pbmltYWxQbHVnaW5cIjtcclxuaW1wb3J0IHsgRXh0ZW5zaW9uQ29udGV4dCB9IGZyb20gXCIuLi9tYWluXCI7XHJcbmltcG9ydCB7IFN5bnRheE5vZGVSZWYsIFRyZWUsIE5vZGVUeXBlIH0gZnJvbSAnQGxlemVyL2NvbW1vbic7XHJcblxyXG5leHBvcnQgY29uc3QgUkVRVUlSRURfQ09NTUFORF9QUkVGSVggPSAvXlxccyohLztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgTWluaW1hbENvbW1hbmQ8VEhvc3RQbHVnaW4gZXh0ZW5kcyBNaW5pbWFsUGx1Z2luPiB7XHJcbiAgICBwYXJzZSh0ZXh0OiBzdHJpbmcsIGNvbW1hbmROb2RlUmVmOiBTeW50YXhOb2RlUmVmKTogUmVnRXhwTWF0Y2hBcnJheSB8IG51bGw7XHJcblxyXG4gICAgYnVpbGRXaWRnZXQoY29udGV4dDogRXh0ZW5zaW9uQ29udGV4dDxUSG9zdFBsdWdpbj4pOiB2b2lkO1xyXG5cclxuICAgIG9ic2VydmU/KG5vZGU6IFN5bnRheE5vZGVSZWYpOiB2b2lkO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIE1pbmltYWxDb21tYW5kQ2xhc3M8VEhvc3RQbHVnaW4gZXh0ZW5kcyBNaW5pbWFsUGx1Z2luPiB7XHJcbiAgICBuZXcoKTogTWluaW1hbENvbW1hbmQ8VEhvc3RQbHVnaW4+O1xyXG5cclxuICAgIC8vIHN0YXRpY2FsbHkgY2hlY2sgaWYgY29tbWFuZCB0ZXh0IG1hdGNoZXMgdGhpcyBjb21tYW5kLCB0byBhdm9pZCBldmVuIGNvbnN0cnVjdGluZ1xyXG4gICAgLy8gYW4gaW5zdGFuY2Ugb2YgdGhpcyBjbGFzcyBpZiB0aGF0IGlzIG5vdCBuZWNlc3NhcnlcclxuICAgIG1hdGNoKHRleHQ6IHN0cmluZyk6IGJvb2xlYW47XHJcblxyXG4gICAgLy8gaWYgdHJ1ZSwgdGhpcyBjb21tYW5kIGlzIGFsd2F5cyBpbnN0YW50aWF0ZWQgYW5kIHJlY2VpdmVzIGFsbCB0b2tlbnMgaW4gdGhlIHN5bnRheCB0cmVlXHJcbiAgICBvYnNlcnZlcz86IGJvb2xlYW47XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDb21tYW5kRGlzcGF0Y2hlcjxUSG9zdFBsdWdpbiBleHRlbmRzIE1pbmltYWxQbHVnaW4+IHtcclxuICAgIHByaXZhdGUgb2JzZXJ2ZXJDbGFzc2VzOiBNaW5pbWFsQ29tbWFuZENsYXNzPFRIb3N0UGx1Z2luPltdID0gW107XHJcbiAgICBwcml2YXRlIGNvbW1hbmRPbmx5Q2xhc3NlczogTWluaW1hbENvbW1hbmRDbGFzczxUSG9zdFBsdWdpbj5bXSA9IFtdO1xyXG5cclxuICAgIHJlZ2lzdGVyQ29tbWFuZChjb21tYW5kQ2xhc3M6IE1pbmltYWxDb21tYW5kQ2xhc3M8VEhvc3RQbHVnaW4+KTogdm9pZCB7XHJcbiAgICAgICAgaWYgKGNvbW1hbmRDbGFzcy5vYnNlcnZlcyA/PyBmYWxzZSkge1xyXG4gICAgICAgICAgICB0aGlzLm9ic2VydmVyQ2xhc3Nlcy5wdXNoKGNvbW1hbmRDbGFzcyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jb21tYW5kT25seUNsYXNzZXMucHVzaChjb21tYW5kQ2xhc3MpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBtYXRjaEFueSh0ZXh0OiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb21tYW5kT25seUNsYXNzZXMuZmluZChjb21tYW5kID0+IGNvbW1hbmQubWF0Y2godGV4dCkpICE9PSB1bmRlZmluZWQgfHxcclxuICAgICAgICAgICAgdGhpcy5vYnNlcnZlckNsYXNzZXMuZmluZChjb21tYW5kID0+IGNvbW1hbmQubWF0Y2godGV4dCkpICE9PSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgd2Fsayhjb250ZXh0OiBFeHRlbnNpb25Db250ZXh0PFRIb3N0UGx1Z2luPiwgdHJlZTogVHJlZSwgZnJvbT86IG51bWJlciwgdG8/OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICAvLyBsYWlkIG91dCB3aXRoIGFsbCBvYnNlcnZlcnMgZmlyc3Qgc28gdGhleSBtYXRjaCB0aGUgXCJvYnNlcnZlcnNcIiBhbmQgXCJ0aGlzLm9ic2VydmVyQ2xhc3Nlc1wiIGFycmF5IG9mZnNldHNcclxuICAgICAgICBsZXQgY2xhc3NlczogTWluaW1hbENvbW1hbmRDbGFzczxUSG9zdFBsdWdpbj5bXSA9IHRoaXMuY29tbWFuZE9ubHlDbGFzc2VzO1xyXG4gICAgICAgIGNvbnN0IG51bU9ic2VydmVycyA9IHRoaXMub2JzZXJ2ZXJDbGFzc2VzLmxlbmd0aDtcclxuICAgICAgICBsZXQgb2JzZXJ2ZXJzOiBNaW5pbWFsQ29tbWFuZDxUSG9zdFBsdWdpbj5bXSB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcclxuICAgICAgICBpZiAobnVtT2JzZXJ2ZXJzID4gMCkge1xyXG4gICAgICAgICAgICBjbGFzc2VzID0gdGhpcy5vYnNlcnZlckNsYXNzZXMuY29uY2F0KGNsYXNzZXMpO1xyXG4gICAgICAgICAgICBvYnNlcnZlcnMgPSB0aGlzLm9ic2VydmVyQ2xhc3Nlcy5tYXAoY29tbWFuZENsYXNzID0+IG5ldyBjb21tYW5kQ2xhc3MoKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0cmVlLml0ZXJhdGUoe1xyXG4gICAgICAgICAgICBmcm9tLFxyXG4gICAgICAgICAgICB0byxcclxuICAgICAgICAgICAgZW50ZXI6IChub2RlOiBTeW50YXhOb2RlUmVmKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyB0aGlzIGlzIGFuIGV4dHJlbWVseSBmcmVxdWVudCBjaGVjaywgc28gd2UgZG9uJ3QgZXZlbiBzZXQgdXAgaXRlcmF0aW9uIGlmIG5vdCBuZWVkZWRcclxuICAgICAgICAgICAgICAgIGlmIChvYnNlcnZlcnMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IG9ic2VydmVyIG9mIG9ic2VydmVycykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYnNlcnZlci5vYnNlcnZlIShub2RlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKG5vZGUudHlwZS5uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImlubGluZS1jb2RlXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImlubGluZS1jb2RlX3F1b3RlX3F1b3RlLTFcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGV4dCA9IGNvbnRleHQuc3RhdGUuZG9jLnNsaWNlU3RyaW5nKG5vZGUuZnJvbSwgbm9kZS50byk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0ZXh0Lm1hdGNoKFJFUVVJUkVEX0NPTU1BTkRfUFJFRklYKSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpbmRleDogbnVtYmVyID0gLTE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGNvbW1hbmRDbGFzcyBvZiBjbGFzc2VzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCsrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFjb21tYW5kQ2xhc3MubWF0Y2godGV4dCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBkb24ndCBldmVuIGNvbnN0cnVjdCBjb21tYW5kcyB0aGF0IGFyZSBub3QgbWF0Y2hlZCwgdG8gYXZvaWQgY2h1cm5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjb21tYW5kOiBNaW5pbWFsQ29tbWFuZDxUSG9zdFBsdWdpbj47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbWF0Y2g6IFJlZ0V4cE1hdGNoQXJyYXkgfCBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4IDwgbnVtT2JzZXJ2ZXJzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcGFyc2VyIGlzIGFsc28gYW4gb2JzZXJ2ZXIsIGFsd2F5cyBhbGxvY2F0ZWQgYWxyZWFkeVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1hbmQgPSBvYnNlcnZlcnMhW2luZGV4XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRjaCA9IGNvbW1hbmQucGFyc2UodGV4dCwgbm9kZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5lZWQgdG8gaW5zdGFsbCBmcmVzaCBpbnN0YW5jZSBmb3IgdXNlIGFzIG9ic2VydmVyLCBzaW5jZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHBhcnNlIGNhbm5vdCBiZSBjYWxsZWQgdHdpY2Ugb24gdGhlIHNhbWUgaW5zdGFuY2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYnNlcnZlcnMhW2luZGV4XSA9IG5ldyBjb21tYW5kQ2xhc3MoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbWFuZCA9IG5ldyBjb21tYW5kQ2xhc3MoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRjaCA9IGNvbW1hbmQucGFyc2UodGV4dCwgbm9kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobWF0Y2ggIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tYW5kLmJ1aWxkV2lkZ2V0KGNvbnRleHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGRpc3BhdGNoZWQgY29tbWFuZCwgdGhlIHJlc3Qgb2YgdGhlIGhhbmRsZXJzIGRvbid0IGdldCBjYWxsZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFhYWCBsb2cgcGFyc2UgZmFpbHVyZSwgYWxzbyBsb2cgZGV0YWlscyBpbiBwYXJzZSguLi4pIGZ1bmN0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iXX0=