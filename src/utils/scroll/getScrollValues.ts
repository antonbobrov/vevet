import { IScrollLike } from '@/types/general';

export interface IGetScrollValues {
  scrollTop: number;
  scrollLeft: number;
}

/**
 * Get the scroll values (scrollTop and scrollLeft) of a specific element, window, or a custom scroll-like object.
 * This function retrieves the vertical and horizontal scroll positions.
 *
 * @param selector - The element, window, or custom scroll-like object to get scroll values from. If no selector is provided, it defaults to `window`.
 *
 * @example
 *
 * // Get scroll values of the window
 * getScrollValues(window); // => { scrollTop: 0, scrollLeft: 0 }
 *
 * // Get scroll values of a specific DOM element
 * const element = document.querySelector('.scrollable');
 * getScrollValues(element); // => { scrollTop: 100, scrollLeft: 50 }
 *
 * // Get scroll values of a custom scroll-like object
 * const customScroll: IScrollLike = { scrollTop: 200, scrollLeft: 75 };
 * getScrollValues(customScroll); // => { scrollTop: 200, scrollLeft: 75 }
 */
export function getScrollValues(
  selector: Window | Element | IScrollLike | undefined = window,
): IGetScrollValues | undefined {
  if (!selector) {
    return undefined;
  }

  const scrollTop =
    selector instanceof Window ? selector.pageYOffset : selector.scrollTop;

  const scrollLeft =
    selector instanceof Window ? selector.pageXOffset : selector.scrollLeft;

  return {
    scrollTop,
    scrollLeft,
  };
}
