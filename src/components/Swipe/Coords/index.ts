import { initVevet } from '@/global/initVevet';

import { ISwipeCoords, ISwipeMatrix, ISwipeVec2 } from '../global';

import type { Swipe } from '..';

export class SwipeCoords {
  constructor(private _ctx: Swipe) {}

  /** Event timestamp. */
  private _timestamp = 0;

  /** Start position. */
  private _start: ISwipeMatrix = { x: 0, y: 0, angle: 0 };

  /** Previous position. */
  private _prev: ISwipeMatrix = { x: 0, y: 0, angle: 0 };

  /** Current position. */
  private _current: ISwipeMatrix = { x: 0, y: 0, angle: 0 };

  /** Movement offset from start. */
  private _diff: ISwipeMatrix = { x: 0, y: 0, angle: 0 };

  /** Movement offset from previous position. */
  private _step: ISwipeMatrix = { x: 0, y: 0, angle: 0 };

  /** Total accumulated movement. */
  private _accum: ISwipeVec2 = { x: 0, y: 0 };

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

  get coords(): ISwipeCoords {
    const { timestamp, start, prev, current, diff, step, accum } = this;

    return { timestamp, start, prev, current, diff, step, accum };
  }

  /** Parses pointer coordinates relative to the container */
  public decode(event: MouseEvent | TouchEvent): ISwipeMatrix {
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
      angle: angle * ratio,
    };
  }

  public setStart(matrix: ISwipeMatrix) {
    this._timestamp = performance.now();
    this._start = { ...matrix };
    this._prev = { ...matrix };
    this._current = { ...matrix };
    this._diff = { x: 0, y: 0, angle: 0 };
    this._step = { x: 0, y: 0, angle: 0 };
    this._accum = { x: 0, y: 0 };
  }

  public update({ x, y, angle }: ISwipeMatrix) {
    // prepare data
    const start = { ...this.start };
    const prev = { ...this.current };
    const current = { x, y, angle };

    // update coords

    this._timestamp = performance.now();
    this._prev = prev;
    this._current = current;

    let angleDelta = this._current.angle - this._prev.angle;
    if (angleDelta > 180) {
      angleDelta -= 360;
    } else if (angleDelta < -180) {
      angleDelta += 360;
    }

    this._step = {
      x: current.x - prev.x,
      y: current.y - prev.y,
      angle: angleDelta,
    };

    this._diff = {
      x: current.x - start.x,
      y: current.y - start.y,
      angle: this._diff.angle + this._step.angle,
    };

    this._accum = {
      x: this._accum.x + Math.abs(this._step.x),
      y: this._accum.y + Math.abs(this._step.y),
    };
  }
}
