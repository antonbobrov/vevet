function conditionalReturn(value: number, func: (val: number) => number) {
  return value || value === 0 ? func(value) : func;
}

/**
 * Wrap a value around a specified range.
 * When the value exceeds the `max`, it wraps back to `min`, and when it's below `min`,
 * it wraps around to `max`.
 *
 * @param min - The minimum value of the range.
 * @param max - The maximum value of the range.
 * @param value - The value to wrap around the range.
 *
 * @example
 *
 * wrap(0, 3, 0); // => 0
 * wrap(0, 3, 1); // => 1
 * wrap(0, 3, 2); // => 2
 * wrap(0, 3, 3); // => 0 (wraps back to the start)
 * wrap(0, 3, -1); // => 2 (wraps from below to the end)
 * wrap(0, 3, -2); // => 1
 * wrap(0, 3, -3); // => 0
 */
export function wrap(min: number, max: number, value: number) {
  const range = max - min;

  return conditionalReturn(
    value,
    (val) => ((range + ((val - min) % range)) % range) + min,
  ) as number;
}
