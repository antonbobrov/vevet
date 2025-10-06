/**
 * Determines if a value lies within a specified range (inclusive of the range boundaries).
 *
 * @param {number} value - The value to check.
 * @param {number} [min=0] - The minimum boundary of the range.
 * @param {number} [max=1] - The maximum boundary of the range.
 * @returns {boolean} - `true` if the value is within the range (inclusive), otherwise `false`.
 *
 * @group Utils
 *
 * @example
 * inRange(0, 0, 1);
 * // => true (0 is within the range [0, 1])
 *
 * inRange(1, 0, 1);
 * // => true (1 is within the range [0, 1])
 *
 * inRange(2, 0, 1);
 * // => false (2 is outside the range [0, 1])
 *
 * inRange(-1, 0, 1);
 * // => false (-1 is outside the range [0, 1])
 */
export function inRange(value: number, min = 0, max = 1): boolean {
  const realMin = Math.min(min, max);
  const realMax = Math.max(min, max);

  return value >= realMin && value <= realMax;
}
