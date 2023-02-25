import { EditorState, Text } from "@codemirror/state";
import { TextRange, TextRangeRegistration } from ".";

/**
 * Internal interface used by DocumentRecord's children {@link TextRangeRecord}
 */
export interface TextRangeDocumentServices {
	readonly id: number;
	addChange(fromA: number, toA: number, fromB: number, toB: number, inserted: Text): void;
	fetchRange(rangeId: number): TextRange | null;
}

/**
 * Internal interface used by TextRangeUpdater's children {@link DocumentRecord}
 */
export interface TextRangeUpdaterServices {
	getDocumentRecord(state: EditorState): TextRangeDocumentServices;
	fetchCurrentDocumentRecord(documentId: number): TextRangeDocumentServices | null;
}

export interface TextRangeObserver {
	validateAddition(range: TextRange): void;
	validateRemoval(range: TextRange): void;
	validateFound(range: TextRange, index: number): void;
	validateDocumentCreation(id: number): void;
	validateRegistration(existing: IterableIterator<number>, registration: TextRangeRegistration): void;
	validateDeregistration(existing: IterableIterator<number>, registration: TextRangeRegistration): void;
	validateNotFound(existing: IterableIterator<number>, registration: TextRangeRegistration): void;
}

let nextId = 1;

export function createId() {
	return nextId++;
}