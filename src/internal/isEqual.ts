export function isEqual<T>(data: T[][]) {
  return data.every((item) => item[0] === item[1]);
}
