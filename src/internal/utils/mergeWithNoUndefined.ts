export function mergeWithNoUndefined<
  S extends Record<string, any>,
  A extends Record<string, any>,
>(source: S, add: A) {
  const addKeys = Object.keys(add) as (keyof A)[];
  const addNonUndefinedKeys = addKeys.filter((key) => add[key] !== undefined);
  const newAdd = addNonUndefinedKeys.reduce(
    (acc, key) => {
      acc[key] = add[key];

      return acc;
    },
    {} as Record<keyof A, A[keyof A]>,
  );

  return {
    ...source,
    ...newAdd,
  };
}
