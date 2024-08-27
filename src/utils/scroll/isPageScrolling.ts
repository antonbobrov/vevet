import { addEventListener } from 'vevet-dom';
import { IRemovable } from '@/types/general';
import { uid } from '../common';

let ids: string[] = [];

let timeout: NodeJS.Timeout | null = null;
let listener: IRemovable | undefined;

let isScrolling = false;

function createListener() {
  if (!listener) {
    listener = addEventListener(window, 'scroll', () => {
      if (timeout) {
        clearTimeout(timeout);
      }

      isScrolling = true;

      timeout = setTimeout(() => {
        isScrolling = false;
      }, 150);
    });
  }
}

function destroyListener() {
  if (ids.length === 0) {
    listener?.remove();
    listener = undefined;
  }
}

export function createIsPageScrolling() {
  const id = uid('is-page-scrolling');
  ids.push(id);

  createListener();

  function destroy() {
    ids = ids.filter((item) => item !== id);
    destroyListener();
  }

  return {
    get: () => isScrolling,
    destroy,
  };
}
