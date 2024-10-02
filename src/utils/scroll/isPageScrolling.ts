import { addEventListener } from 'vevet-dom';
import { IRemovable } from '@/types/general';
import { uid } from '../common';

let ids: string[] = [];

let timeout: NodeJS.Timeout | null = null;
let listener: IRemovable | undefined;

let isScrolling = false;

/**
 * Creates a scroll event listener if it doesn't exist and updates the `isScrolling` state.
 * This listener detects if the user is scrolling and sets a timeout of 150ms to reset the `isScrolling` state.
 */
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

/**
 * Destroys the scroll event listener when there are no more IDs associated with it..
 */
function destroyListener() {
  if (ids.length === 0) {
    listener?.remove();
    listener = undefined;
  }
}

/**
 * Creates an instance to check whether the page is currently scrolling.
 * This function manages the scroll state across multiple instances, ensuring the listener is created only once.
 *
 * @example
 *
 * const scrollChecker = createIsPageScrolling();
 *
 * // Check if page is scrolling
 * const isPageScrolling = scrollChecker.get(); // => true or false
 *
 * // Destroy the instance when not needed
 * scrollChecker.destroy();
 */
export function createIsPageScrolling() {
  const id = uid('is-page-scrolling');
  ids.push(id);

  createListener();

  /**
   * Removes the current instance's ID from the tracking list and destroys the listener if no other IDs exist.
   */
  function destroy() {
    ids = ids.filter((item) => item !== id);
    destroyListener();
  }

  return {
    /**
     * @returns {boolean} - Returns whether the page is currently scrolling.
     */
    get: () => isScrolling,

    /**
     * Destroys the scroll listener instance.
     */
    destroy,
  };
}
