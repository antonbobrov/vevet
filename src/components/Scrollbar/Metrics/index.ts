import { ModulePart } from '@/internal';

import { Scrollbar } from '..';
import { isSnap } from '../utils/isSnap';

/**
 * Scroll measurements for {@link Scrollbar}.
 *
 * Abstracts `window`, `HTMLElement`, and {@link Snap} sources for size,
 * scrollable range, current value, and layout dimensions.
 *
 * @internal
 */
export class ScrollbarMetrics extends ModulePart<Scrollbar> {
  /** Total content size along {@link Scrollbar.axis}. */
  get scrollSize() {
    const { scrollElement } = this.parent;

    if (isSnap(scrollElement)) {
      return scrollElement.max - scrollElement.min;
    }

    return this.parent.axis === 'x'
      ? scrollElement.scrollWidth
      : scrollElement.scrollHeight;
  }

  /** Distance the container can scroll along {@link Scrollbar.axis}. */
  get scrollableSize() {
    const { scrollElement } = this.parent;

    if (isSnap(scrollElement)) {
      return scrollElement.max - scrollElement.min;
    }

    return this.parent.axis === 'x'
      ? this.scrollSize - scrollElement.clientWidth
      : this.scrollSize - scrollElement.clientHeight;
  }

  /** Current scroll offset (or Snap `loopedCurrent`). */
  get scrollValue() {
    const { axis, container } = this.parent;

    if (isSnap(container)) {
      return container.loopedCurrent;
    }

    if (container instanceof Window) {
      return axis === 'x' ? window.scrollX : window.scrollY;
    }

    return axis === 'x' ? container.scrollLeft : container.scrollTop;
  }

  get trackSize() {
    const { parent } = this;

    return parent.axis === 'x'
      ? parent.track.offsetWidth
      : parent.track.offsetHeight;
  }

  get thumbSize() {
    const { parent } = this;

    return parent.axis === 'x'
      ? parent.thumb.offsetWidth
      : parent.thumb.offsetHeight;
  }
}
