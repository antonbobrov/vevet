import { addEventListener } from 'vevet-dom';
import { Callbacks } from '@/base/Callbacks';
import { ICallbacksTypes, IOnPageLoad } from './types';

export function createOnPageLoad(prefix: string): IOnPageLoad {
  const callbacks = new Callbacks<ICallbacksTypes>();

  let isLoaded = false;

  if (document.readyState === 'complete') {
    handleLoaded();
  } else {
    addEventListener(window, 'load', () => handleLoaded());
  }

  /** Callback on page loaded */
  function handleLoaded() {
    const html = document.documentElement;
    const { body } = document;

    isLoaded = true;

    html.classList.remove(`${prefix}loading`);
    body.classList.remove(`${prefix}loading`);

    html.classList.add(`${prefix}loaded`);

    callbacks.tbt('loaded', undefined);
  }

  /** Add a callback on page load */
  function onLoad(callback: () => void) {
    if (isLoaded) {
      callback();

      return undefined;
    }

    return callbacks.add('loaded', () => callback());
  }

  return { onLoad, getIsLoaded: () => isLoaded };
}
