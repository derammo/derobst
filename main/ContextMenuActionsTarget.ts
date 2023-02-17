import { ContextMenuActions } from "derobst/interfaces/ContextMenuActions";


export class ContextMenuActionsTarget {
	private target: ContextMenuActions | undefined = undefined;
	private timeStampMilliseconds = 0;

	set(target: ContextMenuActions, timeStampMilliseconds: number): void {
		this.target = target;
		this.timeStampMilliseconds = timeStampMilliseconds;
	}

	get(): ContextMenuActions | undefined {
		if (this.target === undefined) {
			return undefined;
		}
		const now = Date.now();
		if (this.timeStampMilliseconds < now - 500) {
			return undefined;
		}
		return this.target;
	}

}
