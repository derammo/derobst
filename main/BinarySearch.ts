export function binarySearch<T>(array: readonly T[], value: T, threeValuedCompare: (a: T, b: T) => number): { index: number; found: boolean; } {
    let low = 0;
    let high = array.length - 1;
    while (low <= high) {
        const mid = (low + high) >>> 1;
        const difference = threeValuedCompare(array[mid], value);
        if (difference < 0) {
            low = mid + 1;
        } else if (difference > 0) {
            high = mid - 1;
        } else {
            return { index: mid, found: true };
        }
    }
    return { index: low, found: false };
}

/**
 * Find largest item less than search value
 * @param array
 * @param value
 * @param threeValuedCompare
 * @returns -1 for not found
 */
export function binarySearchLeft<TRecord, TValue>(array: readonly TRecord[], value: TValue, threeValuedCompare: (left: TRecord, right: TValue) => number): number {
    let low = 0;
    let high = array.length - 1;
    let candidate = -1;
    while (low <= high) {
        const mid = (low + high) >>> 1;
        const difference = threeValuedCompare(array[mid], value);
        if (difference < 0) {
            candidate = mid;
            low = mid + 1;
        } else if (difference >= 0) {
            high = mid - 1;
        }
    }
    return candidate;
}
