/**
 * Get progress from the scope on the basis of known TIME value relatively the
 * timeline scope.
 *
 * @param time - Current time
 * @param scope - Relative timeline. Array of two numbers.
 *
 * @example
 *
 * scopeProgress(.35, [0, 1]);
 * // => .5
 *
 * scopeProgress(.35, [.25, 1]);
 * // => .133
 */
function scopeProgress (
    time: number,
    scope: number[] = [0, 1],
) {
    const result = (time - scope[0]) / (scope[1] - scope[0]);
    return result;
}

export default scopeProgress;
