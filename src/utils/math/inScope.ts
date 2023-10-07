/**
 * Check if the value is within the scope
 *
 * @example
 *
 * inScope(0, [0, 1]); // => true
 * inScope(1, [0, 1]); // => true
 * inScope(2, [0, 1]); // => false
 * inScope(-1, [0, 1]); // => false
 */
export function inScope(val: number, scopeValue = [0, 1]) {
  return val >= scopeValue[0] && val <= scopeValue[1];
}
