import { addEventListener } from '@/utils/dom/addEventListener';
import { NDraggerBase } from './types';
import { Component as ComponentClass } from '@/base/Component';
import { isElement } from '@/utils/dom/isElement';
import { isWindow } from '@/utils/dom/isWindow';
import { selectOne } from '@/utils/dom/selectOne';
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
      isEnabled: true,
      preventDefault: true,
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
  protected _runtimeListeners: (() => void)[];

  /**
   * Indicates whether dragging is currently happening.
   */
  get isDragging() {
    return this._runtimeListeners.length > 0;
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
  protected _start: NDraggerBase.IVector2;

  /**
   * Returns the starting pointer coordinates at the beginning of the drag.
   */
  get start() {
    return this._start;
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
    this._coords = { x: 0, y: 0 };
    this._prevCoords = { x: 0, y: 0 };
    this._start = { x: 0, y: 0 };

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
      'pointerdown',
      (event) => this._handleStart(event),
      { passive: false },
    );

    this.addEventListener(
      this.container,
      'dragstart',
      (event) => event.preventDefault(),
      { passive: false },
    );
  }

  /**
   * Adds runtime events for mouseup, touchend, and other events during dragging.
   */
  protected _addRuntimeEvents() {
    this._runtimeListeners.push(
      addEventListener(window, 'pointerup', (event) => this._handleEnd(event), {
        passive: false,
      }),
    );

    this._runtimeListeners.push(
      addEventListener(
        window,
        'pointercancel',
        (event) => this._handleEnd(event),
        { passive: false },
      ),
    );

    this._runtimeListeners.push(
      addEventListener(window, 'blur', () => this._handleEnd(null), {
        passive: false,
      }),
    );
  }

  /**
   * Removes runtime events after the drag operation ends or is canceled.
   */
  protected _removeRuntimeEvents() {
    this._runtimeListeners.forEach((listener) => listener());

    this._runtimeListeners = [];
  }

  /**
   * Handles the start of a drag event.
   */
  protected _handleStart(event: PointerEvent) {
    if (!this.props.isEnabled || this.isDragging) {
      return;
    }

    // prevent right click
    if (event.button === 2) {
      return;
    }

    if (this.props.preventDefault) {
      event.preventDefault();
    }

    // Update coordinates
    const { clientX: x, clientY: y } = event;
    this._coords = { x, y };
    this._prevCoords = { x, y };
    this._start = { x, y };

    // Add runtime events for drag
    this._addRuntimeEvents();

    // reset selection
    window.getSelection()?.empty();
    window.getSelection()?.removeAllRanges();

    // Apply styles to prevent user-select
    getApp().body.append(this._fixStyles);

    // Trigger start callback
    this.callbacks.tbt('start', {
      event,
      start: this.start,
      coords: this.coords,
    });
  }

  /**
   * Handles the end of a drag event and initiates cleanup.
   */
  protected _handleEnd(event: PointerEvent | null) {
    this._removeRuntimeEvents();

    // Update coordinates
    if (event) {
      this._coords = { x: event.clientX, y: event.clientY };
    }

    // remove styles fix
    this._fixStyles.remove();

    // launch callbacks
    this.callbacks.tbt('end', undefined);
  }

  /**
   * Destroys the dragger component, removing events and cleaning up resources.
   */
  protected _destroy() {
    this._handleEnd(null);

    super._destroy();

    this._removeRuntimeEvents();
  }
}
