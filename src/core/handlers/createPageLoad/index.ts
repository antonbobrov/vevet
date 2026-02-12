import { Callbacks } from '@/base/Callbacks';
import { cnAdd, cnRemove } from '@/internal/cn';
import { doc, html } from '@/internal/env';
import { addEventListener } from '@/utils/listeners';

import { IPageLoadCallbacksMap } from './types';

interface IProps {
  prefix: string;
  applyClassNames: boolean;
}

export function createPageLoad({ prefix, applyClassNames }: IProps) {
  const callbacks = new Callbacks<IPageLoadCallbacksMap>();

  let isLoaded = false;

  if (doc.readyState === 'complete') {
    setTimeout(() => handleLoaded(), 0);
  } else {
    addEventListener(window, 'load', () => handleLoaded());
  }

  /** Callback on page loaded */
  function handleLoaded() {
    const { body } = document;

    isLoaded = true;

    if (applyClassNames) {
      cnRemove(html, `${prefix}loading`);
      cnRemove(body, `${prefix}loading`);

      cnAdd(html, `${prefix}loaded`);
    }

    callbacks.emit('loaded', undefined);
  }

  /** Add a callback on page load */
  function onLoad(callback: () => void) {
    if (isLoaded) {
      callback();

      return () => {};
    }

    return callbacks.on('loaded', () => callback());
  }

  return { onLoad, getIsLoaded: () => isLoaded };
}
