/**
 * Transform image sizes to src set
 */
export function imageSizesToSrcSet(sizes: Record<string | number, string>) {
  const keys = Object.keys(sizes);
  const srcParts = keys.map((key) => {
    const value = sizes[key];
    if (value) {
      return `${value} ${key}w`;
    }

    return undefined;
  });

  return srcParts.filter((item) => !!item).join(', ');
}
