/**
 * Transforms an object of image sizes into a `srcSet` string suitable for
 * responsive images using the `srcSet` attribute.
 *
 * Each key in the `sizes` object represents a width in pixels, and the associated value is the image URL.
 *
 * @param {Record<string | number, string>} sizes - An object where the keys are widths (in pixels) and the values are URLs for the images.
 * @returns {string} A `srcSet` string, where each image URL is followed by its width (e.g., "640w").
 *
 * @example
 * imageSizesToSrcSet({
 *   640: '/640.jpg',
 *   750: '/750.jpg',
 *   1024: '/1024.jpg',
 *   1440: '/1440.jpg',
 * });
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
