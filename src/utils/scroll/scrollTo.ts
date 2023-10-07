import { IScrollLike } from '@/types/general';
import { getScrollValues } from './getScrollValues';
import { Timeline } from '@/components/Timeline';

export interface IScrollToProps {
  /**
   * @default window
   */
  container?: Window | Element | IScrollLike;
  /**
   * top padding
   * @default 0
   */
  top?: number;
  /**
   * left padding
   * @default 0
   */
  left?: number;
  /**
   * Scroll duration. Number (ms) of function (ms).
   * @default 250
   */
  duration?: number | ((lengthPx: number) => number);
}

/**
 * Scroll to coordinates
 *
 * @example
 *
 * // static duration
 * scrollTo({
 *   container: window,
 *   top: 500,
 *   duration: 500,
 * });
 *
 * // dynamic duration
 * scrollTo({
 *   top: 1000,
 *   duration: (px) => px,
 * });
 *
 * // use promise
 * scrollTo({ top: 500 })
 *   .then(() => console.log('done'))
 *   .catch(() => {});
 */
export function scrollTo({
  container = window,
  top = 0,
  left = 0,
  duration: durationProp = 250,
}: IScrollToProps) {
  return new Promise<void>((resolve, reject) => {
    const startValues = getScrollValues(container);

    if (!startValues) {
      reject();

      return;
    }

    const topDiff = top - startValues.scrollTop;
    const leftDiff = left - startValues.scrollLeft;

    const lengthPx = Math.max(Math.abs(topDiff), Math.abs(leftDiff));

    const finalDuration =
      typeof durationProp === 'number' ? durationProp : durationProp(lengthPx);

    const timeline = new Timeline({
      duration: finalDuration,
      shouldDestroyOnEnd: true,
    });

    timeline.addCallback('progress', ({ easing }) => {
      if (!container) {
        return;
      }

      container.scrollTo({
        top: startValues.scrollTop + topDiff * easing,
        left: startValues.scrollLeft + leftDiff * easing,
        behavior: 'auto',
      });
    });

    timeline.addCallback('end', () => resolve());

    timeline.play();
  });
}
