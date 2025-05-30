/**
 * Loops a value within a specified range.
 * If the value exceeds `max`, it wraps back to `min`. If it's below `min`, it wraps around to `max`.
 *
 * @group Utils
 *
 * @param min - The minimum value of the range.
 * @param max - The maximum value of the range.
 * @param value - The value to wrap around the range.
 *
 * @example
 *
 * loop(0, 0, 3); // => 0
 * loop(1, 0, 3); // => 1
 * loop(2, 0, 3); // => 2
 * loop(3, 0, 3); // => 0 (wraps back to the start)
 * loop(-1, 0, 3); // => 2 (wraps from below to the end)
 * loop(-2, 0, 3); // => 1
 * loop(-3, 0, 3); // => 0
 */
export function loop(value: number, min: number, max: number): number {
  const range = max - min;

  return ((((value - min) % range) + range) % range) + min;
}
