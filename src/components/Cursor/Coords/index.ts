import { ModulePart } from '@/internal';

import { LERP_APPROXIMATION } from '../constants';
import { SmoothNumber } from '../SmoothNumber';

import type { Cursor } from '..';

/**
 * Pointer x/y plus derived angle and velocity, backed by {@link SmoothNumber}.
 *
 * @internal
 */
export class CursorCoords extends ModulePart<Cursor> {
  private _x = new SmoothNumber(0);
  private _y = new SmoothNumber(0);
  private _angle = new SmoothNumber(0);
  private _velocity = new SmoothNumber(0);

  constructor(parent: Cursor) {
    super(parent);
  }

  get current() {
    return {
      x: this._x.current,
      y: this._y.current,
      angle: this._angle.current,
      velocity: this._velocity.current,
    };
  }

  get target() {
    return {
      x: this._x.target,
      y: this._y.target,
      angle: this._angle.target,
      velocity: this._velocity.target,
    };
  }

  public syncXY(x: number, y: number) {
    this._x.syncWith(x);
    this._y.syncWith(y);
  }

  public setXYCurrent(x: number, y: number) {
    this._x.current = x;
    this._y.current = y;
  }

  public move(x: number, y: number) {
    const prevX = this._x.target;
    const prevY = this._y.target;
    const prevAngle = this._angle.target;

    const deltaX = prevX - this._x.current;
    const deltaY = prevY - this._y.current;

    const rawAngle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;
    const targetAngle =
      prevAngle + ((((rawAngle - prevAngle) % 360) + 540) % 360) - 180;

    const velocity =
      Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2) * 2, 150) / 150;

    this._x.target = x;
    this._y.target = y;
    this._angle.target = targetAngle;
    this._velocity.target = velocity;
  }

  public syncWithTarget() {
    this._x.syncWithTarget();
    this._y.syncWithTarget();
    this._angle.syncWithTarget();
    this._velocity.syncWithTarget();
  }

  public xTo(target: number, ease: number) {
    this._x.to(target, ease, LERP_APPROXIMATION);
  }

  public yTo(target: number, ease: number) {
    this._y.to(target, ease, LERP_APPROXIMATION);
  }

  public lerpVelocityAndAngle(ease: number) {
    this._angle.toTarget(ease, LERP_APPROXIMATION);

    this._velocity.targetFriction(0, ease, LERP_APPROXIMATION);
    this._velocity.toTarget(ease, LERP_APPROXIMATION);
  }
}
