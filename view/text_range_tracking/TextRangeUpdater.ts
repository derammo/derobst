import { EditorState, Extension, StateField, Transaction } from "@codemirror/state";
import { TextRange, TextRangeRegistration, TextRangeTracking, UpdatedTextRange } from ".";
import { DocumentRecord } from "./DocumentRecord";
import { TextRangeObserver, TextRangeUpdaterServices } from "./internal";
import { Registration } from "./Registration";

class TextRangeUpdater implements TextRangeUpdaterServices, TextRangeTracking {
	observer?: TextRangeObserver;

	protected documentStateField: StateField<DocumentRecord> = this.createDocumentStateField();
	protected documents: Map<number, DocumentRecord> = new Map();

	private createState(_state: EditorState): DocumentRecord {
		const document = new DocumentRecord();
		this.documents.set(document.id, document);
		this.observer?.validateDocumentCreation(document.id);
		return document;
	}

	private updateState(oldState: DocumentRecord, transaction: Transaction): DocumentRecord {
		if (!transaction.docChanged) {
			return oldState;
		}				
		const newState = oldState.clone();
		transaction.changes.iterChanges(newState.addChange.bind(newState));
		this.documents.set(newState.id, newState);
		return newState;
	}

	private createDocumentStateField(): StateField<DocumentRecord> {
		return StateField.define<DocumentRecord>({
			create: this.createState.bind(this),
			update: this.updateState.bind(this)
		});
	}
	
	public createExtensions(): Extension[] {
		return [ this.documentStateField ];
	}

	getDocumentRecord(state: EditorState): DocumentRecord {
		return state.field(this.documentStateField);
	}

	fetchCurrentDocumentRecord(documentId: number): DocumentRecord | null {
		return this.documents.get(documentId) ?? null;
	}

	public register(state: EditorState, range: TextRange): UpdatedTextRange {
		const document = this.getDocumentRecord(state);
		const record = document.register(range, this.observer);
		return new Registration(this, document, record.id);
	}
}

class TextRangeUpdaterDebug implements TextRangeObserver {
	public validateRegistration(_existing: IterableIterator<number>, registration: TextRangeRegistration): void {
		console.debug(`register range`, JSON.stringify(registration));
		// console.debug(`existing registrations: ${[...existing].map(id => `${id}`).join(", ")}`);
	}
	public validateDeregistration(_existing: IterableIterator<number>, registration: TextRangeRegistration): void {
		console.debug(`deregister range`, JSON.stringify(registration));
		// console.debug(`existing registrations: ${[...existing].map(id => `${id}`).join(", ")}`);
	}
	public validateNotFound(_existing: IterableIterator<number>, registration: TextRangeRegistration): void {
		console.debug(`deregister range ignored missing registration `, JSON.stringify(registration));
		// console.debug(`existing registrations: ${[...existing].map(id => `${id}`).join(", ")}`);
	}
	public validateAddition(range: TextRange): void {
		console.debug("find or add range", range);
	}
	public validateRemoval(range: TextRange): void {
		console.debug(`remove range`, range);
	}
	public validateFound(range: TextRange, index: number): void {
		console.debug(`found existing range at index ${index}`, range);
	}
	public validateDocumentCreation(id: number): void {
		console.debug(`created tracking for document ${id}`);
	}
}

/**
 * Creates root object that should be instantiated once in the client's main class and shared by all view plugins.
 */
export function createTextRangeUpdater(debug = false): TextRangeTracking {
	const updater = new TextRangeUpdater();
	if (debug) {
		updater.observer = new TextRangeUpdaterDebug();
	}
	return updater;
}