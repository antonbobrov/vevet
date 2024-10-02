/**
 * Get the progress of a value (`value`) relative to a given scope (`scope`).
 *
 * This function calculates how far along a value is within a specific range (scope),
 * providing a normalized result between 0 and 1, depending on its position in the scope.
 *
 * @param value - The value for which to determine the relative progress within the scope.
 * @param scope - The range (start, end) within which the value's progress will be calculated. Defaults to [0, 1].
 *
 * @example
 *
 * scoped(0.35, [0, 1]);
 * // => 0.35  // Progress of 0.35 within the full range [0, 1]
 *
 * scoped(0.35, [0.25, 1]);
 * // => 0.133  // Progress of 0.35 within the range [0.25, 1]
 *
 * scoped(0.35, [0.25, 0.9]);
 * // => 0.153  // Progress of 0.35 within the narrower range [0.25, 0.9]
 */
export function scoped(value: number, scope = [0, 1]) {
  const result = (value - scope[0]) / (scope[1] - scope[0]);

  return result;
}
