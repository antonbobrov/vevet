import { initVevet } from '@/global/initVevet';

import { ISwipeCoords } from '../global';

import type { ISwipeBounds, ISwipeState, ISwipeVec3, Swipe } from '..';

const START_VEC3 = { x: 0, y: 0, angle: 0 };
const START_STATE = { ...START_VEC3, time: 0 };

export class SwipeCoords {
  constructor(private _ctx: Swipe) {}

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

  /** Accumulated movement since class initialization. */
  private _total: ISwipeVec3 = { ...START_VEC3 };

  /** Temporary angle data */
  private _tempAngle = { raw: 0, unwrapped: 0 };

  /** Cached bounds from `diffBounds` (on swipe start). */
  private _bounds?: ISwipeBounds | null;

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

  get total() {
    return this._total;
  }

  get bounds() {
    return this._bounds;
  }

  get coords(): ISwipeCoords {
    const { start, prev, current, diff, step, accum, total } = this;

    return { start, prev, current, diff, step, accum, total };
  }

  /** Parses pointer coordinates relative to the container */
  public decode(event: MouseEvent | TouchEvent): ISwipeState {
    const vevet = initVevet();
    const { props, container } = this._ctx;
    const { ratio } = props;

    const clientX =
      'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY =
      'touches' in event ? event.touches[0].clientY : event.clientY;

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
      x: x * ratio,
      y: y * ratio,
      angle,
      time: performance.now(),
    };
  }

  public setStart(state: ISwipeState) {
    const { props } = this._ctx;

    this._tempAngle = { raw: state.angle, unwrapped: state.angle };

    this._start = { ...state };
    this._prev = { ...state };
    this._current = { ...state };
    this._diff = { ...START_VEC3, time: 0 };
    this._step = { ...START_VEC3, time: 0 };
    this._accum = { ...START_VEC3 };

    this._bounds = props.bakeBounds && props.bakeBounds();
  }

  public resetTempAngle() {
    this._tempAngle.raw = this._current.angle;
    this._tempAngle.unwrapped = this._current.angle;
  }

  public update({ x, y, angle, time }: ISwipeState) {
    const { start, bounds } = this;

    // Save
    this._prev = { ...this.current };
    this._current = { x, y, angle, time };
    const { _current: current, _prev: prev } = this;

    // Update angle
    this._updateTempAngle(angle);
    current.angle = this._tempAngle.unwrapped;

    // Apply rubber

    if (bounds) {
      current.x = this._applyRubber(current.x, start.x, bounds.x);
      current.y = this._applyRubber(current.y, start.y, bounds.y);
      current.angle = this._applyRubber(
        current.angle,
        start.angle,
        bounds.angle,
      );
    }

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

    this._total = {
      x: this._total.x + this._step.x,
      y: this._total.y + this._step.y,
      angle: this._total.angle + this._step.angle,
    };
  }

  /** Unwrap raw atan2 angle and accumulate into _angle */
  private _updateTempAngle(rawAngle: number) {
    const halfTurn = 180;

    let angleDelta = rawAngle - this._tempAngle.raw;
    if (angleDelta > halfTurn) {
      angleDelta -= halfTurn * 2;
    } else if (angleDelta < -halfTurn) {
      angleDelta += halfTurn * 2;
    }

    this._tempAngle.unwrapped += angleDelta;
    this._tempAngle.raw = rawAngle;
  }

  /** Apply rubber to coordinates */
  private _applyRubber(value: number, origin: number, bounds?: number[]) {
    const { _ctx: ctx } = this;
    const overflow = Math.abs(ctx.props.overflow());

    if (ctx.hasInertia || ctx.hasBounce || !bounds) {
      return value;
    }

    const diff = value - origin;
    const max = Math.max(...bounds);
    const min = Math.min(...bounds);

    const rubberScale = 100;

    if (diff > max) {
      const over = diff - max;
      const rubber = overflow * (1 - Math.exp(-over / rubberScale));

      return origin + max + rubber;
    }

    if (diff < min) {
      const over = diff - min;
      const rubber = -overflow * (1 - Math.exp(over / rubberScale));

      return origin + min + rubber;
    }

    return value;
  }
}
