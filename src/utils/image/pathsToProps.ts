import { imageSizesToSrcSet } from './sizesToSrcSet';

export interface IImagePaths {
  original: string;
  thumb?: string;
  thumbWebp?: string;
}

export interface IImageAdaptivePaths<
  S extends Record<string | number, string> = {},
> extends IImagePaths {
  sizes?: S;
  sizesWebp?: S;
}

/**
 * Transform image paths to properties
 *
 * @example
 *
 * imagePathsToProps({
 *   original: '/original.jpg',
 *   thumb: '/thumb.jpg',
 *   thumbWebp: '/thumb.webp',
 * });
 * // => {"src":"/thumb.webp","srcSet":""}
 *
 * imagePathsToProps({
 *   original: '/original.jpg',
 *   thumb: '/thumb.jpg',
 *   thumbWebp: '/thumb.webp',
 *   sizes: {
 *     640: '/640.jpg',
 *     750: '/750.jpg',
 *     1024: '/1024.jpg',
 *     1440: '/1440.jpg',
 *     1920: '/1920.jpg',
 *     2560: '/2560.jpg',
 *   },
 *   sizesWebp: {
 *     640: '/640.webp',
 *     750: '/750.webp',
 *     1024: '/1024.webp',
 *     1440: '/1440.webp',
 *     1920: '/1920.webp',
 *     2560: '/2560.webp',
 *   },
 * });
 * // => {"src":"/thumb.webp","srcSet":"/640.webp 640w, /750.webp 750w, /1024.webp 1024w, /1440.webp 1440w, /1920.webp 1920w, /2560.webp 2560w"}
 */
export function imagePathsToProps(data: IImagePaths | IImageAdaptivePaths) {
  const app = typeof window !== 'undefined' ? window.vevetApp : undefined;

  // get src
  let src = data.original;
  if (data.thumb) {
    src = data.thumb;
  }
  if (app && app.isWebpSupported && !!data.thumbWebp) {
    src = data.thumbWebp;
  }

  // get src set
  let srcSet = '';
  // get webp images
  if (app && app.isWebpSupported && 'sizesWebp' in data && !!data.sizesWebp) {
    srcSet = imageSizesToSrcSet(data.sizesWebp);
  } else if ('sizes' in data && !!data.sizes) {
    srcSet = imageSizesToSrcSet(data.sizes);
  }

  return {
    src,
    srcSet,
  };
}
