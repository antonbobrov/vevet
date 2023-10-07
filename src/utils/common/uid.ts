let index = 0;

/**
 * Generate a unique ID
 *
 * @example
 *
 * uid(); // => 'id_1'
 * uid('test'); // => 'test_2'
 * uid('0'); // => '0_3'
 */
export function uid(prefix = 'id') {
  index += 1;

  return `${prefix}_${index}`;
}
