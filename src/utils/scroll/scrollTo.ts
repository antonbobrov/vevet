import { IScrollLike } from '@/types/general';
import { getScrollValues } from './getScrollValues';
import { Timeline } from '@/components/Timeline';

export interface IScrollToProps {
  /**
   * The container to scroll (window, element, or custom scroll-like object)
   * @default window
   */
  container?: Window | Element | IScrollLike;

  /**
   * The target top position to scroll to, with optional padding.
   * @default 0
   */
  top?: number;

  /**
   * The target left position to scroll to, with optional padding.
   * @default 0
   */
  left?: number;

  /**
   * The duration of the scroll animation in milliseconds.
   * Can be either a fixed number or a function that takes the scroll distance and returns the duration.
   * @default 250
   */
  duration?: number | ((lengthPx: number) => number);
}

/**
 * Smoothly scroll to the specified top and left coordinates inside the given container.
 * Supports promises to handle the end of the scroll animation.
 *
 * @example
 *
 * // Scroll with a static duration
 * scrollTo({
 *   container: window,
 *   top: 500,
 *   duration: 500,
 * });
 *
 * // Scroll with a dynamic duration based on distance
 * scrollTo({
 *   top: 1000,
 *   duration: (px) => px,
 * });
 *
 * // Use promise to handle when the scroll finishes
 * scrollTo({ top: 500 })
 *   .then(() => console.log('Scroll complete'))
 *   .catch(() => console.error('Scroll failed'));
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
      isDestroyedOnEnd: true,
    });

    timeline.addCallback('progress', ({ e }) => {
      if (!container) {
        return;
      }

      container.scrollTo({
        top: startValues.scrollTop + topDiff * e,
        left: startValues.scrollLeft + leftDiff * e,
        behavior: 'auto',
      });
    });

    timeline.addCallback('end', () => resolve());

    timeline.play();
  });
}
