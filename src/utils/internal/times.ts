export function times<T>(
  callback: (index: number, count: number) => T,
  count: number,
): T[] {
  let index = 0;
  const list: T[] = [];

  while (index < count) {
    list.push(callback(index, count));
    index += 1;
  }

  return list;
}
