/**
 * Clamp the value between two points
 *
 * @example
 *
 * clamp(1.5, [0.1, 0.9]); // => 0.9
 * clamp(0.001, [0.1, 0.9]); // => 0.1
 */
export function clamp(val: number, scope = [0, 1]) {
  if (val < scope[0]) {
    return scope[0];
  }
  if (val > scope[1]) {
    return scope[1];
  }

  return val;
}
