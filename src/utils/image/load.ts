import { PCancelable } from '@/utils/common/PCancelable';

const cachedImages: {
  src: string;
  image: HTMLImageElement;
}[] = [];

/** Image loading options */
export type TLoadImageProps = {
  /**
   * Specifies the `crossOrigin` attribute for the image.
   * Can be `null` or a string such as 'anonymous' or 'use-credentials'.
   * @default null
   */
  crossOrigin?: string | null;
  /**
   * When set to `true`, the image will be cached in memory and will not be loaded again for subsequent requests.
   * @default false
   */
  useCache?: boolean;
};

/**
 * Loads an image from a given source, either a URL or an HTMLImageElement.
 * Supports caching and handling cross-origin requests.
 *
 * @example
 * const loaderWithoutCache = loadImage('/image.jpg');
 * loaderWithoutCache.then((img) => console.log(img)).catch(() => {});
 *
 * const loaderWithCache = loadImage('/image.jpg', {
 *   crossOrigin: 'anonymous',
 *   useCache: true,
 * });
 * loaderWithCache.then((img) => console.log(img)).catch(() => {});
 */
export function loadImage(
  source: string | HTMLImageElement,
  props?: TLoadImageProps,
) {
  const defaultLoadProps: Required<TLoadImageProps> = {
    crossOrigin: null,
    useCache: false,
  };

  const loadProps = {
    ...defaultLoadProps,
    ...props,
  };

  const imageSrc = typeof source === 'string' ? source : source.src;

  return new PCancelable(
    (resolve: (img: HTMLImageElement) => void, reject: () => void) => {
      const cachedImage =
        loadProps.useCache && cachedImages.find((img) => img.src === imageSrc);

      // get image from cache
      if (cachedImage) {
        resolve(cachedImage.image);

        return;
      }

      // load the image by src
      if (typeof source === 'string') {
        const img = new Image();

        img.crossOrigin = loadProps.crossOrigin;

        img.onload = () => {
          if (loadProps.useCache) {
            cachedImages.push({ src: imageSrc, image: img });
          }

          resolve(img);
        };

        img.onerror = () => reject();

        img.src = source;

        return;
      }

      // load the image by image element
      if (source instanceof HTMLImageElement) {
        if (source.complete) {
          resolve(source);
        } else {
          source.addEventListener('load', () => {
            if (loadProps.useCache) {
              cachedImages.push({ src: imageSrc, image: source });
            }

            resolve(source);
          });

          source.addEventListener('error', () => reject());
        }
      }
    },
  );
}
