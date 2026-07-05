import { Module, TModuleProps } from '@/base';
import { body } from '@/internal/env';
import { TRequiredProps } from '@/internal/requiredProps';
import { addEventListener } from '@/utils';

import { PointersCoords } from './Coords';
import { PointersDecoder } from './Decoder';
import { PointersPoints } from './Points';
import { MUTABLE_PROPS, STATIC_PROPS } from './props';
import { PointersScheduler } from './Scheduler';
import { styles } from './styles';
import {
  IPointersCallbacksMap,
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
  public _getStatic(): TRequiredProps<TS> {
    return { ...super._getStatic(), ...STATIC_PROPS };
  }

  public _getMutable(): TRequiredProps<TM> {
    return { ...super._getMutable(), ...MUTABLE_PROPS };
  }

  private _points: PointersPoints;

  private _coords: PointersCoords;

  private _decoder: PointersDecoder;

  private _scheduler: PointersScheduler;

  /** Window listeners attached while at least one pointer is active. */
  private _listeners: (() => void)[] = [];

  private _isStarted = false;

  /** `minPointers` captured at gesture start (used for `move` gating). */
  private _saveMinPointers = 1;

  constructor(props?: TModuleProps<TC, TS, TM, Pointers>) {
    super(props);

    this._points = new PointersPoints(this);
    this._coords = new PointersCoords(this);
    this._decoder = new PointersDecoder(this);
    this._scheduler = new PointersScheduler(this);

    this._setInitEvents();
  }

  /** Whether the required number of pointers has been reached (`start` fired). */
  get isStarted() {
    return this._isStarted;
  }

  /** Active pointers keyed by native `pointerId`. */
  get pointersMap() {
    return this._points.map;
  }

  /** The element that listens for pointer events. */
  get container() {
    return this.props.container;
  }

  /**
   * Latest aggregated gesture snapshot from the most recent `move` update,
   * or `null` before the first `move` after `start` / after `end`.
   */
  get move() {
    return this._coords.data;
  }

  /** Attaches container-level listeners (pointer down, drag, context menu). */
  private _setInitEvents() {
    const { container } = this;

    this.onDestroy(
      addEventListener(container, 'pointerdown', this._handleDown.bind(this)),
    );

    this.onDestroy(
      addEventListener(container, 'dragstart', this._handleDrag.bind(this), {
        passive: false,
      }),
    );

    this.onDestroy(
      addEventListener(
        container,
        'mousedown',
        this._handleMouseDown.bind(this),
        { passive: false },
      ),
    );

    this.onDestroy(
      addEventListener(
        container,
        'contextmenu',
        this._handleContextMenu.bind(this),
        { passive: false },
      ),
    );
  }

  /** Attaches window listeners while a gesture is in progress. */
  private _setRuntimeEvents() {
    const listeners = this._listeners;
    if (listeners.length > 0) {
      return;
    }

    this._listeners = [
      addEventListener(window, 'pointermove', this._handleMove.bind(this), {
        passive: false,
      }),

      addEventListener(window, 'pointerup', this._handleUp.bind(this), {
        passive: false,
      }),

      addEventListener(window, 'pointercancel', this._handleCancel.bind(this), {
        passive: false,
      }),

      addEventListener(window, 'blur', this._handleCancel.bind(this)),
    ];
  }

  /** Prevents native drag on the container. */
  private _handleDrag(event: DragEvent) {
    event.preventDefault();
  }

  /** Prevents text selection while the primary mouse button is held. */
  private _handleMouseDown(event: MouseEvent) {
    const buttons = this._decoder.buttons('mouse');

    if (buttons.includes(1)) {
      event.preventDefault();
    }
  }

  /** Suppresses context menu while the secondary mouse button is held. */
  private _handleContextMenu(event: MouseEvent) {
    const buttons = this._decoder.buttons('mouse');

    if (buttons.includes(2)) {
      event.preventDefault();
    }
  }

  /**
   * Handles `pointerdown`: registers the pointer and may fire `start`.
   */
  private _handleDown(event: PointerEvent) {
    const container = this.props.relative ? this.container : null;
    const { x, y } = this._decoder.coords(event, container);
    const type = this._decoder.pointerType(event);

    const buttons = this._decoder.buttons(type);
    const minPointers = this._decoder.minPointers(type);
    const maxPointers = this._decoder.maxPointers(type);

    this._saveMinPointers = minPointers;

    if (!this.props.enabled) {
      return;
    }

    if (!buttons.includes(event.button)) {
      return;
    }

    const hasPointer = this._points.has(event.pointerId);
    if (hasPointer || this._points.size >= maxPointers) {
      return;
    }

    const pointer = this._points.add(x, y, event.pointerId);

    this._emit('pointerdown', { event, pointer });

    if (this._points.size === minPointers) {
      this._isStarted = true;
      this._emit('start', undefined);
    }

    this._setRuntimeEvents();

    if (this.props.disableUserSelect && styles) {
      body.append(styles);
    }
  }

  /**
   * Handles `pointermove`: updates pointer state and may fire `move` (coalesced).
   */
  private _handleMove(event: PointerEvent) {
    if (!this.props.enabled) {
      return;
    }

    const container = this.props.relative ? this.container : null;
    const { x, y } = this._decoder.coords(event, container);
    const pointer = this._points.move(event.pointerId, x, y);

    if (!pointer) {
      return;
    }

    this._emit('pointermove', { event, pointer });

    if (!this._isStarted) {
      return;
    }

    const points = this._points.sorted.map(({ current }) => current);
    this._coords.move(points);

    this._scheduler.schedule(() => {
      if (
        !this._isStarted ||
        this._points.size < this._saveMinPointers ||
        !this._coords.data
      ) {
        return;
      }

      this._emit('move', this._coords.data);
    });
  }

  /**
   * Handles `pointerup`: removes the pointer and may fire `end`.
   */
  private _handleUp(event: PointerEvent) {
    const pointer = this._points.get(event.pointerId);
    const type = this._decoder.pointerType(event);
    const minPointers = this._decoder.minPointers(type);

    if (!pointer) {
      return;
    }

    this._emit('pointerup', { pointer });

    this._points.delete(event.pointerId);

    if (this._points.size < minPointers && this._isStarted) {
      this._isStarted = false;
      this._coords.reset();
      this._emit('end', undefined);
    }

    if (this._points.size === 0) {
      this._cleanup();
    }
  }

  /**
   * Handles `pointercancel` and window `blur`: fires `end` and resets state.
   */
  private _handleCancel() {
    this._emit('end', undefined);

    this._points.map.forEach((pointer) => {
      this._emit('pointerup', { pointer });
    });

    this._cleanup();
  }

  /** Clears text selection after a drag gesture. */
  private _resetSelection() {
    window.getSelection()?.empty();
    window.getSelection()?.removeAllRanges();
  }

  /** Removes runtime listeners, pointers, and injected styles. */
  private _cleanup() {
    this._listeners.forEach((listener) => listener());
    this._listeners = [];
    this._isStarted = false;

    this._coords.reset();
    this._points.clear();
    this._scheduler.clear();

    if (this.props.disableUserSelect) {
      this._resetSelection();
      styles?.remove();
    }
  }

  protected _destroy() {
    this._cleanup();
    super._destroy();
  }
}
