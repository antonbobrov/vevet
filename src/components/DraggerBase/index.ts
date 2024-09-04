import {
  IAddEventListener,
  addEventListener,
  isElement,
  isWindow,
  selectOne,
} from 'vevet-dom';
import { NDraggerBase } from './types';
import { Component as ComponentClass } from '@/base/Component';
import { getApp } from '@/utils/internal/getApp';

export type { NDraggerBase };

/**
 * Drag & Swipe events
 */
export abstract class DraggerBase<
  StaticProps extends NDraggerBase.IStaticProps = NDraggerBase.IStaticProps,
  ChangeableProps extends
    NDraggerBase.IChangeableProps = NDraggerBase.IChangeableProps,
  CallbacksTypes extends
    NDraggerBase.ICallbacksTypes = NDraggerBase.ICallbacksTypes,
> extends ComponentClass<StaticProps, ChangeableProps, CallbacksTypes> {
  protected _getDefaultProps() {
    return {
      ...super._getDefaultProps(),
      container: `#${this.prefix}`,
      isPassive: false,
      isEnabled: true,
    };
  }

  get prefix() {
    return `${getApp().prefix}dragger`;
  }

  /** Preloader container */
  protected _container: Element | Window;

  /** Preloader container */
  get container() {
    return this._container;
  }

  /** Runtime events */
  protected _runtimeListeners: IAddEventListener[];

  /** Dragging at the moment */
  get isDragging() {
    return this._runtimeListeners.length > 0;
  }

  /** Current pointer id */
  protected _pointerID: number | null;

  /** Current pointer id */
  protected get pointerID() {
    return this._pointerID;
  }

  /** Current coordinates */
  protected _coords: NDraggerBase.IVector2;

  /** Current coordinates */
  get coords() {
    return this._coords;
  }

  /** Current coordinates */
  protected set coords(value) {
    this._coords = value;
  }

  /** Last coordinates */
  protected _prevCoords: NDraggerBase.IVector2;

  /** Last coordinates */
  get prevCoords() {
    return this._prevCoords;
  }

  /** Last coordinates */
  protected set prevCoords(value) {
    this._prevCoords = value;
  }

  /** Coordinates on drag start */
  protected _startCoords: NDraggerBase.IVector2;

  /** Coordinates on drag start */
  get startCoords() {
    return this._startCoords;
  }

  /** Timeout of `handleEnd` */
  protected _handleEndTimeout?: NodeJS.Timeout;

  /** Current event type */
  protected _type?: 'mouse' | 'touch';

  /** Current event type */
  get type() {
    return this._type;
  }

  /** Styles to prevent user-select */
  protected _fixStyles: HTMLStyleElement;

  constructor(initialProps?: StaticProps & ChangeableProps, canInit = true) {
    super(initialProps, false);

    this._container = selectOne(this.props.container)!;
    if (!isElement(this._container) && !isWindow(this._container)) {
      throw new Error('No container');
    }

    // set default vars
    this._runtimeListeners = [];
    this._pointerID = null;
    this._coords = { x: 0, y: 0 };
    this._prevCoords = { x: 0, y: 0 };
    this._startCoords = { x: 0, y: 0 };

    // set fix styles
    this._fixStyles = document.createElement('style');
    this._fixStyles.innerHTML = `
      * { user-select: none !important; }
    `;

    if (canInit) {
      this.init();
    }
  }

  protected _init() {
    super._init();

    this._setEvents();
  }

  /** Set dragger events */
  protected _setEvents() {
    this.addEventListener(
      this.container,
      'mousedown',
      (event) => this._handleStart(event),
      { passive: this.props.isPassive },
    );

    this.addEventListener(
      this.container,
      'touchstart',
      (event) => this._handleStart(event),
      { passive: this.props.isPassive },
    );
  }

  /** Add runtime events */
  protected _addRuntimeEvents() {
    const { isPassive } = this.props;

    this._runtimeListeners.push(
      addEventListener(window, 'mouseup', (event) => this.handleEnd(event), {
        passive: isPassive,
      }),
    );

    this._runtimeListeners.push(
      addEventListener(window, 'touchend', (event) => this.handleEnd(event), {
        passive: isPassive,
      }),
    );

    this._runtimeListeners.push(
      addEventListener(window, 'touchcancel', () => this.cancel(), {
        passive: isPassive,
      }),
    );

    this._runtimeListeners.push(
      addEventListener(window, 'blur', () => this.cancel(), {
        passive: isPassive,
      }),
    );
  }

  /** Remove runtime events */
  protected _removeRuntimeEvents() {
    this._runtimeListeners.forEach((listener) => listener.remove());

    this._runtimeListeners = [];
  }

  /** Get normalized event coordinates */
  protected _getEventCoords(event: NDraggerBase.TEvent) {
    if (event.type.includes('touch')) {
      const evt = event as TouchEvent;
      const touch = evt.targetTouches[0] || evt.changedTouches[0];

      return {
        x: touch.clientX,
        y: touch.clientY,
        pointerId: touch.identifier,
      };
    }

    const evt = event as MouseEvent;

    return {
      x: evt.clientX,
      y: evt.clientY,
      pointerId: null,
    };
  }

  /** Event on drag start */
  protected _handleStart(event: NDraggerBase.TEvent) {
    if (!this.props.isEnabled || this.isDragging) {
      return false;
    }

    if (event.type === 'touchstart') {
      this._type = 'touch';
    } else {
      this._type = 'mouse';
    }

    if (event.type === 'mousedown') {
      if (event.which === 1) {
        event.stopPropagation();
      } else {
        return false;
      }
    }

    // update coordinates
    const { x, y, pointerId } = this._getEventCoords(event);
    this._coords = { x, y };
    this._prevCoords = { x, y };
    this._startCoords = { x, y };
    this._pointerID = pointerId;

    // add runtime events
    this._addRuntimeEvents();

    // add styles fix
    getApp().body.append(this._fixStyles);

    // launch callbacks
    this.callbacks.tbt('start', {
      event,
      start: this.startCoords,
      coords: this.coords,
    });

    return true;
  }

  /** Event on drag end */
  protected handleEnd(event: NDraggerBase.TEvent) {
    if (this._handleEndTimeout) {
      return;
    }

    this._handleEndTimeout = setTimeout(() => {
      const { pointerId } = this._getEventCoords(event);

      if (!this.isDragging || pointerId !== this.pointerID) {
        return;
      }

      this._handleEnd(event);

      this._handleEndTimeout = undefined;
    }, 1);
  }

  /** Event on drag end */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _handleEnd(event: NDraggerBase.TEvent) {
    this.cancel();
  }

  /** Cancel dragging */
  public cancel() {
    this._removeRuntimeEvents();

    // remove styles fix
    this._fixStyles.remove();

    // launch callbacks
    this.callbacks.tbt('end', undefined);
  }

  /** Destroy the module */
  protected _destroy() {
    this.cancel();

    super._destroy();

    this._removeRuntimeEvents();

    if (this._handleEndTimeout) {
      clearTimeout(this._handleEndTimeout);
    }
  }
}
