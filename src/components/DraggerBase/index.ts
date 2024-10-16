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
 * Abstract class to handle drag and swipe events on elements or window.
 * Handles mouse and touch events, with runtime events to track dragging.
 *
 * @link See docs https://antonbobrov.github.io/vevet/classes/DraggerBase.html
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

  /**
   * The container element or window where the drag events occur.
   */
  protected _container: Element | Window;

  /**
   * Returns the dragger's container element or window.
   */
  get container() {
    return this._container;
  }

  /**
   * Stores runtime event listeners added during dragging.
   */
  protected _runtimeListeners: IAddEventListener[];

  /**
   * Indicates whether dragging is currently happening.
   */
  get isDragging() {
    return this._runtimeListeners.length > 0;
  }

  /**
   * Stores the pointer ID of the current drag operation.
   */
  protected _pointerID: number | null;

  /**
   * Returns the current pointer ID.
   */
  protected get pointerID() {
    return this._pointerID;
  }

  /**
   * The current coordinates of the pointer during dragging.
   */
  protected _coords: NDraggerBase.IVector2;

  /**
   * Returns the current pointer coordinates.
   */
  get coords() {
    return this._coords;
  }

  /**
   * Sets the current pointer coordinates.
   */
  protected set coords(value) {
    this._coords = value;
  }

  /**
   * The previous coordinates of the pointer before the current event.
   */
  protected _prevCoords: NDraggerBase.IVector2;

  /**
   * Returns the previous pointer coordinates.
   */
  get prevCoords() {
    return this._prevCoords;
  }

  /**
   * Sets the previous pointer coordinates.
   */
  protected set prevCoords(value) {
    this._prevCoords = value;
  }

  /**
   * The coordinates where the drag operation started.
   */
  protected _startCoords: NDraggerBase.IVector2;

  /**
   * Returns the starting pointer coordinates at the beginning of the drag.
   */
  get startCoords() {
    return this._startCoords;
  }

  /**
   * Timeout handler for handling drag end events.
   */
  protected _handleEndTimeout?: NodeJS.Timeout;

  /**
   * The type of drag event, either 'mouse' or 'touch'.
   */
  protected _type?: 'mouse' | 'touch';

  /**
   * Returns the type of event ('mouse' or 'touch') being handled.
   */
  get type() {
    return this._type;
  }

  /**
   * Styles injected to prevent user selection during dragging.
   */
  protected _fixStyles: HTMLStyleElement;

  constructor(initialProps?: StaticProps & ChangeableProps, canInit = true) {
    super(initialProps, false);

    // Get the dragger container
    this._container = selectOne(this.props.container)!;
    if (!isElement(this._container) && !isWindow(this._container)) {
      throw new Error('No container');
    }

    // Initialize default variables
    this._runtimeListeners = [];
    this._pointerID = null;
    this._coords = { x: 0, y: 0 };
    this._prevCoords = { x: 0, y: 0 };
    this._startCoords = { x: 0, y: 0 };

    // Set styles to prevent user-select during drag
    this._fixStyles = document.createElement('style');
    this._fixStyles.innerHTML = '* { user-select: none !important; }';

    if (canInit) {
      this.init();
    }
  }

  protected _init() {
    super._init();

    this._setEvents();
  }

  /**
   * Sets up the dragger events for mouse and touch start.
   */
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

  /**
   * Adds runtime events for mouseup, touchend, and other events during dragging.
   */
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

  /**
   * Removes runtime events after the drag operation ends or is canceled.
   */
  protected _removeRuntimeEvents() {
    this._runtimeListeners.forEach((listener) => listener.remove());

    this._runtimeListeners = [];
  }

  /**
   * Normalizes event coordinates based on the event type (mouse or touch).
   *
   * @param event - The event from which to extract coordinates.
   * @returns The pointer coordinates and pointer ID.
   */
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

  /**
   * Handles the start of a drag event.
   *
   * @param event - The event that initiated the drag (mouse or touch).
   * @returns A boolean indicating whether the drag started successfully.
   */
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

    // Update coordinates
    const { x, y, pointerId } = this._getEventCoords(event);
    this._coords = { x, y };
    this._prevCoords = { x, y };
    this._startCoords = { x, y };
    this._pointerID = pointerId;

    // Add runtime events for drag
    this._addRuntimeEvents();

    // Apply styles to prevent user-select
    getApp().body.append(this._fixStyles);

    // Trigger start callback
    this.callbacks.tbt('start', {
      event,
      start: this.startCoords,
      coords: this.coords,
    });

    return true;
  }

  /**
   * Handles the end of a drag event and initiates cleanup.
   *
   * @param event - The event that ended the drag (mouse or touch).
   */
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

  /**
   * Handles the cleanup process when dragging ends.
   *
   * @param event - The event that ended the drag.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _handleEnd(event: NDraggerBase.TEvent) {
    this.cancel();
  }

  /**
   * Cancels the current drag operation and removes runtime events and styles.
   */
  public cancel() {
    this._removeRuntimeEvents();

    // remove styles fix
    this._fixStyles.remove();

    // launch callbacks
    this.callbacks.tbt('end', undefined);
  }

  /**
   * Destroys the dragger component, removing events and cleaning up resources.
   */
  protected _destroy() {
    this.cancel();

    super._destroy();

    this._removeRuntimeEvents();

    if (this._handleEndTimeout) {
      clearTimeout(this._handleEndTimeout);
    }
  }
}
