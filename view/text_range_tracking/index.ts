import { EditorState, Extension } from "@codemirror/state";
export { createTextRangeUpdater } from "./TextRangeUpdater";

/**
 * Intended to be able to take data from SyntaxNode and SyntaxNodeRef, so conforms to those
 */
export interface TextRange {
	readonly from: number;
	readonly to: number;
}

/**
 * Soft reference to a text range
 */
export type TextRangeRegistration = {
	document: number; 
	range: number;
}

/**
 * A subscription for a TextRange that will be updated as the document changes.  
 */
export interface UpdatedTextRange {
	readonly id: TextRangeRegistration;

	/**
	 * @returns the current range for the current document state, or null if the range is no longer valid
	 */
	fetchCurrentRange(): TextRange | null;

	/**
	 * @returns the range for the given document state, or null if the range is not valid in that state
	 */
	fetchRange(state: EditorState): TextRange | null;
}

/**
 * A registrar for text ranges of interest.  A singleton instance of this should be created via {@link createTextRangeUpdater}. 
 */
export interface TextRangeTracking {
	/**
	 * @returns extensions that MUST be registered as an editor extension in order to enable tracking
	 */
	createExtensions(): Extension[];

	/**
	 * Register a text range for tracking.  The range will be updated as the document state changes.
	 * This method must be called on every state change, to indicate this information is still required.
	 * 
	 * As long as at least one registration is created, all previous registrations for the same range will continue to get updates.
	 * In this way, WidgetType objects can register a range in their constructor, but then actually get replaced with
	 * another widget that already has that range registered if Widget reuse is implemented.
	 * 
	 * @param state 
	 * @param range 
	 */
	register(state: EditorState, range: TextRange): UpdatedTextRange;
}

