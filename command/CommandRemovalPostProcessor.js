import { MarkdownRenderChild } from "obsidian";
export function createCommandRemovalPostProcessor(commands) {
    return (element, context) => {
        const codeblocks = element.querySelectorAll("code");
        for (let index = 0; index < codeblocks.length; index++) {
            const codeblock = codeblocks.item(index);
            const text = codeblock.innerText.trim();
            if (commands.matchAny(text)) {
                context.addChild(new RemoveMarkdownRenderer(codeblock));
            }
        }
    };
}
export class RemoveMarkdownRenderer extends MarkdownRenderChild {
    constructor(container) {
        super(container);
    }
    onload() {
        this.containerEl.remove();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tbWFuZFJlbW92YWxQb3N0UHJvY2Vzc29yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiQ29tbWFuZFJlbW92YWxQb3N0UHJvY2Vzc29yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBdUQsbUJBQW1CLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFJcEcsTUFBTSxVQUFVLGlDQUFpQyxDQUFvQyxRQUF3QztJQUN6SCxPQUFPLENBQUMsT0FBb0IsRUFBRSxPQUFxQyxFQUF1QixFQUFFO1FBQ3hGLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVwRCxLQUFLLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRTtZQUNwRCxNQUFNLFNBQVMsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3pDLE1BQU0sSUFBSSxHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDeEMsSUFBSSxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUN6QixPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksc0JBQXNCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQzthQUMzRDtTQUNKO0lBQ0wsQ0FBQyxDQUFBO0FBQ0wsQ0FBQztBQUVELE1BQU0sT0FBTyxzQkFBdUIsU0FBUSxtQkFBbUI7SUFDM0QsWUFBWSxTQUFzQjtRQUM5QixLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDckIsQ0FBQztJQUVELE1BQU07UUFDRixJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQzlCLENBQUM7Q0FDSiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1hcmtkb3duUG9zdFByb2Nlc3NvciwgTWFya2Rvd25Qb3N0UHJvY2Vzc29yQ29udGV4dCwgTWFya2Rvd25SZW5kZXJDaGlsZCB9IGZyb20gXCJvYnNpZGlhblwiO1xyXG5pbXBvcnQgeyBNaW5pbWFsUGx1Z2luIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvTWluaW1hbFBsdWdpblwiO1xyXG5pbXBvcnQgeyBDb21tYW5kRGlzcGF0Y2hlciB9IGZyb20gXCIuL0NvbW1hbmREaXNwYXRjaGVyXCI7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQ29tbWFuZFJlbW92YWxQb3N0UHJvY2Vzc29yPFRIb3N0UGx1Z2luIGV4dGVuZHMgTWluaW1hbFBsdWdpbj4oY29tbWFuZHM6IENvbW1hbmREaXNwYXRjaGVyPFRIb3N0UGx1Z2luPik6IE1hcmtkb3duUG9zdFByb2Nlc3NvciB7XHJcbiAgICByZXR1cm4gKGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBjb250ZXh0OiBNYXJrZG93blBvc3RQcm9jZXNzb3JDb250ZXh0KTogUHJvbWlzZTxhbnk+IHwgdm9pZCA9PiB7XHJcbiAgICAgICAgY29uc3QgY29kZWJsb2NrcyA9IGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChcImNvZGVcIik7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBjb2RlYmxvY2tzLmxlbmd0aDsgaW5kZXgrKykge1xyXG4gICAgICAgICAgICBjb25zdCBjb2RlYmxvY2sgPSBjb2RlYmxvY2tzLml0ZW0oaW5kZXgpO1xyXG4gICAgICAgICAgICBjb25zdCB0ZXh0ID0gY29kZWJsb2NrLmlubmVyVGV4dC50cmltKCk7XHJcbiAgICAgICAgICAgIGlmIChjb21tYW5kcy5tYXRjaEFueSh0ZXh0KSkge1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5hZGRDaGlsZChuZXcgUmVtb3ZlTWFya2Rvd25SZW5kZXJlcihjb2RlYmxvY2spKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFJlbW92ZU1hcmtkb3duUmVuZGVyZXIgZXh0ZW5kcyBNYXJrZG93blJlbmRlckNoaWxkIHtcclxuICAgIGNvbnN0cnVjdG9yKGNvbnRhaW5lcjogSFRNTEVsZW1lbnQpIHtcclxuICAgICAgICBzdXBlcihjb250YWluZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIG9ubG9hZCgpIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lckVsLnJlbW92ZSgpO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==