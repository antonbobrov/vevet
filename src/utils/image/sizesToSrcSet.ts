/**
 * Transform image sizes to src set
 *
 * @example
 *
 * imageSizesToSrcSet({
 *   640: '/640.jpg',
 *   750: '/750.jpg',
 *   1024: '/1024.jpg',
 *   1440: '/1440.jpg',
 * });
 *
 * // => "/640.jpg 640w, /750.jpg 750w, /1024.jpg 1024w, /1440.jpg 1440w"
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
