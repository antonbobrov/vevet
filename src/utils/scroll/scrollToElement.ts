import { selectOne } from 'vevet-dom';
import { getScrollValues } from './getScrollValues';
import { clamp } from '../math/clamp';
import { IScrollToProps, scrollTo } from './scrollTo';

export interface IScrollToElementProps extends IScrollToProps {
  /**
   * The target element
   */
  element: Element | string;
}

/**
 * Scroll to element
 *
 * @example
 *
 * // static duration
 * scrollToElement({
 *   container: window,
 *   element: document.getElementById('element_20')!,
 *   top: 60,
 *   duration: 500,
 * });
 *
 * // dynamic duration
 * scrollToElement({
 *   element: document.getElementById('element_20')!,
 *   top: 60,
 *   duration: (px) => px,
 * });
 *
 * // use promise
 * scrollToElement({
 *   element: document.getElementById('element_20')!,
 *   top: 60,
 * })
 *   .then(() => console.log('done'))
 *   .catch(() => {});
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
