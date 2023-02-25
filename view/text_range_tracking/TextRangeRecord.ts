import { TextRange } from ".";
import { createId, TextRangeDocumentServices } from "./internal";

/** 
 * This object represents a range of text in a document state.  Each changed CodeMirror state has its own copy of this object.
 * Versions of the same range through time (i.e. in various copies of the state) have the same id.  
 */
export class TextRangeRecord implements TextRange {
	id = 0;
	from: number;
	to: number;

	// if false, we have given up on updating this record
	valid = true;

	// if true, someone has interacted with this range in this state, so we don't cull it when changing state
	fresh = false;
	
	constructor(protected parent: TextRangeDocumentServices, range: TextRange, id?: number) {
		this.id = id ?? createId();
		this.from = range.from;
		this.to = range.to;
	}

	clone(): TextRangeRecord {
		const clone = new TextRangeRecord(this.parent, this, this.id);
		clone.valid = this.valid;
		return clone;
	}

	snapshot(): TextRange {
		this.fresh = true;
		return { from: this.from, to: this.to };
	}

	static compare(left: TextRange, right: TextRange): number {
		const to = left.to - right.to;
		if (to !== 0) {
			return to;
		}
		return left.from - right.from;
	}

	static compareEnd(left: TextRange, right: number): number {
		return left.to - right;
	}
}
