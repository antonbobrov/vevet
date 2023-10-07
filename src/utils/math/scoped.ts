/**
 * Get progress relatively to the scope.
 *
 * @example
 *
 * scoped(0.35, [0, 1]); // => 0.35
 * scoped(0.35, [0.25, 1]); // => 0.133
 * scoped(0.35, [0.25, 0.9]); // => 0.153
 */
export function scoped(val: number, scopeValue = [0, 1]) {
  const result = (val - scopeValue[0]) / (scopeValue[1] - scopeValue[0]);

  return result;
}
