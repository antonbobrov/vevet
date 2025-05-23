/**
 * Get closest value in array to target value.
 *
 * @example
 * closest(5, [3, 6, 9, 12, 15]); // => 6
 */
export function closest(target: number, values: number[]) {
  return values.reduce((prev, curr) =>
    Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev,
  );
}
