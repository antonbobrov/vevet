import { clamp as clampFunc } from './clamp';
import { scoped } from './scoped';

/**
 * Maps a value to a relative range and clamps the result within another range.
 *
 * This function first calculates the relative progress of `value` within `scope`
 * using the `scoped` function. Then, it clamps the resulting progress to `clamp`
 * using the `clamp` function.
 *
 * @param {number} value - The input value to be mapped and clamped.
 * @param {[number, number]} [scope=[0, 1]] - The range (start and end) within which to map the input value.
 * @param {[number, number]} [clamp=[0, 1]] - The range (start and end) within which to clamp the mapped value.
 * @returns {number} - The resulting value after mapping and clamping.
 *
 * @group Utils
 *
 * @example
 * clampScope(0.36, [0.35, 1]);
 * // => 0.015384 (relative progress of 0.36 within [0.35, 1], clamped to [0, 1])
 *
 * clampScope(0.36, [0.35, 1], [0.1, 1]);
 * // => 0.1 (relative progress of 0.36 within [0.35, 1], clamped to [0.1, 1])
 */
export function clampScope(value: number, scope = [0, 1], clamp = [0, 1]) {
  const scopedProgress = scoped(value, scope[0], scope[1]);

  return clampFunc(scopedProgress, clamp[0], clamp[1]);
}
