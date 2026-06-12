import { Module, TModuleOnCallbacksProps } from '@/base';
import { initVevet } from '@/global/initVevet';
import { TRequiredProps } from '@/internal/requiredProps';
import { addEventListener, EaseOutCubic } from '@/utils';

import { Pointers } from '../Pointers';
import { Timeline } from '../Timeline';

import { SwipeCoords } from './Coords';
import { ISwipeState, ISwipeVec2, ISwipeVec3 } from './global';
import { SwipeInertia } from './Inertia';
import { MUTABLE_PROPS, STATIC_PROPS } from './props';
import { SwipeStyles } from './Styles';
import {
  ISwipeCallbacksMap,
  ISwipeMutableProps,
  ISwipeStaticProps,
} from './types';

export * from './types';
export * from './global';

type TC = ISwipeCallbacksMap;
type TS = ISwipeStaticProps;
type TM = ISwipeMutableProps;

/**
 * Manages swipe interactions:
 * - Tracks movement and detects direction
 * - Emits events on start, move, and end
 * - Supports exponential inertia
 * - Optional bounds with rubber-band overflow and bounce-back
 *
 * Notes:
 * - Does not transform elements, only computes coordinates.
 *
 * [Documentation](https://vevetjs.com/docs/Swipe)
 *
 * @group Components
 */
export class Swipe extends Module<TC, TS, TM> {
  /**
   * Returns default static properties.
   */
  public _getStatic(): TRequiredProps<TS> {
    return { ...super._getStatic(), ...STATIC_PROPS };
  }

  /**
   * Returns default mutable properties.
   */
  public _getMutable(): TRequiredProps<TM> {
    return { ...super._getMutable(), ...MUTABLE_PROPS };
  }

  /** Swipe coords */
  private _coords: SwipeCoords;

  /** Inertia animation */
  private _inertia: SwipeInertia;

  /** Bounce animation */
  private _bounceTm?: Timeline;

  /** Styles manager */
  private _styles: SwipeStyles;

  /** Pointer event manager */
  private _pointers: Pointers;

  /** If swiping has started */
  private _isSwiping = false;

  /** If swiping has been aborted */
  private _isAborted = false;

  /** Swipe start time */
  private _startTime: number | undefined;

  /** Initial swipe coordinates (internal use) */
  private _startCoord: ISwipeVec2 | undefined;

  constructor(
    props?: TS & TM & TModuleOnCallbacksProps<TC, Swipe>,
    onCallbacks?: TModuleOnCallbacksProps<TC, Swipe>,
  ) {
    super(props, onCallbacks as any);

    const { container, thumb, buttons, pointers } = this.props;

    this._coords = new SwipeCoords({
      container,
      props: this.props,
      hasInertia: () => this.hasInertia,
    });

    this._styles = new SwipeStyles(this as any);

    this._inertia = new SwipeInertia({
      props: this.props,
      coords: this._coords,
      onStart: () => {
        this._coords.syncTempAngle();
        this.callbacks.emit('inertiaStart', undefined);
      },
      onFail: () => this.callbacks.emit('inertiaFail', undefined),
      onCancel: () => this.callbacks.emit('inertiaCancel', undefined),
      onEnd: () => this.callbacks.emit('inertiaEnd', undefined),
    });

    // create pointers
    this._pointers = new Pointers({
      container: thumb || container,
      buttons,
      minPointers: pointers,
      maxPointers: pointers,
      enabled: this.props.enabled,
      disableUserSelect: this.props.disableUserSelect,
    });

    // Set Events
    this._setEvents();
  }

  /** Full coordinate snapshot (pointer space + `movement`). */
  get coords() {
    return this._coords.coords;
  }

  /** Coordinate reference element. */
  get container() {
    return this.props.container;
  }

  /** Whether release inertia is running. */
  get hasInertia() {
    return this._inertia.has;
  }

  /** Whether overflow bounce-back timeline is running. */
  get hasBounce() {
    return !!this._bounceTm;
  }

  /** Whether a swipe gesture is in progress. */
  get isSwiping() {
    return this._isSwiping;
  }

  /** Handles property updates */
  protected _handleProps(props: Partial<TM>) {
    super._handleProps(props);

    this._pointers.updateProps({ enabled: this.props.enabled });

    this._styles.setInline();

    if (!this.props.inertia || !this.props.enabled) {
      this.cancelInertia();
    }

    if (!this.props.enabled) {
      this.cancelBounce();
    }
  }

  /** Sets event listeners */
  private _setEvents() {
    const { callbacks } = this;
    const { container } = this.props;

    this._pointers.on('start', () => this._handlePointersStart());

    this._pointers.on('pointerdown', (data) =>
      callbacks.emit('pointerdown', data),
    );

    this._pointers.on('pointermove', (data) =>
      callbacks.emit('pointermove', data),
    );

    this._pointers.on('pointerup', (data) => callbacks.emit('pointerup', data));

    this._pointers.on('end', () => this._handlePointersEnd());

    const touchstart = addEventListener(
      container,
      'touchstart',
      (event) => this._handleTouchStart(event),
      { passive: false },
    );

    this.onDestroy(() => touchstart());
  }

  /** Handles `touchstart` events */
  private _handleTouchStart(event: TouchEvent) {
    if (!this.props.enabled) {
      return;
    }

    this._preventEdgeSwipe(event);

    this.callbacks.emit('touchstart', event);
  }

  /** Prevents edge swipes if enabled */
  private _preventEdgeSwipe(event: TouchEvent) {
    const { props } = this;

    if (!props.preventEdgeSwipe) {
      return;
    }

    const threshold = props.edgeSwipeThreshold;
    const x = event.targetTouches[0].pageX;

    const shouldPrevent = x <= threshold || x >= initVevet().width - threshold;

    if (event.cancelable && shouldPrevent) {
      event.preventDefault();

      this.callbacks.emit('preventEdgeSwipe', undefined);
    }
  }

  /** Handles pointers start */
  private _handlePointersStart() {
    this.cancelBounce();
    this.cancelInertia();

    const touchmove = addEventListener(
      window,
      'touchmove',
      this._handleTouchMove.bind(this),
      { passive: false },
    );

    const mousemove = addEventListener(
      window,
      'mousemove',
      this._handleMouseMove.bind(this),
    );

    const end = this._pointers.on('end', () => {
      this._handleEnd();

      end();
      touchmove();
      mousemove();
    });

    this.onDestroy(() => {
      end();
      touchmove();
      mousemove();
    });
  }

  /** Handles pointers end */
  private _handlePointersEnd() {
    if (!this._isSwiping) {
      this.releaseBounce();
    }
  }

  /** Handles `touchmove` event */
  private _handleTouchMove(event: TouchEvent) {
    this.callbacks.emit('touchmove', event);

    if (this._isSwiping && this.props.preventTouchMove && event.cancelable) {
      event.preventDefault();
    }

    this._handleMove(event, 'touch');
  }

  /** Handles `mousemove` event */
  private _handleMouseMove(event: MouseEvent) {
    if (this.props.requireCtrlKey && !event.ctrlKey) {
      return;
    }

    this.callbacks.emit('mousemove', event);

    this._handleMove(event, 'mouse');
  }

  /** Handles move events */
  private _handleMove(event: MouseEvent | TouchEvent, type: 'touch' | 'mouse') {
    const data = this._coords;
    const state = data.decode(event);

    if (this._isAborted) {
      return;
    }

    // Save start coordinates
    if (!this._startCoord) {
      this._startCoord = { ...state };
    }

    // Update start time
    if (!this._startTime) {
      this._startTime = +Date.now();
    }

    // check if can start
    if (!this._isSwiping && !this._canStart(state, type)) {
      return;
    }

    // start
    if (!this._isSwiping) {
      this.cancelInertia();
      this.cancelBounce();

      this._isSwiping = true;
      this._startCoord = { ...state };

      data.setStart(state);

      this.callbacks.emit('start', this.coords);

      this._styles.append();
    }

    // move
    this._move(state);
  }

  /** Checks if swipe can start */
  private _canStart(state: ISwipeState, type: 'touch' | 'mouse') {
    const { _startCoord: startCoord, _startTime: startTime } = this;

    if (!startCoord || !startTime) {
      return false;
    }

    const { threshold, minTime, axis, willAbort } = this.props;

    const diff = {
      x: state.x - startCoord.x,
      y: state.y - startCoord.y,
    };

    // check threshold
    const distX = diff.x;
    const distY = diff.y;
    const dist = Math.sqrt(distX ** 2 + distY ** 2);

    if (dist < threshold) {
      return false;
    }

    // check time
    if (+new Date() - startTime < minTime) {
      return false;
    }

    // check axis
    if (axis) {
      const rawAngle =
        (Math.atan2(Math.abs(diff.y), Math.abs(diff.x)) * 180) / Math.PI;

      const normalizedAngle = axis === 'x' ? rawAngle : 90 - rawAngle;

      if (normalizedAngle > 45) {
        this._reset();
        this._isAborted = true;

        this.callbacks.emit('abort', undefined);

        return false;
      }
    }

    // Check if should abort
    const shouldAbort = willAbort({
      type,
      state,
      start: startCoord,
      diff,
    });

    if (shouldAbort) {
      this._reset();
      this._isAborted = true;

      this.callbacks.emit('abort', undefined);

      return false;
    }

    return true;
  }

  /** Handles move events */
  private _move(state: ISwipeState, applyRatio = true) {
    const coords = this._coords;

    // Update coords
    coords.update(state, applyRatio);

    // trigger callbacks
    this.callbacks.emit('move', this.coords);
  }

  /** Handles swipe end */
  private _handleEnd() {
    // reset
    this._startTime = undefined;
    this._isAborted = false;

    // check swiping
    if (!this.isSwiping) {
      return;
    }

    // reset
    this._reset();

    // reset styles
    this._styles.remove();

    // calculate direction
    const { x: diffX, y: diffY } = this._coords.diff;
    const absDiffX = Math.abs(diffX);
    const absDiffY = Math.abs(diffY);

    const { directionThreshold } = this.props;
    const endAxis = absDiffX > absDiffY ? 'x' : 'y';

    if (endAxis === 'x' && absDiffX > directionThreshold) {
      if (diffX > 0) {
        this.callbacks.emit('toRight', undefined);
      } else if (diffX < 0) {
        this.callbacks.emit('toLeft', undefined);
      }
    }

    if (endAxis === 'y' && absDiffY > directionThreshold) {
      if (diffY > 0) {
        this.callbacks.emit('toBottom', undefined);
      } else if (diffY < 0) {
        this.callbacks.emit('toTop', undefined);
      }
    }

    // end callback
    this.callbacks.emit('end', this.coords);

    // end with inertia or bounce

    let hasInertia = false;

    if (this.props.inertia) {
      hasInertia = this._releaseInertia();
    }

    if (!hasInertia) {
      this.releaseBounce();
    }
  }

  /** Reset swipe states */
  private _reset() {
    this._startCoord = undefined;
    this._isSwiping = false;
  }

  /** Apply inertia-based movement */
  private _releaseInertia() {
    return this._inertia.release(({ x, y, angle }) => {
      this.callbacks.emit('inertia', undefined);

      this._move({ x, y, angle, time: performance.now() }, false);
    });
  }

  /** Apply bounce overflow animation */
  public releaseBounce(targetDuration?: number) {
    this.cancelBounce();

    const { exceeds } = this._coords;
    const canBounce = this.props.canBounce();

    if (
      !exceeds ||
      (!exceeds.x && !exceeds.y && !exceeds.angle) ||
      !canBounce
    ) {
      return;
    }

    const start = { ...this.current };

    const duration = targetDuration ?? this.props.bounceDuration;
    const tm = new Timeline({ duration, easing: EaseOutCubic });
    this._bounceTm = tm;

    this._coords.syncTempAngle();

    tm.on('update', ({ eased }) => {
      this._move(
        {
          x: start.x - exceeds.x * eased,
          y: start.y - exceeds.y * eased,
          angle: start.angle - exceeds.angle * eased,
          time: performance.now(),
        },
        false,
      );
    });

    tm.on('end', this.cancelBounce.bind(this));

    tm.play();
  }

  /** Cancel inertia */
  public cancelInertia() {
    this._inertia.cancel();
  }

  /** Cancel bounce */
  public cancelBounce() {
    this._bounceTm?.destroy();
    this._bounceTm = undefined;
  }

  /** Calculate swipe bounds */
  public calculateBounds() {
    return this._coords.calculateBounds();
  }

  /** Pointer position at swipe start. */
  get start() {
    return this._coords.start;
  }

  /** Previous pointer position. */
  get prev() {
    return this._coords.prev;
  }

  /** Current pointer position. */
  get current() {
    return this._coords.current;
  }

  /** Offset from swipe start to current pointer position. */
  get diff() {
    return this._coords.diff;
  }

  /** Offset from previous to current pointer position. */
  get step() {
    return this._coords.step;
  }

  /** Absolute path length since swipe start. */
  get accum() {
    return this._coords.accum;
  }

  /** Total displacement in movement space (use for element transforms). */
  get movement() {
    return this._coords.movement;
  }

  /** Current scale modifier. */
  get scale() {
    return this._coords.scale;
  }

  /**
   * Sets programmatic scale in movement space.
   * Optionally zooms toward an origin point and emits `move`.
   */
  public setScale(value: number, origin: MouseEvent | TouchEvent | ISwipeVec2) {
    this._coords.applyScale(value, origin);
    this._move({ ...this.current, time: performance.now() });

    if (!this._inertia.has) {
      this.releaseBounce(0);
    }
  }

  /**
   * Sets programmatic displacement in movement space.
   * Reapplies rubber, snap, emits `move`, and cancels overflow bounce.
   */
  public setMovement(value: Partial<ISwipeVec3>) {
    this._coords.movement = value;
    this._move({ ...this.current, time: performance.now() });
    this.releaseBounce(0);
  }

  /**
   * Destroys the component
   */
  protected _destroy() {
    super._destroy();

    this.cancelBounce();

    this._pointers.destroy();
    this._inertia.destroy();
    this._styles.remove();
  }
}
