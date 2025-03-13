import { Module } from '@/base';
import {
  IPointersCallbacksMap,
  IPointersItem,
  IPointersMutableProps,
  IPointersStaticProps,
} from './types';
import { TRequiredProps } from '@/internal/requiredProps';
import { addEventListener, clamp } from '@/utils';
import { initVevet } from '@/global/initVevet';
import { styles } from './styles';

export * from './types';

/**
 * Manages pointer events, including tracking multiple pointers,
 * and emitting callbacks for pointer interactions.
 *
 * For proper functionality, ensure the container has an appropriate
 * [touch-action](https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action) property.
 *
 * [Documentation](https://antonbobrov.github.io/vevet/docs/components/Pointers)
 *
 * @group Components
 */
export class Pointers<
  CallbacksMap extends IPointersCallbacksMap = IPointersCallbacksMap,
  StaticProps extends IPointersStaticProps = IPointersStaticProps,
  MutableProps extends IPointersMutableProps = IPointersMutableProps,
> extends Module<CallbacksMap, StaticProps, MutableProps> {
  /**
   * Returns the default static properties.
   */
  public _getStatic(): TRequiredProps<StaticProps> {
    return {
      ...super._getStatic(),
      buttons: [0],
      relative: false,
      minPointers: 1,
      maxPointers: 5,
      disableUserSelect: true,
    } as TRequiredProps<StaticProps>;
  }

  /**
   * Returns the default mutable properties.
   */
  public _getMutable(): TRequiredProps<MutableProps> {
    return {
      ...super._getMutable(),
      enabled: true,
    } as TRequiredProps<MutableProps>;
  }

  /**
   * Stores active event listeners for runtime interactions.
   */
  protected _listeners: (() => void)[] = [];

  /** Indicates whether the `start` event has been triggered. */
  protected _isStarted = false;

  /** Indicates whether the `start` event has been triggered. */
  get isStarted() {
    return this._isStarted;
  }

  /** Map of active pointers. */
  protected _pointersMap: Map<number, IPointersItem>;

  /** Returns the map of active pointers. */
  get pointersMap() {
    return this._pointersMap;
  }

  /** Returns the container element handling events. */
  get container() {
    return this.props.container;
  }

  /** Returns the minimum number of pointers required to trigger events. */
  get minPointers() {
    return clamp(this.props.minPointers, 1, Infinity);
  }

  /** Returns the maximum number of pointers that can be tracked. */
  get maxPointers() {
    return clamp(this.props.maxPointers, this.props.minPointers, Infinity);
  }

  constructor(props?: StaticProps & MutableProps) {
    super(props);

    // Defaults
    this._pointersMap = new Map();

    // Setup base events
    this._setBaseEvents();
  }

  /**
   * Attaches base event listeners to the container.
   */
  protected _setBaseEvents() {
    const { container } = this;

    const pointerdown = addEventListener(container, 'pointerdown', (event) =>
      this._handlePointerDown(event),
    );

    const dragstart = addEventListener(
      container,
      'dragstart',
      (event) => event.preventDefault(),
      { passive: false },
    );

    const centralMouseDown = addEventListener(
      container,
      'mousedown',
      (event) => {
        if (this.props.buttons.includes(1)) {
          event.preventDefault();
        }
      },
      { passive: false },
    );

    const contextmenu = addEventListener(
      container,
      'contextmenu',
      (event) => {
        if (this.props.buttons.includes(2)) {
          event.preventDefault();
        }
      },
      { passive: false },
    );

    this.onDestroy(() => {
      pointerdown();
      dragstart();
      centralMouseDown();
      contextmenu();
    });
  }

  /**
   * Attaches runtime event listeners for active pointer interactions.
   */
  protected _setRuntimeEvents() {
    const listeners = this._listeners;

    if (listeners.length > 0) {
      return;
    }

    const pointermove = addEventListener(
      window,
      'pointermove',
      (event) => this._handlePointerMove(event),
      { passive: false },
    );

    const pointerup = addEventListener(
      window,
      'pointerup',
      (event) => this._handlePointerUp(event),
      { passive: false },
    );

    const pointercancel = addEventListener(
      window,
      'pointercancel',
      () => this._handleCancel(),
      { passive: false },
    );

    const blur = addEventListener(window, 'blur', () => this._handleCancel());

    this._listeners = [pointermove, pointerup, pointercancel, blur];
  }

  /**
   * Handles pointer down events (`pointerdown`).
   * Adds a new pointer if conditions are met and triggers the `pointerdown` callback.
   */
  protected _handlePointerDown(event: PointerEvent) {
    const { props } = this;
    const { x, y } = this._decodeCoords(event);

    if (!props.enabled) {
      return;
    }

    // check if button type is allowed
    if (!props.buttons.includes(event.button)) {
      return;
    }

    // Check if pointer already exists or no more pointers allowed
    const hasPointer = this.pointersMap.get(event.pointerId);
    if (hasPointer || this.pointersMap.size >= this.maxPointers) {
      return;
    }

    // Add new pointer
    const pointer: IPointersItem = {
      id: event.pointerId,
      index: this.pointersMap.size,
      start: { x, y },
      prev: { x, y },
      current: { x, y },
      diff: { x: 0, y: 0 },
      step: { x: 0, y: 0 },
      accum: { x: 0, y: 0 },
    };
    this.pointersMap.set(event.pointerId, pointer);

    // update indices
    let index = 0;
    this.pointersMap.forEach((currentPointer) => {
      // eslint-disable-next-line no-param-reassign
      currentPointer.index = index;
      index += 1;
    });

    // Start callback
    if (this.pointersMap.size === this.minPointers) {
      this._isStarted = true;
      this.callbacks.emit('start', undefined);
    }

    // Add runtime events
    this._setRuntimeEvents();

    // Apply styles to prevent user-select
    if (props.disableUserSelect) {
      initVevet().body.append(styles!);
    }

    // Trigger start callback
    this.callbacks.emit('pointerdown', { event, pointer });
  }

  /**
   * Handles pointer movement (`pointermove`).
   * Updates pointer positions and triggers the `pointermove` callback.
   */
  protected _handlePointerMove(event: PointerEvent) {
    const pointer = this.pointersMap.get(event.pointerId);
    if (!pointer) {
      return;
    }

    const { x, y } = this._decodeCoords(event);

    // Update previous and current coordinates
    pointer.prev = { ...pointer.current };
    pointer.current = { x, y };

    // Update step
    pointer.step.x = pointer.current.x - pointer.prev.x;
    pointer.step.y = pointer.current.y - pointer.prev.y;

    // Update total movement
    pointer.accum.x += Math.abs(pointer.step.x);
    pointer.accum.y += Math.abs(pointer.step.y);

    // Trigger 'move' callback with relevant data
    this.callbacks.emit('pointermove', { event, pointer });
  }

  /**
   * Handles pointer release (`pointerup`).
   * Removes the pointer and triggers the `pointerup` callback.
   * If no active pointers remain, fires the `end` callback.
   */
  protected _handlePointerUp(event: PointerEvent) {
    // check if pointer exists
    const pointer = this.pointersMap.get(event.pointerId);
    if (!pointer) {
      return;
    }

    // Trigger callbacks
    this.callbacks.emit('pointerup', { pointer });

    // delete pointer
    this.pointersMap.delete(event.pointerId);

    // end if no pointers left
    if (this.pointersMap.size < this.minPointers && this._isStarted) {
      this._isStarted = false;
      this.callbacks.emit('end', undefined);
    }

    // cancel
    if (this.pointersMap.size === 0) {
      this._cleanup();
    }
  }

  /**
   * Handles event cancellations (`pointercancel`, `blur`).
   * Triggers the `end` callback and cleans up all pointers.
   */
  protected _handleCancel() {
    this.callbacks.emit('end', undefined);

    // Trigger callbacks for all pointers
    this.pointersMap.forEach((pointer) => {
      this.callbacks.emit('pointerup', { pointer });
    });

    this._cleanup();
  }

  /**
   * Prevents text selection during pointer interactions.
   */
  protected _resetSelection() {
    window.getSelection()?.empty();
    window.getSelection()?.removeAllRanges();
  }

  /**
   * Returns pointer coordinates relative to the container.
   */
  protected _decodeCoords(event: PointerEvent) {
    const { container, props } = this;

    if (!props.relative) {
      return { x: event.clientX, y: event.clientY };
    }

    const bounding = container.getBoundingClientRect();

    const x = event.clientX - bounding.left;
    const y = event.clientY - bounding.top;

    return { x, y };
  }

  /**
   * Cleans up event listeners, pointers, and injected styles.
   */
  protected _cleanup() {
    this._listeners.forEach((listener) => listener());
    this._listeners = [];
    this._isStarted = false;

    this.pointersMap.clear();

    this._resetSelection();
    styles?.remove();
  }

  /**
   * Destroys the component and removes all event listeners.
   */
  protected _destroy() {
    this._cleanup();

    super._destroy();
  }
}
