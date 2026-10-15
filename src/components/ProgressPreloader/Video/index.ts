import { ModulePart } from '@/internal';
import { addEventListener } from '@/utils';

import { ProgressPreloader } from '..';

/**
 * Observes a DOM `video` and resolves on `loadedmetadata`, `error`, or when already ready.
 *
 * Videos with `preload="none"` resolve immediately (not tracked as loading).
 *
 * @internal
 */
export class ProgressPreloaderVideo extends ModulePart<ProgressPreloader> {
  constructor(
    parent: ProgressPreloader,
    resource: HTMLVideoElement,
    onLoad: () => void,
  ) {
    super(parent);

    if (resource.readyState > 0) {
      onLoad();
    } else {
      if (resource.preload === 'none') {
        onLoad();
      } else {
        this.onDestroy(addEventListener(resource, 'error', onLoad));
        this.onDestroy(addEventListener(resource, 'loadedmetadata', onLoad));
      }
    }
  }
}
