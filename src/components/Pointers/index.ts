import { Module, TModuleOnCallbacksProps } from '@/base';
import { body } from '@/internal/env';
import { isNumber } from '@/internal/isNumber';
import { TRequiredProps } from '@/internal/requiredProps';
import { unwrapAngleDelta } from '@/internal/unwrapAngle';
import { addEventListener, clamp } from '@/utils';

import { MUTABLE_PROPS, STATIC_PROPS } from './props';
import { styles } from './styles';
import {
  IPointersCallbacksMap,
  IPointersItem,
  IPointersMove,
  IPointersMutableProps,
  IPointersStaticProps,
  IPointersVec2,
  TPointersType,
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

  /** Save minPointers value */
  private _saveMinPointers = 1;

  /** Move data. */
  private _moveData: IPointersMove | null = null;

  /** Whether a microtask `move` emit is scheduled. */
  private _moveScheduled = false;

  /** Angle data */
  private _angle = { raw: 0, unwrapped: 0, unwrappedStart: 0 };

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

  /** Move data */
  get move() {
    return this._moveData;
  }

  /** Get buttons */
  private _getButtons(type: TPointersType) {
    const { buttons } = this.props;

    return Array.isArray(buttons) ? buttons : buttons(type);
  }

  /** Get max pointers */
  private _getMinPointers(type: TPointersType) {
    const { minPointers } = this.props;

    return clamp(
      isNumber(minPointers) ? minPointers : minPointers(type),
      1,
      Infinity,
    );
  }

  /** Get max pointers */
  private _getMaxPointers(type: TPointersType) {
    const { maxPointers } = this.props;

    return clamp(
      isNumber(maxPointers) ? maxPointers : maxPointers(type),
      this._getMinPointers(type),
      Infinity,
    );
  }

  /** Normalize pointer event type */
  private _getPointerType(event: PointerEvent) {
    const types: TPointersType[] = ['mouse', 'touch'];

    if (types.includes(event.pointerType as TPointersType)) {
      return event.pointerType as TPointersType;
    }

    return 'mouse';
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
        if (this._getButtons('mouse').includes(1)) {
          event.preventDefault();
        }
      },
      { passive: false },
    );

    const contextmenu = addEventListener(
      container,
      'contextmenu',
      (event) => {
        if (this._getButtons('mouse').includes(2)) {
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
    const pointerType = this._getPointerType(event);

    const buttons = this._getButtons(pointerType);

    const minPointers = this._getMinPointers(pointerType);
    this._saveMinPointers = minPointers;

    const maxPointers = this._getMaxPointers(pointerType);

    if (!props.enabled) {
      return;
    }

    // check if button type is allowed
    if (!buttons.includes(event.button)) {
      return;
    }

    // Check if pointer already exists or no more pointers allowed
    const hasPointer = this.pointersMap.get(event.pointerId);
    if (hasPointer || this.pointersMap.size >= maxPointers) {
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
    if (this.pointersMap.size === minPointers) {
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

    if (!this.props.enabled) {
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

    if (this._isStarted) {
      this._updateMove();
      this._scheduleMove();
    }
  }

  /**
   * Handles pointer release (`pointerup`).
   * Removes the pointer and triggers the `pointerup` callback.
   * If no active pointers remain, fires the `end` callback.
   */
  private _handlePointerUp(event: PointerEvent) {
    // check if pointer exists
    const pointer = this.pointersMap.get(event.pointerId);

    // Get min-pointers
    const minPointers = this._getMinPointers(this._getPointerType(event));

    if (!pointer) {
      return;
    }

    // Trigger callbacks
    this.callbacks.emit('pointerup', { pointer });

    // delete pointer
    this.pointersMap.delete(event.pointerId);

    // end if no pointers left
    if (this.pointersMap.size < minPointers && this._isStarted) {
      this._isStarted = false;
      this._moveData = null;
      this._angle = { raw: 0, unwrapped: 0, unwrappedStart: 0 };
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

  /** Update move data */
  private _updateMove() {
    const pointers = Array.from(this.pointersMap.values()).sort(
      (a, b) => a.index - b.index,
    );

    const currents = pointers.map(({ current }) => current);

    const center = this._getAverageCenter(currents);
    const distance = Math.max(this._getAverageDistance(currents), 0.001);
    const rawAngle = this._getAngle(currents);

    if (!this._moveData) {
      this._angle = {
        raw: rawAngle,
        unwrapped: rawAngle,
        unwrappedStart: rawAngle,
      };

      this._moveData = {
        center,
        prevCenter: { ...center },
        startCenter: { ...center },
        distance,
        prevDistance: distance,
        startDistance: distance,
        scale: 1,
        prevScale: 1,
        angle: 0,
        prevAngle: 0,
      };

      return;
    }

    this._moveData.prevCenter = { ...this._moveData.center };
    this._moveData.center = { ...center };

    this._moveData.prevDistance = this._moveData.distance;
    this._moveData.distance = distance;

    if (pointers.length >= 2) {
      this._moveData.prevScale = this._moveData.scale;
      this._moveData.scale = distance / this._moveData.startDistance;

      this._angle.unwrapped += unwrapAngleDelta(rawAngle, this._angle.raw);
      this._angle.raw = rawAngle;

      this._moveData.prevAngle = this._moveData.angle;
      this._moveData.angle = this._angle.unwrapped - this._angle.unwrappedStart;
    }
  }

  /** Returns the angle between the first two pointers (deg). */
  private _getAngle(points: IPointersVec2[]) {
    if (points.length < 2) {
      return 0;
    }

    const [first, second] = points;

    return (Math.atan2(second.y - first.y, second.x - first.x) * 180) / Math.PI;
  }

  /** Returns the average center position of points. */
  private _getAverageCenter(points: IPointersVec2[]) {
    if (points.length === 1) {
      return points[0];
    }

    const sum = points.reduce(
      (acc, p) => ({
        x: acc.x + p.x,
        y: acc.y + p.y,
      }),
      { x: 0, y: 0 },
    );

    return {
      x: sum.x / points.length,
      y: sum.y / points.length,
    };
  }

  /** Returns the average distance between points */
  private _getAverageDistance(points: IPointersVec2[]) {
    if (points.length <= 1) {
      return 0;
    }

    const center = this._getAverageCenter(points);

    const total = points.reduce(
      (sum, p) => sum + Math.hypot(p.x - center.x, p.y - center.y),
      0,
    );

    return total / points.length;
  }

  /** Schedules a deduplicated `move` callback for the current microtask. */
  private _scheduleMove() {
    if (this._moveScheduled) {
      return;
    }

    this._moveScheduled = true;

    queueMicrotask(() => {
      this._moveScheduled = false;

      if (
        !this._isStarted ||
        this.pointersMap.size < this._saveMinPointers ||
        !this._moveData
      ) {
        return;
      }

      this.callbacks.emit('move', this._moveData);
    });
  }

  /**
   * Cleans up event listeners, pointers, and injected styles.
   */
  private _cleanup() {
    this._listeners.forEach((listener) => listener());
    this._listeners = [];
    this._isStarted = false;
    this._moveScheduled = false;
    this._moveData = null;
    this._angle = { raw: 0, unwrapped: 0, unwrappedStart: 0 };

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
