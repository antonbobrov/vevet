import { clamp } from '@/utils/math';
import { IProgressPreloaderResource } from '../types';

/**
 * Retrieves the load progress of a custom resource element based on its attributes.
 */
function getLoaded(element: Element) {
  let loaded = parseFloat(element.getAttribute('data-loaded') || '0');
  loaded = Number.isNaN(loaded) ? 0 : clamp(loaded, 0, Infinity);

  return loaded;
}

/**
 * Preloads a custom resource element by recursively checking its load progress until the target progress is reached.
 */
export function preloadCustomElement(
  { id, weight }: IProgressPreloaderResource,
  onLoad: (loadedWeight: number) => void,
) {
  if (!(id instanceof Element)) {
    return;
  }

  // If the load progress has reached or exceeded the target, resolve the promise
  if (getLoaded(id) >= weight) {
    onLoad(weight);

    return;
  }

  // Set up a mutation observer to monitor changes in the 'data-loaded' attribute
  const observer = new MutationObserver(() => {
    const loaded = getLoaded(id);
    onLoad(loaded);

    if (loaded >= weight) {
      observer.disconnect();
    }
  });

  observer.observe(id, {
    attributes: true,
    attributeFilter: ['data-loaded'],
  });
}
