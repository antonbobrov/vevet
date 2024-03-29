import { PCancelable } from '@/utils/common/PCancelable';

const cachedImages: {
  src: string;
  image: HTMLImageElement;
}[] = [];

type TLoadImageProps = {
  /**
   * @default null
   */
  crossOrigin?: string | null;
  /**
   * @default false
   */
  useCache?: boolean;
};

/**
 * Load an image
 *
 * @example
 *
 * const loaderWithoutCache = loadImage('/image.jpg');
 *
 * loaderWithoutCache.then((img) => console.log(img)).catch(() => {});
 *
 * const loaderWithCache = loadImage('/image.jpg', {
 *   crossOrigin: 'anonymous',
 *   useCache: true,
 * });
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
