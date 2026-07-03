import { ModulePart } from '@/shared/ModulePart';
import { addEventListener } from '@/utils';

import { ProgressPreloader } from '..';

/**
 * Preloads a DOM `img` via a detached `Image()` and resolves on `load` or `error`.
 *
 * @internal
 */
export class ProgressPreloaderImage extends ModulePart<ProgressPreloader> {
  constructor(
    parent: ProgressPreloader,
    resource: HTMLImageElement,
    onLoad: () => void,
  ) {
    super(parent);

    if (resource.complete) {
      onLoad();
    } else {
      const image = new Image();

      image.crossOrigin = 'anonymous';
      image.src = resource.currentSrc || resource.src;

      this.onDestroy(addEventListener(image, 'load', onLoad));
      this.onDestroy(addEventListener(image, 'error', onLoad));
    }
  }
}
