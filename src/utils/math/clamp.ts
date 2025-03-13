/**
 * Restricts a value to lie within a specified range.
 *
 * Ensures that `value` is no less than `min` and no greater than `max`.
 *
 * @param {number} value - The input value to be clamped.
 * @param {number} [min=0] - The lower bound of the range (default is 0).
 * @param {number} [max=1] - The upper bound of the range (default is 1).
 * @returns {number} - The clamped value within the range [min, max].
 *
 * @group Utils
 *
 * @example
 * clamp(1.5, 0.1, 0.9); // 0.9
 * clamp(0.001, 0.1, 0.9); // 0.1
 * clamp(0.5, 0, 1); // 0.5
 */
export function clamp(value: number, min = 0, max = 1) {
  return Math.max(min, Math.min(value, max));
}
