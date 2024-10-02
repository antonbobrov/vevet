/**
 * Clamp the value between two points.
 * Ensures that `value` is between the minimum and maximum of the provided `scope`.
 *
 * @param value - The value to be clamped.
 * @param scope - The range to clamp the value between, defaulting to [0, 1].
 *
 * @example
 *
 * clamp(1.5, [0.1, 0.9]); // => 0.9
 * clamp(0.001, [0.1, 0.9]); // => 0.1
 * clamp(0.5, [0, 1]); // => 0.5
 */
export function clamp(value: number, scope = [0, 1]): number {
  if (value < scope[0]) {
    return scope[0];
  }
  if (value > scope[1]) {
    return scope[1];
  }

  return value;
}
