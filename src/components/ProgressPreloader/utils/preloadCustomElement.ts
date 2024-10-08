import { Module } from '@/base/Module';
import { NProgressPreloader } from '../types';

/**
 * Retrieves the load progress of a custom resource element based on its properties or attributes.
 */
function getLoadProgress({
  element,
  targetProgress,
}: NProgressPreloader.ICustomResourceData): number {
  // Check if the element is marked as complete
  if (typeof element.isComplete !== 'undefined') {
    if (typeof element.isComplete === 'boolean' && element.isComplete) {
      return targetProgress;
    }

    if (typeof element.isComplete === 'number') {
      return element.isComplete;
    }

    return 0;
  }

  // Check if the element is marked as loaded
  if (typeof element.isLoaded !== 'undefined') {
    if (typeof element.isLoaded === 'boolean' && element.isLoaded) {
      return targetProgress;
    }

    if (typeof element.isLoaded === 'number') {
      return element.isLoaded;
    }
  }

  // Check for a `data-is-loaded` attribute
  const isLoadedAttr = element.getAttribute('data-is-loaded');
  if (
    isLoadedAttr !== null &&
    isLoadedAttr !== '' &&
    isLoadedAttr !== 'false'
  ) {
    const isLoadedAttrNum = parseFloat(isLoadedAttr);

    // If the value is non-numeric, treat the resource as loaded
    if (Number.isNaN(isLoadedAttrNum)) {
      return targetProgress;
    }

    return isLoadedAttrNum;
  }

  return 0;
}

/**
 * Preloads a custom resource element by recursively checking its load progress until the target progress is reached.
 */
export function preloadCustomElement(
  data: NProgressPreloader.ICustomResourceData,
  instance: Module<any, any, any>,
) {
  return new Promise<void>((resolve) => {
    const { targetProgress } = data;
    const loadProgress = getLoadProgress(data);

    // If the load progress has reached or exceeded the target, resolve the promise
    if (loadProgress >= targetProgress) {
      resolve();

      return;
    }

    // Recursively check the load progress every 50ms
    setTimeout(() => {
      if (instance.isDestroyed) {
        return;
      }

      preloadCustomElement(data, instance)
        .then(() => resolve())
        .catch(() => {});
    }, 50);
  });
}
