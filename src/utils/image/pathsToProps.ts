import { imageSizesToSrcSet } from './sizesToSrcSet';

export interface IImagePaths {
  original: string;
  thumb?: string;
  thumbWebp?: string;
}

export interface IImageAdaptivePaths<
  S extends Record<string | number, string> = {}
> extends IImagePaths {
  sizes?: S;
  sizesWebp?: S;
}

/**
 * Transform image paths to properties
 */
export function imagePathsToProps(data: IImagePaths | IImageAdaptivePaths) {
  const app = window.vevetApp;

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
