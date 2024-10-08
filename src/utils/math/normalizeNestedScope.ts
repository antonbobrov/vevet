/**
 * Normalizes a nested scope (`innerScope`) relative to a larger `globalScope`.
 *
 * This function calculates the relative position of an inner scope within a global scope,
 * adjusting the inner scope's values based on the size and position of the global scope.
 *
 * @param innerScope - The scope that is nested within the global scope. This is a range [start, end] relative to the global scope.
 * @param globalScope - The global scope or range [start, end] that the inner scope should be normalized to.
 *
 * @example
 *
 * normalizeNestedScope([0, 1], [0.1, 0.8]);
 * // => [0.1, 0.8] // No change, since innerScope matches the full globalScope
 *
 * normalizeNestedScope([0.2, 0.9], [0.1, 0.8]);
 * // => [0.24, 0.73] // Adjusted to fit within globalScope [0.1, 0.8]
 */
export function normalizeNestedScope(
  innerScope: [number, number] | number[],
  globalScope: [number, number] | number[],
): [number, number] {
  const dist = globalScope[1] - globalScope[0];

  return [
    globalScope[0] + innerScope[0] * dist,
    globalScope[0] + innerScope[1] * dist,
  ];
}
