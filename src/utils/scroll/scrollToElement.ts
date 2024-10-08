import { selectOne } from 'vevet-dom';
import { getScrollValues } from './getScrollValues';
import { clamp } from '../math/clamp';
import { IScrollToProps, scrollTo } from './scrollTo';

export interface IScrollToElementProps extends IScrollToProps {
  /**
   * The target element to scroll to.
   */
  element: Element | string;
}

/**
 * Smoothly scroll to a specific element inside a container.
 * It uses the element's bounding box to calculate the scroll position
 * and allows for custom top and left padding as well as scroll duration.
 *
 * @example
 *
 * // Scroll to an element with a static duration
 * scrollToElement({
 *   container: window,
 *   element: document.getElementById('element_20')!,
 *   top: 60,
 *   duration: 500,
 * });
 *
 * // Scroll to an element with a dynamic duration
 * scrollToElement({
 *   element: document.getElementById('element_20')!,
 *   top: 60,
 *   duration: (px) => px,
 * });
 *
 * // Use promise to handle when the scroll finishes
 * scrollToElement({
 *   element: document.getElementById('element_20')!,
 *   top: 60,
 * })
 *   .then(() => console.log('Scroll complete'))
 *   .catch(() => console.error('Scroll failed'));
 */
export function scrollToElement({
  container = window,
  element: elementProp,
  top = 0,
  left = 0,
  ...props
}: IScrollToElementProps) {
  return new Promise<void>((resolve, reject) => {
    const startValues = getScrollValues(container);
    const element = selectOne(elementProp);

    if (!startValues || !element) {
      reject();

      return;
    }

    const bounding = element.getBoundingClientRect();

    const toTop = clamp(bounding.top + startValues.scrollTop - top, [
      0,
      Infinity,
    ]);

    const toLeft = clamp(bounding.left + startValues.scrollLeft - left, [
      0,
      Infinity,
    ]);

    scrollTo({
      ...props,
      container,
      top: toTop,
      left: toLeft,
    })
      .then(resolve)
      .catch(reject);
  });
}
