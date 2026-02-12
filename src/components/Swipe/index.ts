import { Module, TModuleOnCallbacksProps } from '@/base';
import { initVevet } from '@/global/initVevet';
import { TRequiredProps } from '@/internal/requiredProps';
import { addEventListener } from '@/utils';

import { Pointers } from '../Pointers';

import { SwipeCoords } from './Coords';
import { ISwipeMatrix, ISwipeVec2 } from './global';
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
 * - Supports inertia-based movement
 *
 * Notes:
 * - Does not transform elements, only computes coordinates.
 * - Does not persist state after swipe completion.
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
    props?: TS & TM,
    onCallbacks?: TModuleOnCallbacksProps<TC, Swipe>,
  ) {
    super(props, onCallbacks as any);

    const { container, thumb, buttons, pointers } = this.props;

    this._coords = new SwipeCoords(this as any);
    this._inertia = new SwipeInertia(this as any);
    this._styles = new SwipeStyles(this as any);

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

  /** Returns current swipe coordinates */
  get coords() {
    return this._coords.coords;
  }

  /** Event target element */
  get container() {
    return this.props.container;
  }

  /** Indicates if inertia is active */
  get hasInertia() {
    return this._inertia.has;
  }

  /** Indicates if a swipe is active */
  get isSwiping() {
    return this._isSwiping;
  }

  /** Handles property updates */
  protected _handleProps() {
    super._handleProps();

    this._pointers.updateProps({ enabled: this.props.enabled });

    this._styles.setInline();
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

    this.callbacks.emit('touchstart', event);

    this._preventEdgeSwipe(event);
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

  /** Handles swipe start and tracking */
  private _handlePointersStart() {
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
    const matrix = data.decode(event);

    if (this._isAborted) {
      return;
    }

    // Save start coordinates
    if (!this._startCoord) {
      this._startCoord = { ...matrix };
    }

    // Update start time
    if (!this._startTime) {
      this._startTime = +Date.now();
    }

    // check if can start
    if (!this._isSwiping && !this._canStart(matrix, type)) {
      return;
    }

    // start
    if (!this._isSwiping) {
      this._inertia.cancel();

      this._isSwiping = true;
      this._startCoord = { ...matrix };

      data.setStart(matrix);

      this.callbacks.emit('start', this.coords);

      this._styles.append();
    }

    // move
    this._move(matrix);
  }

  /** Checks if swipe can start */
  private _canStart(matrix: ISwipeMatrix, type: 'touch' | 'mouse') {
    const startCoord = this._startCoord;
    const startTime = this._startTime;

    if (!startCoord || !startTime) {
      return false;
    }

    const { threshold, ratio, minTime, axis, willAbort } = this.props;
    const speed = Math.abs(ratio);

    const diff = {
      x: matrix.x - startCoord.x,
      y: matrix.y - startCoord.y,
    };

    // check threshold
    const distX = diff.x / speed;
    const distY = diff.y / speed;
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
      matrix,
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
  private _move(matrix: ISwipeMatrix) {
    const coords = this._coords;

    // Update coords
    coords.update(matrix);

    // Update velocity
    this._inertia.addVelocity({
      ...coords.current,
      timestamp: coords.timestamp,
    });

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

    // modifiy last velocity time
    this._inertia.updateLastTimestamp();

    // end with inertia
    if (this.props.inertia) {
      this._releaseInertia();
    }
  }

  /** Reset swipe states */
  private _reset() {
    this._startCoord = undefined;
    this._isSwiping = false;
  }

  /** Apply inertia-based movement */
  private _releaseInertia() {
    const startMatrix = { ...this.coords.current };

    this._inertia.release((addMatrix) => {
      this._move({
        x: startMatrix.x + addMatrix.x,
        y: startMatrix.y + addMatrix.y,
        angle: startMatrix.angle + addMatrix.angle,
      });
    });
  }

  /** Cancel inertia */
  public cancelInertia() {
    this._inertia.cancel();
  }

  /** Start coordinate */
  get start() {
    return this._coords.start;
  }

  /** Previous coordinate */
  get prev() {
    return this._coords.prev;
  }

  /** Current coordinate */
  get current() {
    return this._coords.current;
  }

  /** Difference between start and current coordinates */
  get diff() {
    return this._coords.diff;
  }

  /** Difference between start and previous coordinates */
  get step() {
    return this._coords.step;
  }

  /** Accumulated movement */
  get accum() {
    return this._coords.accum;
  }

  /**
   * Destroys the component
   */
  protected _destroy() {
    super._destroy();

    this._pointers.destroy();
    this._inertia.destroy();
    this._styles.remove();
  }
}
