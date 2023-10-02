/** Get object keys */
export function objectKeys<T>(object: T): (keyof T)[] {
  return Object.keys(object as any) as any;
}
