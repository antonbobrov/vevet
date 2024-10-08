import { scoped } from './scoped';
import { clamp } from './clamp';

/**
 * Get progress relative to a given scope and then clamp it within another range.
 *
 * The function first scales the `value` relative to `scopeProp` using the `scoped` function,
 * and then clamps the result within `clampProp` using the `clamp` function.
 *
 * @param value - The value to be scaled and clamped.
 * @param scopeProp - The scope within which the value will be scaled.
 * @param clampProp - The range to clamp the scaled value within.
 *
 * @example
 *
 * clampScope(0.38, [0.35, 1]); // => 0.046
 * clampScope(0.38, [0.35, 1], [0.1, 1]); // => 0.1
 */
export function clampScope(
  value: number,
  scopeProp = [0, 1],
  clampProp = [0, 1],
): number {
  return clamp(scoped(value, scopeProp), clampProp);
}
