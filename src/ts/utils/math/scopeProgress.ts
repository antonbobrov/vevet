/**
 * Get progress relatively to the scope.
 *
 * @example
 *
 * scopeProgress(.35, [0, 1]);
 * // => .5
 * scopeProgress(.35, [.25, 1]);
 * // => .133
 */
export default function scopeProgress (
    /**
     * Current progress
     */
    progress: number,
    /**
     * Progress scope
     */
    scope: [number, number],
) {
    const result = (progress - scope[0]) / (scope[1] - scope[0]);
    return result;
}
