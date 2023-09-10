/**
 * Cast scope value relative to global scope
 *
 * @example
 *
 * normalizeNestedScope([0, 1], [0.1, 0.8]); // => [0.1, 0.8]
 * normalizeNestedScope([0.2, 0.9], [0.1, 0.8]); // => [0.24, 0.73]
 */
export function normalizeNestedScope(
  innerScope: [number, number] | number[],
  globalScope: [number, number] | number[]
): [number, number] {
  const dist = globalScope[1] - globalScope[0];

  return [
    globalScope[0] + innerScope[0] * dist,
    globalScope[0] + innerScope[1] * dist,
  ];
}
