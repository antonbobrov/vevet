import { ModulePart, now } from '@/internal';
import { closest } from '@/utils';

import { Swipe } from '..';
import { resolveBoundsOnInertia, resolveOverscroll } from '../resolveProps';

import { SwipeBounds } from './Bounds';
import { SwipeDecode } from './Decode';
import { ISwipeDecodeAngle } from './Decode/types';
import { applyRubber } from './Rubber';
import { TSwipeAxis } from './types';

import type {
  ISwipeCoords,
  ISwipeState,
  ISwipeVec3,
  ISwipeVec2,
} from '../global';

const START_VEC3 = { x: 0, y: 0, angle: 0 };
const START_STATE = { ...START_VEC3, time: 0 };

/**
 * Coordinate snapshot and movement-space pipeline:
 *
 * `decode` → accumulate `rawMovement` → rubber-band → `movement`
 *
 * @internal
 */
export class SwipeCoords extends ModulePart<Swipe> {
  private _decode: SwipeDecode;

  private _bounds: SwipeBounds;

  /** Event timestamp. */
  private _timestamp = 0;

  /** Pointer position at swipe start. */
  private _start: ISwipeState = { ...START_STATE };

  /** Previous pointer position. */
  private _prev: ISwipeState = { ...START_STATE };

  /** Current pointer position. */
  private _current: ISwipeState = { ...START_STATE };

  /** Offset from `start` to `current` (pointer space). */
  private _diff: ISwipeState = { ...START_STATE };

  /** Offset from `prev` to `current` (pointer space). */
  private _step: ISwipeState = { ...START_STATE };

  /** Absolute path length since swipe start (pointer space). */
  private _accum: ISwipeVec3 = { ...START_VEC3 };

  /** Displacement after rubber-band (movement space). */
  private _movement: ISwipeVec3 = { ...START_VEC3 };

  /** Previous `movement` (movement space). */
  private _prevMovement: ISwipeVec3 = { ...START_VEC3 };

  /** Accumulated displacement before rubber-band (same space as `bounds`). */
  private _rawMovement: ISwipeVec3 = { ...START_VEC3 };

  /** Raw atan2 angle and unwrapped cumulative angle. */
  private _tempAngle: ISwipeDecodeAngle = { raw: 0, unwrapped: 0 };

  /** Current scale modifier. */
  private _scale = 1;

  constructor(parent: Swipe) {
    super(parent);

    this._decode = new SwipeDecode(parent);
    this._bounds = new SwipeBounds(parent);
  }

  get timestamp() {
    return this._timestamp;
  }

  get start() {
    return this._start;
  }

  get prev() {
    return this._prev;
  }

  get current() {
    return this._current;
  }

  get diff() {
    return this._diff;
  }

  get step() {
    return this._step;
  }

  get accum() {
    return this._accum;
  }

  /** Displacement after rubber-band (movement space). */
  get movement(): ISwipeVec3 {
    return this._movement;
  }

  set movement(value: Partial<ISwipeVec3>) {
    const newValue = { ...this.movement, ...value };

    this._movement.x = newValue.x;
    this._movement.y = newValue.y;
    this._movement.angle = newValue.angle;

    this._rawMovement.x = newValue.x;
    this._rawMovement.y = newValue.y;
    this._rawMovement.angle = newValue.angle;
  }

  /** Previous displacement after rubber-band (movement space). */
  get prevMovement() {
    return this._prevMovement;
  }

  /** Accumulated displacement before rubber-band (same space as `bounds`). */
  get rawMovement() {
    return this._rawMovement;
  }

  /** Normalized movement limits (`[min, max]` per defined axis). */
  get bounds() {
    if (this._bounds.bounds) {
      return this._bounds.bounds;
    }

    return this.calculateBounds();
  }

  /** Max rubber-band stretch past `bounds` (from `overscroll` prop). */
  get overscroll() {
    return resolveOverscroll(this.props);
  }

  /** @deprecated Use {@link overscroll}. */
  get overflow() {
    return this.overscroll;
  }

  /** Current scale modifier. */
  get scale() {
    return this._scale;
  }

  get coords(): ISwipeCoords {
    const {
      timestamp,
      start,
      prev,
      current,
      diff,
      step,
      accum,
      movement,
      prevMovement,
      scale,
    } = this;

    return {
      timestamp,
      start,
      prev,
      current,
      diff,
      step,
      accum,
      movement,
      prevMovement,
      scale,
    };
  }

  /**
   * Nearest snap target for `axis` closest to `value`, or `undefined` when
   * `snap` is unset / empty for that axis.
   */
  public getSnapCoord(axis: TSwipeAxis, value: number) {
    const snaps = this.props.snap?.()?.[axis];

    if (!snaps?.length) {
      return undefined;
    }

    return closest(value, snaps);
  }

  /**
   * Overflow of `rawMovement` past `bounds` per axis.
   * Zero when inside limits; used by rubber settle when no snap applies.
   */
  get exceeds() {
    const bounds = this.bounds;

    if (!bounds) {
      return null;
    }

    return this._bounds.exceeds(this._rawMovement);
  }

  /** Parses pointer coordinates into swipe state. */
  public decode(event: MouseEvent | TouchEvent | ISwipeVec2) {
    return this._decode.decode(event);
  }

  /** Sets scale and optionally zooms toward an origin in movement space. */
  public applyScale(
    value: number,
    originProp?: MouseEvent | TouchEvent | ISwipeVec2,
  ) {
    if (this.scale === value) {
      return;
    }

    if (originProp) {
      const origin = this.decode(originProp);
      const ratio = value / this.scale;

      this.movement = {
        x: origin.x - (origin.x - this._movement.x) * ratio,
        y: origin.y - (origin.y - this._movement.y) * ratio,
      };
    }

    this._scale = value;
  }

  /** Resets pointer-space tracking for a new gesture. */
  public setStart(state: ISwipeState) {
    this._tempAngle = { raw: state.angle, unwrapped: state.angle };

    this._timestamp = now();
    this._start = { ...state };
    this._prev = { ...state };
    this._current = { ...state };
    this._diff = { ...START_VEC3, time: 0 };
    this._step = { ...START_VEC3, time: 0 };
    this._accum = { ...START_VEC3 };
  }

  /** Aligns unwrapped angle tracking with the current pointer angle. */
  public syncTempAngle() {
    this._tempAngle.raw = this._current.angle;
    this._tempAngle.unwrapped = this._current.angle;
  }

  /**
   * Updates pointer-space fields and accumulates movement
   * (`rawMovement` → rubber-band → `movement`).
   */
  public update({ x, y, angle, time }: ISwipeState, applyRatio = true) {
    const { start, props, parent } = this;
    const stepRatio = applyRatio ? props.ratio : 1;

    if (
      (parent.hasInertia && resolveBoundsOnInertia(props)) ||
      !parent.hasInertia
    ) {
      this.calculateBounds();
    }

    this._timestamp = now();
    this._prev = { ...this.current };
    this._current = { x, y, angle, time };
    const { _current: current, _prev: prev, overscroll } = this;

    this._decode.updateAngle(this._tempAngle, angle);
    current.angle = this._tempAngle.unwrapped;

    this._step = {
      x: current.x - prev.x,
      y: current.y - prev.y,
      angle: current.angle - prev.angle,
      time: current.time - prev.time,
    };

    this._diff = {
      x: current.x - start.x,
      y: current.y - start.y,
      angle: this._diff.angle + this._step.angle,
      time: current.time - start.time,
    };

    this._accum = {
      x: this._accum.x + Math.abs(this._step.x),
      y: this._accum.y + Math.abs(this._step.y),
      angle: this._accum.angle + Math.abs(this._step.angle),
    };

    this._rawMovement = {
      x: this._rawMovement.x + this._step.x * stepRatio,
      y: this._rawMovement.y + this._step.y * stepRatio,
      angle: this._rawMovement.angle + this._step.angle * stepRatio,
    };

    this._prevMovement.x = this._movement.x;
    this._prevMovement.y = this._movement.y;
    this._prevMovement.angle = this._movement.angle;

    const bounds = this.bounds;

    this._movement.x = applyRubber(
      'x',
      this._rawMovement.x,
      bounds,
      overscroll,
    );
    this._movement.y = applyRubber(
      'y',
      this._rawMovement.y,
      bounds,
      overscroll,
    );
    this._movement.angle = applyRubber(
      'angle',
      this._rawMovement.angle,
      bounds,
      overscroll,
    );
  }

  /** Recalculates normalized bounds from the `bounds` prop. */
  public calculateBounds() {
    return this._bounds.calculate(this.coords);
  }
}
