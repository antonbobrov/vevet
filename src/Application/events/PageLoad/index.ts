import { addEventListener } from 'vevet-dom';
import { Callbacks } from '@/base/Callbacks';
import { ICallbacksTypes } from './types';

export function createPageLoad() {
  let isLoaded = false;

  const callbacks = new Callbacks<ICallbacksTypes>();

  /** Callback on page loaded */
  function handleLoaded() {
    const app = window.vevetApp;
    const { prefix, html, body } = app;

    isLoaded = true;

    html.classList.remove(`${prefix}loading`);
    body.classList.remove(`${prefix}loading`);

    html.classList.add(`${prefix}loaded`);

    callbacks.tbt('loaded', undefined);
  }

  // SET EVENTS

  if (document.readyState === 'complete') {
    handleLoaded();
  } else {
    addEventListener(window, 'load', () => handleLoaded());
  }

  // on load
  function onLoad(callback: () => void) {
    if (isLoaded) {
      callback();

      return undefined;
    }

    return callbacks.add('loaded', () => callback());
  }

  return {
    getIsLoaded: () => isLoaded,
    onLoad,
  };
}
