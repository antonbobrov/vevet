import { Module } from '@/base/Module';
import { NProgressPreloader } from '../types';

function getLoadProgress({
  element,
  targetProgress,
}: NProgressPreloader.ICustomResourceData) {
  if (typeof element.isComplete !== 'undefined') {
    if (typeof element.isComplete === 'boolean' && element.isComplete) {
      return targetProgress;
    }

    if (typeof element.isComplete === 'number') {
      return element.isComplete;
    }

    return 0;
  }

  if (typeof element.isLoaded !== 'undefined') {
    if (typeof element.isLoaded === 'boolean' && element.isLoaded) {
      return targetProgress;
    }

    if (typeof element.isLoaded === 'number') {
      return element.isLoaded;
    }
  }

  const isLoadedAttr = element.getAttribute('data-is-loaded');
  if (
    isLoadedAttr !== null &&
    isLoadedAttr !== '' &&
    isLoadedAttr !== 'false'
  ) {
    const isLoadedAttrNum = parseFloat(isLoadedAttr);

    // if the value is non-numeric, we think that the resource is loaded
    if (Number.isNaN(isLoadedAttrNum)) {
      return targetProgress;
    }

    return isLoadedAttrNum;
  }

  return 0;
}

export function preloadCustomElement(
  data: NProgressPreloader.ICustomResourceData,
  instance: Module<any, any, any>
) {
  return new Promise<void>((resolve) => {
    const { targetProgress } = data;
    const loadProgress = getLoadProgress(data);

    if (loadProgress >= targetProgress) {
      resolve();

      return;
    }

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
