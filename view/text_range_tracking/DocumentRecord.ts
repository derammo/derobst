import { Text } from "@codemirror/state";
import { TextRange } from ".";
import { binarySearch, binarySearchLeft } from "../../main/BinarySearch";
import { createId, TextRangeDocumentServices, TextRangeObserver } from "./internal";
import { TextRangeRecord } from "./TextRangeRecord";

/**
 * State field that contains the current offsets for all registered ranges.  As the document gets changed, this
 * state field is cloned into a new readonly copy. Cleanup is provided by CodeMirror eventually deallocating all 
 * the state fields.
 */
export class DocumentRecord implements TextRangeDocumentServices {
	readonly id: number;

	// ranges by end point
	protected ranges: TextRangeRecord[] = [];

	constructor(id?: number) {
		this.id = id ?? createId();
	}

	clone(): DocumentRecord {
		const clone = new DocumentRecord(this.id);

		// duplicate this data, since this is our state
		// avoid a bunch of callbacks by just doing this in a loop instead of filter+map
		clone.ranges = [];
		for (const range of this.ranges) {
			if (range.fresh) {
				clone.ranges.push(range.clone());
			}
		}

		return clone;
	}

	public register(range: TextRange, observer?: TextRangeObserver): TextRangeRecord {
		const { index, found } = binarySearch(this.ranges, range, TextRangeRecord.compare);
		let record: TextRangeRecord;
		if (found) {
			record = this.ranges[index];
			observer?.validateFound(record, index);
		} else {
			record = new TextRangeRecord(this, range);
			observer?.validateAddition(record);
			this.ranges.splice(index, 0, record);
		}
		record.fresh = true;
		observer?.validateRegistration([].keys(), { document: this.id, range: record.id });
		return record;
	}

	public fetchRange(rangeId: number): TextRange | null {
		// NOTE: not optimized, no index as we don't use a registration ID (any more)
		const record = this.ranges.find((record) => record.id === rangeId);
		if (record === undefined) {
			return null;
		}
		return record.snapshot();
	}

	public addChange(fromA: number, toA: number, fromB: number, toB: number, _inserted: Text): void {
		let index = binarySearchLeft(this.ranges, fromA, TextRangeRecord.compareEnd);

		// first record to check is the one after all the ones we can skip because their end points are before the change
		// also covers return value of -1 indicating nothing to skip
		++index;

		for (; index < this.ranges.length; ++index) {
			const range = this.ranges[index];
			if (!range.valid) {
				// we have given up on this range
				continue;
			}
			if (range.to <= fromA) {
				// no overlap, change is "to the right"
				continue;
			}
			if (range.from >= toA) {
				// change is to the left, slide range
				const net = toB - fromB - (toA - fromA);
				range.from += net;
				range.to += net;
			} else {
				if (range.from <= fromA) {
					if (range.to >= toA) {
						// extend on the right
						range.to += toB - fromB - (toA - fromA);
					} else {
						// overlap on the right
						range.valid = false;
						continue;
					}
				} else {
					// overlap on the left or range is entirely contained in change
					range.valid = false;
					continue;
				}
			}
		}
		// NOTE: everything is still in order because we only moved end point of the the first affected range and then shifted everything after it
	}
}
