/**
 * Check if a given value is within a defined scope (inclusive of the scope's boundaries).
 *
 * @param value - The value to check.
 * @param scopeValue - An array defining the range [min, max] where `value` should be compared against.
 *
 * @example
 *
 * inScope(0, [0, 1]); // => true
 * inScope(1, [0, 1]); // => true
 * inScope(2, [0, 1]); // => false
 * inScope(-1, [0, 1]); // => false
 */
export function inScope(value: number, scopeValue = [0, 1]) {
  return value >= scopeValue[0] && value <= scopeValue[1];
}
