import { ModulePart } from '@/shared/ModulePart';

import { Swipe } from '..';

import { SwipeBounds } from './Bounds';
import { ISwipeDecodeAngle, SwipeDecode } from './Decode';
import { applyRubber } from './Rubber';
import { SwipeSnap } from './Snap';

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
 * `decode` → accumulate `rawMovement` → rubber → snap → `movement`
 *
 * @internal
 */
export class SwipeCoords extends ModulePart<Swipe> {
  private _decode: SwipeDecode;

  private _bounds: SwipeBounds;

  private _snap: SwipeSnap;

  /** Event timestamp. */
  private _timestamp = 0;

  /** Start position. */
  private _start: ISwipeState = { ...START_STATE };

  /** Previous position. */
  private _prev: ISwipeState = { ...START_STATE };

  /** Current position. */
  private _current: ISwipeState = { ...START_STATE };

  /** Movement offset from start. */
  private _diff: ISwipeState = { ...START_STATE };

  /** Movement offset from previous position. */
  private _step: ISwipeState = { ...START_STATE };

  /** Total accumulated movement since swipe start. */
  private _accum: ISwipeVec3 = { ...START_VEC3 };

  /** Movement with rubber and snap applied (movement space). */
  private _movement: ISwipeVec3 = { ...START_VEC3 };

  /** Previous movement with rubber and snap applied (movement space). */
  private _prevMovement: ISwipeVec3 = { ...START_VEC3 };

  /** Raw accumulated displacement (before rubber). */
  private _rawMovement: ISwipeVec3 = { ...START_VEC3 };

  /** Raw atan2 angle and unwrapped cumulative angle. */
  private _tempAngle: ISwipeDecodeAngle = { raw: 0, unwrapped: 0 };

  /** Current scale modifier. */
  private _scale = 1;

  constructor(parent: Swipe) {
    super(parent);

    this._decode = new SwipeDecode(parent);
    this._bounds = new SwipeBounds(parent);
    this._snap = new SwipeSnap(parent);
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

  /** Displacement in movement space (rubber + snap). */
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

  /** Previous displacement in movement space (rubber + snap). */
  get prevMovement() {
    return this._prevMovement;
  }

  /** Raw movement before rubber (same space as `bounds`). */
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

  /** Bound overflow */
  get overflow() {
    const { overflow } = this.props;

    return overflow ? Math.abs(overflow()) : 0;
  }

  /** Current scale modifier */
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

  /** Resolved snap target per axis during the current gesture. */
  get snap() {
    return this._snap.targets;
  }

  /**
   * Overflow past `bounds` per axis in movement space.
   * Zero when inside limits; used for bounce-back.
   */
  get exceeds() {
    const bounds = this.bounds;

    if (!bounds) {
      return null;
    }

    return this._bounds.exceeds(this._rawMovement);
  }

  /** Parses pointer coordinates relative to the container */
  public decode(event: MouseEvent | TouchEvent | ISwipeVec2) {
    return this._decode.decode(event);
  }

  /** Apply scale and optionally zoom toward an origin in movement space. */
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

  /** Set start coordinates */
  public setStart(state: ISwipeState) {
    this._tempAngle = { raw: state.angle, unwrapped: state.angle };

    this._timestamp = performance.now();
    this._start = { ...state };
    this._prev = { ...state };
    this._current = { ...state };
    this._diff = { ...START_VEC3, time: 0 };
    this._step = { ...START_VEC3, time: 0 };
    this._accum = { ...START_VEC3 };
  }

  /** Sync temp angle */
  public syncTempAngle() {
    this._tempAngle.raw = this._current.angle;
    this._tempAngle.unwrapped = this._current.angle;
  }

  /** Update coordinates through the movement pipeline. */
  public update({ x, y, angle, time }: ISwipeState, applyRatio = true) {
    const { start, props, parent } = this;
    const stepRatio = applyRatio ? props.ratio : 1;

    if (
      (parent.hasInertia && props.recalculateBoundsOnInertia) ||
      !parent.hasInertia
    ) {
      this.calculateBounds();
    }

    this._timestamp = performance.now();
    this._prev = { ...this.current };
    this._current = { x, y, angle, time };
    const { _current: current, _prev: prev, overflow } = this;

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

    this._movement.x = applyRubber('x', this._rawMovement.x, bounds, overflow);
    this._movement.y = applyRubber('y', this._rawMovement.y, bounds, overflow);
    this._movement.angle = applyRubber(
      'angle',
      this._rawMovement.angle,
      bounds,
      overflow,
    );

    const { hasInertia } = parent;

    this._snap.applyAxis('x', this._movement, hasInertia);
    this._snap.applyAxis('y', this._movement, hasInertia);
    this._snap.applyAxis('angle', this._movement, hasInertia);
  }

  /** Calculate bounds */
  public calculateBounds() {
    return this._bounds.calculate(this.coords);
  }
}
