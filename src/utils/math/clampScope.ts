import { scoped } from './scoped';
import { clamp } from './clamp';

/**
 * Get progress relatively to the scope and clamp it within two points
 *
 * @example
 *
 * clampScope(0.38, [0.35, 1]); // => 0.046
 * clampScope(0.38, [0.35, 1], [0.1, 1]); // => 0.1
 */
export function clampScope(
  value: number,
  scopeProp = [0, 1],
  clampProp = [0, 1]
) {
  return clamp(scoped(value, scopeProp), clampProp);
}
