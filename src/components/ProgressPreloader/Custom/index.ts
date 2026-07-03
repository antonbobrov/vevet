import { ModulePart } from '@/shared/ModulePart';
import { clamp } from '@/utils';

import { ProgressPreloader } from '..';

/**
 * Tracks `data-loaded` on a custom element via `MutationObserver`.
 *
 * Emits partial loaded weight until `data-loaded >= data-weight`.
 *
 * @internal
 */
export class ProgressPreloaderCustom extends ModulePart<ProgressPreloader> {
  constructor(
    parent: ProgressPreloader,
    private _element: Element,
    targetWeight: number,
    onLoadWeight: (weight: number) => void,
  ) {
    super(parent);

    if (this._getLoadedWeight() >= targetWeight) {
      onLoadWeight(targetWeight);

      return;
    }

    const observer = new MutationObserver(() => {
      const loaded = this._getLoadedWeight();
      onLoadWeight(loaded);

      if (loaded >= targetWeight) {
        observer.disconnect();
      }
    });

    observer.observe(_element, {
      attributes: true,
      attributeFilter: ['data-loaded'],
    });

    this.onDestroy(() => observer.disconnect());
  }

  private _getLoadedWeight() {
    let loaded = parseFloat(this._element.getAttribute('data-loaded') || '0');
    loaded = isFinite(loaded) ? clamp(loaded, 0, Infinity) : 0;

    return loaded;
  }
}
