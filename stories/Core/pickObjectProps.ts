/**
 * Pick specific properties from an object.
 *
 * This function creates a new object composed of the properties listed in the `keys` array,
 * extracted from the `source` object.
 *
 * @param source - The source object from which to pick properties.
 * @param keys - An array of keys that should be picked from the source object.
 *
 * @example
 * const obj = { a: 1, b: 2, c: 3 };
 * const result = pickObjectProps(obj, ['a', 'c']);
 * // => { a: 1, c: 3 }
 *
 * @example
 * const user = { name: 'John', age: 30, email: 'john@example.com' };
 * const picked = pickObjectProps(user, ['name', 'email']);
 * // => { name: 'John', email: 'john@example.com' }
 */
export function pickObjectProps<
  T extends Record<string, any>,
  K extends keyof T,
>(source: T, keys: K[]): Pick<T, K> {
  const result: Partial<T> = {};

  keys.forEach((key) => {
    result[key] = source[key];
  });

  return result as Pick<T, K>;
}
