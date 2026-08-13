import { ModulePart, onlyFinite } from '@/internal';
import { toPixels } from '@/utils';
import { clamp, loop } from '@/utils/math';

import { Snap } from '../..';

/**
 * Track state: current/target values, impulse, bounds, and loop math.
 *
 * @internal
 */
export class SnapTrack extends ModulePart<Snap> {
  private _impulse = { current: 0, target: 0 };

  private _value = { current: 0, target: 0 };

  get impulse() {
    return this._impulse.current;
  }

  get current() {
    return this._value.current;
  }

  set current(value: number) {
    this._value.current = value;
  }

  get target() {
    return this._value.target;
  }

  set target(value: number) {
    const containerSize = this.parent.containerSize;
    const diff = value - this._value.target;

    this._value.target = value;

    this._impulse.target += containerSize
      ? onlyFinite(diff / containerSize)
      : 0;

    this._impulse.target = clamp(this._impulse.target, -1, 1);
  }

  get impulseRef() {
    return this._impulse;
  }

  get canLoop() {
    return this.props.loop && this.parent.slides.length > 1;
  }

  get loopedCurrent() {
    return this.loopCoord(this.current);
  }

  /** Alignment offset applied when mapping track value to slide coords. */
  get offset() {
    const { origin, containerSize, firstSlideSize } = this.parent;

    if (origin === 'center') {
      return containerSize / 2 - firstSlideSize / 2;
    } else if (origin === 'end') {
      return containerSize - firstSlideSize;
    }

    return 0;
  }

  get loopCount() {
    if (!this.canLoop) {
      return 0;
    }

    return Math.floor(onlyFinite(this.current / this.max));
  }

  get min() {
    const { containerSize, origin, firstSlide } = this.parent;

    if (this.canLoop) {
      return 0;
    }

    if (origin === 'center') {
      if (firstSlide.size > containerSize) {
        return containerSize / 2 - firstSlide.size / 2;
      }
    }

    if (origin === 'end') {
      if (firstSlide.size > containerSize) {
        return containerSize - firstSlide.size;
      }
    }

    return 0;
  }

  get max() {
    const { canLoop, props } = this;
    const { containerSize, origin, firstSlide, lastSlide } = this.parent;

    const lastCoordWithSlide = lastSlide.staticCoord + lastSlide.size;

    let max = canLoop
      ? lastCoordWithSlide + toPixels(props.gap)
      : lastCoordWithSlide - containerSize;

    if (canLoop) {
      return max;
    }

    if (origin === 'center') {
      max += containerSize / 2 - firstSlide.size / 2;

      if (lastSlide.size < containerSize) {
        max += containerSize / 2 - lastSlide.size / 2;
      }
    }

    if (origin === 'end') {
      max += containerSize - firstSlide.size;
    }

    if (origin === 'start') {
      max = Math.max(max, 0);
    }

    return max;
  }

  get progress() {
    return onlyFinite(this.current / this.max);
  }

  get isStart() {
    if (this.props.loop) {
      return false;
    }

    return Math.floor(this.target) <= Math.floor(this.min);
  }

  get isEnd() {
    if (this.props.loop) {
      return false;
    }

    return Math.floor(this.target) >= Math.floor(this.max);
  }

  public set(value: number) {
    this.current = value;
    this.target = value;
    this._impulse.current = 0;
    this._impulse.target = 0;
  }

  public loopCoord(coord: number) {
    return this.canLoop ? loop(coord, this.min, this.max) : coord;
  }
}
