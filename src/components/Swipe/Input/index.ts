import { initVevet } from '@/global/initVevet';
import { ModulePart } from '@/shared/ModulePart';
import { addEventListener } from '@/utils';

import { Swipe } from '..';
import { Pointers } from '../../Pointers';

import { ISwipeInputHandlers } from './types';

/**
 * Bridges {@link Pointers}, container `touchstart`, and window move listeners.
 *
 * Movement samples are read from {@link Pointers.move} on each window
 * `touchmove` / `mousemove` (not from `pointermove` directly). This supports
 * `preventTouchMove`, `requireCtrlKey`, and coalesced touch events.
 *
 * Two `pointers.on('end')` handlers are intentional:
 * - session-scoped — full gesture end pipeline
 * - global — bounce when swipe never activated
 *
 * @internal
 */
export class SwipeInput extends ModulePart<Swipe> {
  private _pointers: Pointers;

  constructor(
    parent: Swipe,
    private _handlers: ISwipeInputHandlers,
  ) {
    super(parent);

    const { props } = this;
    const { container, thumb, buttons, pointers } = props;

    this._pointers = new Pointers({
      container: thumb || container,
      buttons,
      minPointers: pointers,
      maxPointers: pointers,
      relative: false,
      enabled: props.enabled,
      disableUserSelect: props.disableUserSelect,
    });

    this.onDestroy(() => this._pointers.destroy());

    this._pointers.on('start', () => this._handlePointersStart());

    this._pointers.on('pointerdown', (data) =>
      this.callbacks.emit('pointerdown', data),
    );

    this._pointers.on('pointermove', (data) =>
      this.callbacks.emit('pointermove', data),
    );

    this._pointers.on('pointerup', (data) =>
      this.callbacks.emit('pointerup', data),
    );

    this._pointers.on('end', () => this._handlers.onPointersEnd());

    this.onDestroy(
      addEventListener(
        container,
        'touchstart',
        (event) => this._handleTouchStart(event),
        { passive: false },
      ),
    );
  }

  /** Underlying pointer tracker. */
  get pointers() {
    return this._pointers;
  }

  /** Latest aggregated pointer center, or `undefined`. */
  get moveCenter() {
    return this._pointers.move?.center;
  }

  public updateEnabled() {
    this._pointers.updateProps({ enabled: this.props.enabled });
  }

  private _handleTouchStart(event: TouchEvent) {
    if (!this.props.enabled) {
      return;
    }

    this._preventEdgeSwipe(event);

    this.callbacks.emit('touchstart', event);
  }

  private _preventEdgeSwipe(event: TouchEvent) {
    // Blocks iOS edge back-swipe when `preventEdgeSwipe` is enabled.
    const { props } = this;

    if (!props.preventEdgeSwipe) {
      return;
    }

    const threshold = props.edgeSwipeThreshold;
    const x = event.targetTouches[0].pageX;

    const shouldPrevent = x <= threshold || x >= initVevet().width - threshold;

    if (event.cancelable && shouldPrevent) {
      event.preventDefault();

      this.callbacks.emit('preventEdgeSwipe', undefined);
    }
  }

  private _handlePointersStart() {
    this._handlers.onSessionStart();

    const touchmove = addEventListener(
      window,
      'touchmove',
      (event) => this._handleTouchMove(event),
      { passive: false },
    );

    const mousemove = addEventListener(window, 'mousemove', (event) =>
      this._handleMouseMove(event),
    );

    const end = this._pointers.on('end', () => {
      this._handlers.onGestureEnd();

      end();
      touchmove();
      mousemove();
    });

    this.onDestroy(() => {
      end();
      touchmove();
      mousemove();
    });
  }

  private _handleTouchMove(event: TouchEvent) {
    this.callbacks.emit('touchmove', event);

    if (
      this.parent.isSwiping &&
      this.props.preventTouchMove &&
      event.cancelable
    ) {
      event.preventDefault();
    }

    this._handlers.onMove('touch');
  }

  private _handleMouseMove(event: MouseEvent) {
    if (this.props.requireCtrlKey && !event.ctrlKey) {
      return;
    }

    this.callbacks.emit('mousemove', event);

    this._handlers.onMove('mouse');
  }
}
