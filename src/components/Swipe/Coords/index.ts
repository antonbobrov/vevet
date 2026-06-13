import { initVevet } from '@/global/initVevet';
import { isFiniteNumber } from '@/internal/isFiniteNumber';
import { unwrapAngleDelta } from '@/internal/unwrapAngle';
import { closest } from '@/utils';

import { ISwipeCoords, ISwipeVec2 } from '../global';

import type { ISwipeAxes, ISwipeState, ISwipeVec3, Swipe } from '..';

const START_VEC3 = { x: 0, y: 0, angle: 0 };
const START_STATE = { ...START_VEC3, time: 0 };

interface IProps {
  container: Element;
  props: typeof Swipe.prototype.props;
  hasInertia: () => boolean;
  recalculateBoundsOnInertia: () => boolean;
}

export class SwipeCoords {
  constructor(private ctx: IProps) {}

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
  private _tempAngle = { raw: 0, unwrapped: 0 };

  /** Active snap target per axis, if any. */
  private _snap: { x?: number; y?: number; angle?: number } = {};

  /** Cached normalized bounds (refreshed on swipe start). */
  private _bounds: ISwipeAxes | null = null;

  /** Current scale modifier. */
  private _scale = 1;

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
  get prevMovement(): ISwipeVec3 {
    return this._prevMovement;
  }

  /** Raw movement before rubber (same space as `bounds`). */
  get rawMovement() {
    return this._rawMovement;
  }

  /** Normalized movement limits (`[min, max]` per defined axis). */
  get bounds() {
    if (this._bounds) {
      return this._bounds;
    }

    return this.calculateBounds();
  }

  get overflow() {
    return this.ctx.props.overflow ? Math.abs(this.ctx.props.overflow()) : 0;
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
    return this._snap;
  }

  /**
   * Overflow past `bounds` per axis in movement space.
   * Zero when inside limits; used for bounce-back.
   */
  get exceeds() {
    const { _rawMovement: movement, bounds } = this;

    if (!bounds) {
      return null;
    }

    let xDiff = 0;
    let yDiff = 0;
    let aDiff = 0;

    if (bounds.x) {
      if (movement.x < bounds.x[0]) {
        xDiff = movement.x - bounds.x[0];
      } else if (movement.x > bounds.x[1]) {
        xDiff = movement.x - bounds.x[1];
      }
    }

    if (bounds.y) {
      if (movement.y < bounds.y[0]) {
        yDiff = movement.y - bounds.y[0];
      } else if (movement.y > bounds.y[1]) {
        yDiff = movement.y - bounds.y[1];
      }
    }

    if (bounds.angle) {
      if (movement.angle < bounds.angle[0]) {
        aDiff = movement.angle - bounds.angle[0];
      } else if (movement.angle > bounds.angle[1]) {
        aDiff = movement.angle - bounds.angle[1];
      }
    }

    return {
      x: xDiff,
      y: yDiff,
      angle: aDiff,
    };
  }

  /** Parses pointer coordinates relative to the container */
  public decode(event: MouseEvent | TouchEvent | ISwipeVec2): ISwipeState {
    const vevet = initVevet();
    const { props, container } = this.ctx;

    let clientX = 0;
    let clientY = 0;

    if ('touches' in event) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else if ('type' in event) {
      clientX = event.clientX;
      clientY = event.clientY;
    } else {
      clientX = event.x;
      clientY = event.y;
    }

    let x = clientX;
    let y = clientY;

    let centerX = vevet.width / 2;
    let centerY = vevet.height / 2;

    if (props.relative) {
      const bounding = container.getBoundingClientRect();

      x = clientX - bounding.left;
      y = clientY - bounding.top;
      centerX = bounding.left + bounding.width / 2;
      centerY = bounding.top + bounding.height / 2;
    }

    const angleRad = Math.atan2(clientY - centerY, clientX - centerX);
    const angle = (angleRad * 180) / Math.PI;

    return {
      x: x,
      y: y,
      angle,
      time: performance.now(),
    };
  }

  /** Apply scale and optionally zoom toward an origin in movement space. */
  public applyScale(
    value: number,
    originProp?: MouseEvent | TouchEvent | ISwipeVec2,
  ) {
    if (this._scale === value) {
      return;
    }

    if (originProp) {
      const origin = this.decode(originProp);
      const ratio = value / this._scale;

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

  /** Update coordinates */
  public update({ x, y, angle, time }: ISwipeState, applyRatio = true) {
    // Vars
    const { start, ctx } = this;
    const stepRatio = applyRatio ? ctx.props.ratio : 1;

    // Update bounds
    if (
      (ctx.hasInertia() && ctx.recalculateBoundsOnInertia()) ||
      !ctx.hasInertia()
    ) {
      this.calculateBounds();
    }

    // Save
    this._timestamp = performance.now();
    this._prev = { ...this.current };
    this._current = { x, y, angle, time };
    const { _current: current, _prev: prev, overflow } = this;

    // Update angle
    this._updateTempAngle(angle);
    current.angle = this._tempAngle.unwrapped;

    // Update coords

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

    this._movement.x = this._applyRubber('x', overflow);
    this._movement.y = this._applyRubber('y', overflow);
    this._movement.angle = this._applyRubber('angle', overflow);

    this._snapMovementAxis('x');
    this._snapMovementAxis('y');
    this._snapMovementAxis('angle');
  }

  /** Snap movement axis */
  private _snapMovementAxis(axis: 'x' | 'y' | 'angle') {
    const { props, hasInertia } = this.ctx;

    const snap = props.snap?.();
    if (!snap) {
      this._snap[axis] = undefined;

      return;
    }

    const snaps = snap[axis];
    if (!snaps?.length) {
      this._snap[axis] = undefined;

      return;
    }

    const value = this._movement[axis];
    const target = closest(value, snaps);
    const radius = props.snapRadius;

    if (isFiniteNumber(radius) && Math.abs(target - value) > Math.abs(radius)) {
      this._snap[axis] = undefined;

      return;
    }

    this._snap[axis] = target;

    if (!hasInertia()) {
      this._movement[axis] = target;
    }
  }

  /** Calculate bounds */
  public calculateBounds() {
    const { props } = this.ctx;

    if (!props.bounds) {
      this._bounds = null;

      return;
    }

    const bounds = props.bounds(this.coords);
    const d = [-Infinity, Infinity];

    const x = bounds?.x
      ? [Math.min(...bounds.x), Math.max(...bounds.x)]
      : [...d];

    const y = bounds?.y
      ? [Math.min(...bounds.y), Math.max(...bounds.y)]
      : [...d];

    const a = bounds?.angle
      ? [Math.min(...bounds.angle), Math.max(...bounds.angle)]
      : [...d];

    this._bounds = { x, y, angle: a };

    return this._bounds;
  }

  /** Unwrap raw atan2 angle and accumulate into _angle */
  private _updateTempAngle(rawAngle: number) {
    this._tempAngle.unwrapped += unwrapAngleDelta(
      rawAngle,
      this._tempAngle.raw,
    );

    this._tempAngle.raw = rawAngle;
  }

  /** Apply rubber-band past movement bounds. */
  private _applyRubber(axis: 'x' | 'y' | 'angle', overflow: number) {
    const temp = this._rawMovement[axis];
    const bounds = this.bounds?.[axis];

    if (!bounds) {
      return temp;
    }

    const [min, max] = bounds;

    if (temp >= min && temp <= max) {
      return temp;
    }

    if (temp < min) {
      return min - this._rubberDistance(min - temp, overflow);
    }

    return max + this._rubberDistance(temp - max, overflow);
  }

  /**
   * Overscroll → rubber displacement
   */
  private _rubberDistance(overscroll: number, limit: number) {
    if (overscroll <= 0 || limit <= 0) {
      return 0;
    }

    return (limit * overscroll) / (limit + overscroll);
  }
}
