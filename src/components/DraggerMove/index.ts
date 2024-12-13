import { addEventListener } from '@/utils/dom/addEventListener';
import { DraggerBase, NDraggerBase } from '../DraggerBase';
import { NDraggerMove } from './types';
import { getApp } from '@/utils/internal/getApp';

export type { NDraggerMove };

/**
 * A draggable component that triggers 'move' callbacks during drag operations.
 * It extends the base `Dragger` functionality by providing movement-related data such as the step and difference in coordinates.
 *
 * @link See examples https://antonbobrov.github.io/vevet-demo/dragger-move/
 *
 * @link See docs https://antonbobrov.github.io/vevet/classes/DraggerMove.html
 */
export class DraggerMove<
  StaticProps extends NDraggerMove.IStaticProps = NDraggerMove.IStaticProps,
  ChangeableProps extends
    NDraggerMove.IChangeableProps = NDraggerMove.IChangeableProps,
  CallbacksTypes extends
    NDraggerMove.ICallbacksTypes = NDraggerMove.ICallbacksTypes,
> extends DraggerBase<StaticProps, ChangeableProps, CallbacksTypes> {
  protected _getDefaultProps() {
    return {
      ...super._getDefaultProps(),
      threshold: 5,
    };
  }

  /** Remember scroll values on start */
  protected _startScroll = { top: 0, left: 0 };

  /** If move callback is being called */
  protected _isMoving = false;

  /**
   * Returns the difference between the current pointer coordinates and the previous coordinates (the step of movement).
   */
  get step() {
    return {
      x: this.coords.x - this.prevCoords.x,
      y: this.coords.y - this.prevCoords.y,
    };
  }

  /**
   * Returns the difference between the starting coordinates and the current coordinates.
   */
  get diff() {
    return {
      x: this.coords.x - this.start.x,
      y: this.coords.y - this.start.y,
    };
  }

  /**
   * Stores the total absolute movement.
   */
  protected _total: NDraggerBase.IVector2 = { x: 0, y: 0 };

  /**
   * Returns the total absolute movement.
   */
  get total() {
    return this._total;
  }

  /**
   * Adds runtime events to track pointer movement (for both mouse and touch events).
   * Triggers the `move` callback during the drag to provide updates about the movement.
   */
  protected _addRuntimeEvents() {
    super._addRuntimeEvents();

    this._runtimeListeners.push(
      addEventListener(
        window,
        'pointermove',
        (event) => this._handleMove(event),
        { passive: false },
      ),
    );
  }

  /**
   * Handles the start of a drag event.
   */
  protected _handleStart(event: PointerEvent) {
    super._handleStart(event);

    // Remember scroll values on start
    this._startScroll = {
      top: window.scrollY,
      left: window.scrollX,
    };
  }

  /**
   * Handles the movement during dragging, updating the current coordinates and calculating the step and total movement.
   *
   * @param event - The event representing the movement (either `MouseEvent` or `TouchEvent`).
   */
  protected _handleMove(event: PointerEvent) {
    const { clientX: x, clientY: y } = event;
    const { threshold } = this.props;

    // get scroll values
    const currentScroll = {
      top: window.scrollY,
      left: window.scrollX,
    };
    const startScroll = this._startScroll;

    // Update previous and current coordinates
    this.prevCoords = { x: this.coords.x, y: this.coords.y };
    this.coords = { x, y };

    // Update total movement
    this._total.x += Math.abs(this.step.x);
    this._total.y += Math.abs(this.step.y);

    // check trheshold
    if (
      threshold &&
      Math.sqrt(this.total.x ** 2 + this.total.y ** 2) < threshold ** 2
    ) {
      return;
    }

    // check if scrolling at the moment
    if (
      getApp().isMobile &&
      (startScroll.top !== currentScroll.top ||
        startScroll.left !== currentScroll.left)
    ) {
      return;
    }

    // moving
    if (!this._isMoving) {
      this._isMoving = true;

      this._start = { x, y };
      this._prevCoords = { x, y };
    }

    // prevent defaults

    if (this.props.preventDefault) {
      event.preventDefault();
    }

    // Optionally disable pointer events during movement
    this._togglePointerEvents(false);

    // Trigger 'move' callback with relevant data
    this.callbacks.tbt('move', {
      event,
      start: this.start,
      coords: this.coords,
      step: this.step,
      diff: this.diff,
      total: this.total,
    });
  }

  /**
   * Handles the end of a drag event and initiates cleanup.
   */
  protected _handleEnd() {
    super._handleEnd(null);

    // Reset
    this._total = { x: 0, y: 0 };
    this._isMoving = false;

    // Re-enable pointer events
    this._togglePointerEvents(true);
  }

  /** Cancel dragging */
  public cancel() {
    this._handleEnd();
  }

  /**
   * Toggles pointer events on or off.
   *
   * @param isEnabled - If true, pointer events will be re-enabled.
   */
  protected _togglePointerEvents(isEnabled: boolean) {
    if (!(this.container instanceof HTMLElement)) {
      return;
    }

    const { total } = this;
    const { threshold } = this.props;

    const isEnoughToBlockListeners = total.x > threshold || total.y > threshold;

    const isDisabled = isEnabled ? false : isEnoughToBlockListeners;

    this.container.style.pointerEvents = isDisabled ? 'none' : '';
  }
}
