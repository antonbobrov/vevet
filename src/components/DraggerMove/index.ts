import { addEventListener } from 'vevet-dom';
import { DraggerBase, NDraggerBase } from '../DraggerBase';
import { NDraggerMove } from './types';

export type { NDraggerMove };

/**
 * A draggable component that triggers 'move' callbacks during drag operations.
 * It extends the base `Dragger` functionality by providing movement-related data such as the step and difference in coordinates.
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
      disablePointerEventsAt: false,
    };
  }

  /**
   * Returns the difference between the current pointer coordinates and the previous coordinates (the step of movement).
   */
  get stepCoords() {
    return {
      x: this.coords.x - this.prevCoords.x,
      y: this.coords.y - this.prevCoords.y,
    };
  }

  /**
   * Returns the difference between the starting coordinates and the current coordinates.
   */
  get diffCoords() {
    return {
      x: this.coords.x - this.startCoords.x,
      y: this.coords.y - this.startCoords.y,
    };
  }

  /**
   * Stores the absolute difference between the start coordinates and the current coordinates during dragging.
   */
  protected _absDiff: NDraggerBase.IVector2 = { x: 0, y: 0 };

  /**
   * Returns the absolute difference in coordinates (the total movement made) during dragging.
   */
  get absDiff() {
    return this._absDiff;
  }

  /**
   * Adds runtime events to track pointer movement (for both mouse and touch events).
   * Triggers the `move` callback during the drag to provide updates about the movement.
   */
  protected _addRuntimeEvents() {
    super._addRuntimeEvents();

    const { isPassive } = this.props;

    this._runtimeListeners.push(
      addEventListener(
        window,
        'mousemove',
        (event) => {
          if (this.type === 'mouse') {
            this._handleMove(event);
          }
        },
        {
          passive: isPassive,
        },
      ),
    );

    this._runtimeListeners.push(
      addEventListener(
        window,
        'touchmove',
        (event) => {
          if (this.type === 'touch') {
            this._handleMove(event);
          }
        },
        {
          passive: isPassive,
        },
      ),
    );
  }

  /**
   * Handles the movement during dragging, updating the current coordinates and calculating the step and total movement.
   * Disables pointer events if necessary based on the `disablePointerEventsAt` threshold.
   *
   * @param event - The event representing the movement (either `MouseEvent` or `TouchEvent`).
   */
  protected _handleMove(event: NDraggerBase.TEvent) {
    const { x, y, pointerId } = this._getEventCoords(event);

    if (!this.isDragging || pointerId !== this.pointerID) {
      return false;
    }

    // Update previous and current coordinates
    this.prevCoords = { x: this.coords.x, y: this.coords.y };
    this.coords = { x, y };

    // Update absolute difference in movement
    this._absDiff.x += Math.abs(this.stepCoords.x);
    this._absDiff.y += Math.abs(this.stepCoords.y);

    // Optionally disable pointer events during movement
    this._togglePointerEvents(false);

    // Trigger 'move' callback with relevant data
    this.callbacks.tbt('move', {
      event,
      start: this.startCoords,
      coords: this.coords,
      step: this.stepCoords,
      diff: this.diffCoords,
      absDiff: this.absDiff,
    });

    return true;
  }

  /**
   * Handles the end of the drag operation, resetting the absolute difference in coordinates.
   * Re-enables pointer events if they were disabled during movement.
   *
   * @param event - The event representing the end of the drag (either `MouseEvent` or `TouchEvent`).
   */
  protected _handleEnd(event: NDraggerBase.TEvent) {
    super._handleEnd(event);

    // Reset absolute movement difference
    this._absDiff = { x: 0, y: 0 };

    // Re-enable pointer events
    this._togglePointerEvents(true);
  }

  /**
   * Toggles pointer events on or off based on the movement threshold defined by `disablePointerEventsAt`.
   *
   * @param isEnabledProp - If true, pointer events will be re-enabled.
   */
  protected _togglePointerEvents(isEnabledProp: boolean) {
    if (typeof this.props.disablePointerEventsAt !== 'number') {
      return;
    }

    if (!(this.container instanceof HTMLElement)) {
      return;
    }

    const isEnabled =
      (Math.abs(this.diffCoords.x) < this.props.disablePointerEventsAt &&
        Math.abs(this.diffCoords.y) < this.props.disablePointerEventsAt) ||
      isEnabledProp;

    this.container.style.pointerEvents = isEnabled ? '' : 'none';
  }

  /**
   * Destroys the dragger, cleaning up all associated events and resources.
   */
  protected _destroy() {
    super._destroy();
  }
}
