/**
 * Get progress relatively to the scope.
 *
 * @example
 *
 * scope(.35, [0, 1]);
 * // => .5
 * scope(.35, [.25, 1]);
 * // => .133
 */
export default function scoped (
    val: number,
    scopeValue = [0, 1],
) {
    const result = (val - scopeValue[0]) / (scopeValue[1] - scopeValue[0]);
    return result;
}
