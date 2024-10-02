let index = 0;

/**
 * Generates a unique ID with an optional prefix.
 *
 * This function returns a string that combines a prefix (default is 'id') with a unique incrementing number.
 * It ensures each call will return a unique identifier.
 *
 * @example
 * uid(); // => 'id_1'
 * uid('test'); // => 'test_2'
 * uid('0'); // => '0_3'
 */
export function uid(prefix = 'id'): string {
  index += 1;

  return `${prefix}_${index}`;
}
