/**
 * Pick object properties
 *
 * @example
 *
 * pickObjectProps({ a: 1, b: 2, c: 3 }, ['a', 'c']); // => { a: 1, c: 3 }
 */
export function pickObjectProps<
  T extends Record<string, any>,
  K extends keyof T
>(source: T, keys: K[]): Pick<T, K> {
  const result: any = {};

  keys.forEach((key) => {
    result[key] = source[key];
  });

  return result;
}
