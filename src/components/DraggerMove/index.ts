import { addEventListener } from 'vevet-dom';
import { DraggerBase, NDraggerBase } from '../DraggerBase';
import { NDraggerMove } from './types';

export type { NDraggerMove };

/**
 * `Dragger` with 'move' callbacks
 */
export class DraggerMove<
  StaticProps extends NDraggerMove.IStaticProps = NDraggerMove.IStaticProps,
  ChangeableProps extends NDraggerMove.IChangeableProps = NDraggerMove.IChangeableProps,
  CallbacksTypes extends NDraggerMove.ICallbacksTypes = NDraggerMove.ICallbacksTypes
> extends DraggerBase<StaticProps, ChangeableProps, CallbacksTypes> {
  protected _getDefaultProps() {
    return {
      ...super._getDefaultProps(),
      disablePointerEventsAt: false,
    };
  }

  /** Move step */
  get stepCoords() {
    return {
      x: this.coords.x - this.prevCoords.x,
      y: this.coords.y - this.prevCoords.y,
    };
  }

  /** Difference between start and current coords */
  get diffCoords() {
    return {
      x: this.coords.x - this.startCoords.x,
      y: this.coords.y - this.startCoords.y,
    };
  }

  /** Add runtime events */
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
        }
      )
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
        }
      )
    );
  }

  /** Event on move */
  protected _handleMove(event: NDraggerBase.TEvent) {
    const { x, y, pointerId } = this._getEventCoords(event);

    if (!this.isDragging || pointerId !== this.pointerID) {
      return false;
    }

    // update coordinates
    this.prevCoords = { x: this.coords.x, y: this.coords.y };
    this.coords = { x, y };

    // disable pointer events
    this._togglePointerEvents(false);

    // launch callbacks
    this.callbacks.tbt('move', {
      event,
      start: this.startCoords,
      coords: this.coords,
      step: this.stepCoords,
      diff: this.diffCoords,
    });

    return true;
  }

  /** Event on drag end */
  protected _handleEnd(event: NDraggerBase.TEvent) {
    super._handleEnd(event);

    this._togglePointerEvents(true);
  }

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

  /** Destroy the module */
  protected _destroy() {
    super._destroy();
  }
}
