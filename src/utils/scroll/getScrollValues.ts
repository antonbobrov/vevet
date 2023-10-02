import { IScrollLike } from '@/types/general';

export interface IGetScrollValues {
  scrollTop: number;
  scrollLeft: number;
}

/**
 * Get scroll values of a certain element
 *
 * @example
 *
 * getScrollValues(window); // => { scrollTop: 0, scrollLeft: 0 }
 */
export function getScrollValues(
  selector: Window | Element | IScrollLike | undefined = window
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
