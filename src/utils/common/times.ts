/**
 * Repeat something `n` times
 *
 * @example
 *
 * times((index, count) => index / count, 5);
 * // [0, 0.2, 0.4, 0.6, 0.8]
 */
export function times<T>(
  callback: (index: number, count: number) => T,
  count: number
): T[] {
  let index = 0;
  const list: T[] = [];

  while (index < count) {
    list.push(callback(index, count));
    index += 1;
  }

  return list;
}
