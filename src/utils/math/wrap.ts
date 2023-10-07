function conditionalReturn(value: number, func: (val: number) => number) {
  return value || value === 0 ? func(value) : func;
}

/**
 * Wrap values
 *
 * @example
 *
 * wrap(0, 3, 0); // => 0
 * wrap(0, 3, 1); // => 1
 * wrap(0, 3, 2); // => 2
 * wrap(0, 3, 3); // => 0
 * wrap(0, 3, -1); // => 2
 * wrap(0, 3, -2); // => 1
 * wrap(0, 3, -3); // => 0
 */
export function wrap(min: number, max: number, value: number) {
  const range = max - min;

  return conditionalReturn(
    value,
    (val) => ((range + ((val - min) % range)) % range) + min
  ) as number;
}
