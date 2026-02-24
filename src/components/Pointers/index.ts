import { Module, TModuleOnCallbacksProps } from '@/base';
import { body } from '@/internal/env';
import { TRequiredProps } from '@/internal/requiredProps';
import { addEventListener, clamp } from '@/utils';

import { MUTABLE_PROPS, STATIC_PROPS } from './props';
import { styles } from './styles';
import {
  IPointersCallbacksMap,
  IPointersItem,
  IPointersMutableProps,
  IPointersStaticProps,
} from './types';

export * from './types';

type TC = IPointersCallbacksMap;
type TS = IPointersStaticProps;
type TM = IPointersMutableProps;

/**
 * Manages pointer events, including tracking multiple pointers,
 * and emitting callbacks for pointer interactions.
 *
 * For proper functionality, ensure the container has an appropriate
 * [touch-action](https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action) property.
 *
 * [Documentation](https://vevetjs.com/docs/Pointers)
 *
 * @group Components
 */
export class Pointers extends Module<TC, TS, TM> {
  /**
   * Returns the default static properties.
   */
  public _getStatic(): TRequiredProps<TS> {
    return { ...super._getStatic(), ...STATIC_PROPS };
  }

  /**
   * Returns the default mutable properties.
   */
  public _getMutable(): TRequiredProps<TM> {
    return { ...super._getMutable(), ...MUTABLE_PROPS };
  }

  /**
   * Stores active event listeners for runtime interactions.
   */
  private _listeners: (() => void)[] = [];

  /** Indicates whether the `start` event has been triggered. */
  private _isStarted = false;

  /** Map of active pointers. */
  private _pointersMap: Map<number, IPointersItem>;

  constructor(
    props?: TS & TM & TModuleOnCallbacksProps<TC, Pointers>,
    onCallbacks?: TModuleOnCallbacksProps<TC, Pointers>,
  ) {
    super(props, onCallbacks as any);

    // Defaults
    this._pointersMap = new Map();

    // Setup base events
    this._setBaseEvents();
  }

  /** Indicates whether the `start` event has been triggered. */
  get isStarted() {
    return this._isStarted;
  }

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

  /**
   * Attaches base event listeners to the container.
   */
  private _setBaseEvents() {
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
  private _setRuntimeEvents() {
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
  private _handlePointerDown(event: PointerEvent) {
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
      body.append(styles!);
    }

    // Trigger start callback
    this.callbacks.emit('pointerdown', { event, pointer });
  }

  /**
   * Handles pointer movement (`pointermove`).
   * Updates pointer positions and triggers the `pointermove` callback.
   */
  private _handlePointerMove(event: PointerEvent) {
    const pointer = this.pointersMap.get(event.pointerId);
    if (!pointer) {
      return;
    }

    const { x, y } = this._decodeCoords(event);

    // Update previous and current coordinates
    pointer.prev = { ...pointer.current };
    pointer.current = { x, y };

    // Update diff
    pointer.diff.x = pointer.current.x - pointer.start.x;
    pointer.diff.y = pointer.current.y - pointer.start.y;

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
  private _handlePointerUp(event: PointerEvent) {
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
  private _handleCancel() {
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
  private _resetSelection() {
    window.getSelection()?.empty();
    window.getSelection()?.removeAllRanges();
  }

  /**
   * Returns pointer coordinates relative to the container.
   */
  private _decodeCoords(event: PointerEvent) {
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
  private _cleanup() {
    this._listeners.forEach((listener) => listener());
    this._listeners = [];
    this._isStarted = false;

    this.pointersMap.clear();

    if (this.props.disableUserSelect) {
      this._resetSelection();
      styles?.remove();
    }
  }

  /**
   * Destroys the component and removes all event listeners.
   */
  protected _destroy() {
    this._cleanup();

    super._destroy();
  }
}
