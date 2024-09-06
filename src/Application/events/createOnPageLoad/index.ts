import { addEventListener } from 'vevet-dom';
import { getApp } from '@/utils/internal/getApp';
import { Callbacks } from '@/base/Callbacks';
import { ICallbacksTypes } from './types';

export function createOnPageLoad() {
  const callbacks = new Callbacks<ICallbacksTypes>();

  let isLoaded = false;

  if (document.readyState === 'complete') {
    handleLoaded();
  } else {
    addEventListener(window, 'load', () => handleLoaded());
  }

  /** Callback on page loaded */
  function handleLoaded() {
    const app = getApp();
    const { prefix } = app;

    isLoaded = true;

    app.html.classList.remove(`${prefix}loading`);
    app.body.classList.remove(`${prefix}loading`);

    app.html.classList.add(`${prefix}loaded`);

    callbacks.tbt('loaded', undefined);
  }

  function onLoad(callback: () => void) {
    if (isLoaded) {
      callback();

      return undefined;
    }

    return callbacks.add('loaded', () => callback());
  }

  return { onLoad, getIsLoaded: () => isLoaded };
}
