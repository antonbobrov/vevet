/**
 * Performs linear interpolation between the current and target values using an ease factor.
 *
 * Linear interpolation (LERP) calculates the intermediate value between two values (`current` and `target`)
 * based on a given easing factor.
 *
 * @param current - The current value or starting point.
 * @param target - The target value or end point.
 * @param factor - The factor, typically between 0 and 1, which controls how fast the interpolation happens. A value closer to 0 makes the change slower, and a value closer to 1 makes it faster.
 * @param approximationLeft - The threshold within which the difference between `current` and `target` is considered negligible, and the function returns the `target` value directly.
 *
 * @example
 *
 * lerp(0, 1, 0.4); // => 0.4
 * lerp(0.75, 0.8, 0.98); // => 0.799
 */
export function lerp(
  current: number,
  target: number,
  factor: number,
  approximationLeft = 0,
) {
  const value = current * (1 - factor) + target * factor;
  const difference = Math.abs(target - value);

  if (difference <= approximationLeft) {
    return target;
  }

  return value;
}
