import type { Snap } from '@/components/Snap';
import { cnToggle } from '@/internal/cn';
import { ModulePart } from '@/shared/ModulePart';
import { clamp, onResize, toPixels } from '@/utils';

import { Scrollbar } from '..';
import { isSnap } from '../utils/isSnap';

/**
 * Thumb sizing and resize observation for {@link Scrollbar}.
 *
 * Listens to Snap `resize` or `onResize` + `MutationObserver` on DOM
 * containers, toggles `_empty`, updates thumb dimensions, then notifies the
 * parent to render.
 *
 * @internal
 */
export class ScrollbarResizer extends ModulePart<Scrollbar> {
  constructor(
    parent: Scrollbar,
    private _onResize: () => void,
  ) {
    super(parent);

    const { scrollElement } = this.parent;

    if (isSnap(scrollElement)) {
      this._setSnapResize(scrollElement);
    } else {
      this._setNativeResize();
    }
  }

  private _setSnapResize(snap: Snap) {
    this.resize();

    const destruct = snap.on('resize', () => this.resize());

    this.onDestroy(() => destruct());
  }

  private _setNativeResize() {
    const { track, parent } = this.parent;
    const scrollElement = this.parent.scrollElement as HTMLElement;

    const createResizeHandler = () => {
      const children = Array.from(scrollElement.children);

      return onResize({
        element: [track, parent, scrollElement, ...children],
        viewportTarget: 'width',
        resizeDebounce: this.props.resizeDebounce,
        callback: () => this.resize(),
      });
    };

    let resizeHandler = createResizeHandler();
    resizeHandler.resize();

    const childrenObserver = new MutationObserver(() => {
      resizeHandler.remove();
      resizeHandler = createResizeHandler();
      resizeHandler.debounceResize();
    });

    childrenObserver.observe(scrollElement, { childList: true });

    this.onDestroy(() => {
      resizeHandler.remove();
      childrenObserver.disconnect();
    });
  }

  /** Recomputes thumb size and triggers a parent render. */
  public resize() {
    const { scrollSize, outer, track, thumb, props, axis, scrollableSize } =
      this.parent;
    const { autoSize: shouldAutoSize } = props;
    const isHorizontal = axis === 'x';

    cnToggle(outer, this._cn('_empty'), scrollableSize === 0);

    const trackSize = isHorizontal ? track.offsetWidth : track.offsetHeight;

    const minThumbSize = toPixels(props.minSize);
    let newThumbSize = minThumbSize;

    if (shouldAutoSize) {
      newThumbSize = clamp(
        trackSize / (scrollSize / trackSize),
        minThumbSize,
        Infinity,
      );
    }

    if (isHorizontal) {
      thumb.style.width = `${newThumbSize}px`;
    } else {
      thumb.style.height = `${newThumbSize}px`;
    }

    this._onResize();
  }
}
