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
