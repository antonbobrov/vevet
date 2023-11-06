import mergeWith from 'lodash.mergewith';

/**
 * Deep merge of two objects except for arrays.
 * The function changes `object`;
 *
 * @example
 *
 * mergeWithoutArrays({ a: 1, b: 2 }, { b: 3, c: 4 }); // => { a: 1, b: 3, c: 4 }
 */
export function mergeWithoutArrays<
  A extends Record<string, any>,
  B extends Record<string, any>,
>(object: A, source: B): A & B {
  return mergeWith(object, source, (objValue, srcValue) => {
    if (Array.isArray(objValue)) {
      return srcValue as Record<string, any>;
    }

    return undefined;
  });
}
