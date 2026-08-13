import { Swipe } from '@/components/Swipe';
import { ISwipeCoords } from '@/components/Swipe/global';
import { ModulePart } from '@/internal';
import { clamp } from '@/utils';

import { Scrollbar } from '..';
import { isSnap } from '../utils/isSnap';

/**
 * Thumb drag via {@link Swipe} on {@link Scrollbar.thumb}.
 *
 * Maps pointer delta to scroll position (`scrollTo` or Snap `setTarget`).
 * Move events on the thumb are stopped from bubbling to the page scroll layer.
 *
 * @internal
 */
export class ScrollbarDrag extends ModulePart<Scrollbar> {
  private _valueOnStart = 0;

  constructor(
    parent: Scrollbar,
    private _rtl: boolean,
  ) {
    super(parent);

    const { thumb } = this.parent;

    const swipe = new Swipe({ container: thumb, grabCursor: true });

    swipe.on('start', (coord) => this._handleStart(coord));
    swipe.on('move', (coord) => this._handleMove(coord));
    swipe.on('end', (coord) => this._handleEnd(coord));
    swipe.on('touchmove', (event) => this._handleTouchMove(event));
    swipe.on('mousemove', (event) => this._handleMouseMove(event));

    this.onDestroy(() => swipe.destroy());
  }

  private _handleStart(coords: ISwipeCoords) {
    const { container, scrollValue } = this.parent;

    if (isSnap(container)) {
      this._valueOnStart = container.target;
    } else {
      this._valueOnStart = scrollValue;
    }

    this.callbacks.emit('swipeStart', coords);
  }

  private _handleMove(coords: ISwipeCoords) {
    this._onMove(coords);
    this.callbacks.emit('swipe', coords);
  }

  private _handleEnd(coords: ISwipeCoords) {
    this.callbacks.emit('swipeEnd', coords);
  }

  private _handleTouchMove(event: TouchEvent) {
    event.stopPropagation();
    event.stopImmediatePropagation();
  }

  private _handleMouseMove(event: MouseEvent) {
    event.stopPropagation();
    event.stopImmediatePropagation();
  }

  private _onMove(data: ISwipeCoords) {
    const { scrollElement, axis, trackSize, thumbSize, scrollableSize } =
      this.parent;

    const valueOnStart = this._valueOnStart;
    const diff = axis === 'x' ? data.diff.x : data.diff.y;
    let iterator = (diff / (trackSize - thumbSize)) * scrollableSize;

    if (isSnap(scrollElement)) {
      iterator = this._rtl ? -iterator : iterator;

      const { min, max } = scrollElement;
      const trackLength = scrollElement.max - scrollElement.min;
      const loopCount = scrollElement.props.loop ? scrollElement.loopCount : 0;

      const target = clamp(
        valueOnStart + iterator,
        min + trackLength * loopCount,
        max + trackLength * loopCount,
      );

      scrollElement.setTarget(target);
    } else {
      const target = valueOnStart + iterator;

      scrollElement.scrollTo({
        top: axis === 'y' ? target : undefined,
        left: axis === 'x' ? target : undefined,
        behavior: 'instant',
      });
    }
  }
}
