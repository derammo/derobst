import { EditorState } from "@codemirror/state";
import { TextRange, TextRangeRegistration, UpdatedTextRange } from ".";
import { DocumentRecord } from "./DocumentRecord";
import { TextRangeUpdaterServices } from "./internal";

/**
 * Soft reference to a text range.
 */
export class Registration implements UpdatedTextRange {
	readonly id: TextRangeRegistration;

	constructor(protected parent: TextRangeUpdaterServices, document: DocumentRecord, rangeId: number) {
		this.id = { document: document.id, range: rangeId };
	}

	public fetchRange(state: EditorState): TextRange | null {
		const document = this.parent.getDocumentRecord(state);
		if (document.id !== this.id.document) {
			return null;
		}
		return document.fetchRange(this.id.range);
	}

	public fetchCurrentRange(): TextRange | null {
		const document = this.parent.fetchCurrentDocumentRecord(this.id.document);
		if (document === null) {
			// this can happen as the document may not exist
			return null;
		}
		return document.fetchRange(this.id.range);
	}
}
