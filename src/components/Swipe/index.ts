import { Module, TModuleProps } from '@/base';
import { now } from '@/internal/now';
import { TRequiredProps } from '@/internal/requiredProps';

import { SwipeBounce } from './Bounce';
import { SwipeCoords } from './Coords';
import { SwipeDirection } from './Direction';
import { SwipeGesture, TSwipeInputType } from './Gesture';
import { ISwipeState, ISwipeVec2, ISwipeVec3 } from './global';
import { SwipeInertia } from './Inertia';
import { SwipeInput } from './Input';
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
 * Gesture lifecycle
 *
 * `Pointers.start` → window move samples → pending (threshold) →
 * `start` / `move` → `end` → direction → inertia or bounce.
 *
 * If the threshold is never crossed, `start` and `end` are not emitted.
 *
 * Coordinate spaces
 *
 * - **Pointer space** — `start`, `prev`, `current`, `diff`, `step`, `accum`
 * - **Movement space** — `movement`, `prevMovement`, `scale` (after rubber / snap)
 *
 * Does not transform elements — only computes coordinates.
 *
 * [Documentation](https://vevetjs.com/docs/Swipe)
 *
 * @group Components
 */
export class Swipe extends Module<TC, TS, TM> {
  public _getStatic(): TRequiredProps<TS> {
    return { ...super._getStatic(), ...STATIC_PROPS };
  }

  public _getMutable(): TRequiredProps<TM> {
    return { ...super._getMutable(), ...MUTABLE_PROPS };
  }

  private _coords: SwipeCoords;

  private _inertia: SwipeInertia;

  private _bounce: SwipeBounce;

  private _direction: SwipeDirection;

  private _styles: SwipeStyles;

  private _gesture: SwipeGesture;

  private _input: SwipeInput;

  constructor(props?: TModuleProps<TC, TS, TM, Swipe>) {
    super(props);

    this._coords = new SwipeCoords(this);
    this._styles = new SwipeStyles(this);

    this._inertia = new SwipeInertia(this, this._coords, () =>
      this._coords.syncTempAngle(),
    );

    this._bounce = new SwipeBounce(this, this._coords, (state) =>
      this._applyMove(state, false),
    );

    this._direction = new SwipeDirection(this);

    this._gesture = new SwipeGesture(this);

    this._input = new SwipeInput(this, {
      onSessionStart: () => {
        this.cancelBounce();
        this.cancelInertia();
      },
      onMove: (type) => this._onInputMove(type),
      onGestureEnd: () => this._onGestureEnd(),
      onPointersEnd: () => this._onPointersEnd(),
    });
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
    return this._bounce.has;
  }

  /** Whether a swipe gesture is in progress. */
  get isSwiping() {
    return this._gesture.isSwiping;
  }

  protected _handleProps(props: Partial<TM>) {
    super._handleProps(props);

    this._input.updateEnabled();
    this._styles.setInline();

    if (!this.props.inertia || !this.props.enabled) {
      this.cancelInertia();
    }

    if (!this.props.enabled) {
      this.cancelBounce();
    }
  }

  /** Processes one window move sample during an active pointer session. */
  private _onInputMove(type: TSwipeInputType) {
    if (!this._input.moveCenter || !this.props.enabled) {
      return;
    }

    const state = this._coords.decode(this._input.moveCenter);
    const sample = this._gesture.sample(state, type);

    if (sample.type === 'ignore' || sample.type === 'pending') {
      return;
    }

    if (sample.type === 'activate') {
      this.cancelInertia();
      this.cancelBounce();

      this._coords.setStart(sample.state);
      this._emit('start', this.coords);
      this._styles.append();
    }

    this._applyMove(sample.state);
  }

  /** Finalizes an active swipe after all pointers are released. */
  private _onGestureEnd() {
    this._gesture.clearSession();

    if (!this.isSwiping) {
      return;
    }

    this._gesture.reset();
    this._styles.remove();

    this._emit('end', this.coords);

    this._direction.emit();

    let hasInertia = false;

    if (this.props.inertia) {
      hasInertia = this._releaseInertia();
    }

    if (!hasInertia) {
      this.releaseBounce();
    }
  }

  /** Runs bounce when pointers end without an active swipe. */
  private _onPointersEnd() {
    if (!this.isSwiping) {
      this.releaseBounce();
    }
  }

  /** Updates coords and emits `move`. */
  private _applyMove(state: ISwipeState, applyRatio = true) {
    this._coords.update(state, applyRatio);
    this._emit('move', this.coords);
  }

  /** Starts release inertia from the last pointer velocity. */
  private _releaseInertia() {
    return this._inertia.release(({ x, y, angle }) => {
      this._emit('inertia', undefined);
      this._applyMove({ x, y, angle, time: now() }, false);
    });
  }

  /** Animates movement back inside bounds after overflow. */
  public releaseBounce(targetDuration?: number) {
    this._bounce.release(targetDuration);
  }

  /** Stops release inertia. */
  public cancelInertia() {
    this._inertia.cancel();
  }

  /** Stops overflow bounce animation. */
  public cancelBounce() {
    this._bounce.cancel();
  }

  /** Recalculates movement bounds from the `bounds` prop. */
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
    this._applyMove({ ...this.current, time: now() });

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
    this._applyMove({ ...this.current, time: now() });
    this.releaseBounce(0);
  }

  protected _destroy() {
    this.cancelBounce();

    super._destroy();
  }
}
