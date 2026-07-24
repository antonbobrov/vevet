import { lerp } from '@/utils';

export class SmoothNumber {
  private _current: number;

  private _target: number;

  constructor(value: number) {
    this._current = value;
    this._target = value;
  }

  get current() {
    return this._current;
  }

  set current(value: number) {
    this._current = value;
  }

  get target() {
    return this._target;
  }

  set target(value: number) {
    this._target = value;
  }

  get interpolated() {
    return this._current === this._target;
  }

  public toTarget(ease: number, appx?: number) {
    this._current = lerp(this._current, this._target, ease, appx);

    return this._current;
  }

  public to(target: number, ease: number, appx?: number) {
    this._current = lerp(this._current, target, ease, appx);

    return this._current;
  }

  public syncWithTarget() {
    this.syncWith(this._target);
  }

  public syncWith(value: number) {
    this._current = value;
    this._target = value;
  }

  public targetFriction(target: number, ease: number, appx: number) {
    this._target = lerp(this._target, target, ease, appx);
  }
}
