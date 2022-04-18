import { ImageAdaptivePaths, ImagePaths } from '../types/general';
import imageSizesToSrcSet from './sizesToSrcSet';

/**
 * Transform image paths to properties
 */
export default function imagePathsToProps (
    data: ImagePaths | ImageAdaptivePaths,
) {
    const app = window.vevetApp;

    // get src
    let src = data.original;
    if (data.thumb) {
        src = data.thumb;
    }
    if (app && app.supportsWebp && !!data.thumbWebp) {
        src = data.thumbWebp;
    }

    // get src set
    let srcSet = '';
    // get webp images
    if (app && app.supportsWebp && 'sizesWebp' in data && !!data.sizesWebp) {
        srcSet = imageSizesToSrcSet(data.sizesWebp);
    } else if ('sizes' in data && !!data.sizes) {
        srcSet = imageSizesToSrcSet(data.sizes);
    }

    return {
        src,
        srcSet,
    };
}
