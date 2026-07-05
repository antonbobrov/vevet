import { ModulePart } from '@/internal';

import { Swipe } from '../..';
import { ISwipeAxes, ISwipeCoords, ISwipeVec3 } from '../../global';

/**
 * Movement bounds and overflow past limits.
 *
 * `calculate()` normalizes prop bounds to `[min, max]` per axis.
 * `exceeds()` measures how far `rawMovement` sits outside those limits (for bounce).
 *
 * @internal
 */
export class SwipeBounds extends ModulePart<Swipe> {
  /** Cached normalized bounds (refreshed on swipe start / update). */
  private _bounds: ISwipeAxes | null = null;

  /** Normalized movement limits (`[min, max]` per defined axis). */
  get bounds() {
    return this._bounds;
  }

  /** Recalculates movement bounds from the `bounds` prop. */
  public calculate(coords: ISwipeCoords) {
    const { props } = this;

    if (!props.bounds) {
      this._bounds = null;

      return null;
    }

    const bounds = props.bounds(coords);
    const d = [-Infinity, Infinity];

    const x = bounds?.x
      ? [Math.min(...bounds.x), Math.max(...bounds.x)]
      : [...d];

    const y = bounds?.y
      ? [Math.min(...bounds.y), Math.max(...bounds.y)]
      : [...d];

    const angle = bounds?.angle
      ? [Math.min(...bounds.angle), Math.max(...bounds.angle)]
      : [...d];

    this._bounds = { x, y, angle };

    return this._bounds;
  }

  /**
   * Overflow past `bounds` per axis in movement space.
   * Zero when inside limits; used for bounce-back.
   */
  public exceeds(rawMovement: ISwipeVec3) {
    const { _bounds: bounds } = this;

    if (!bounds) {
      return null;
    }

    return {
      x: bounds.x ? this._getExceeds(rawMovement.x, bounds.x) : 0,
      y: bounds.y ? this._getExceeds(rawMovement.y, bounds.y) : 0,
      angle: bounds.angle
        ? this._getExceeds(rawMovement.angle, bounds.angle)
        : 0,
    };
  }

  private _getExceeds(value: number, axisBounds: number[]) {
    let diff = 0;

    if (value < axisBounds[0]) {
      diff = value - axisBounds[0];
    } else if (value > axisBounds[1]) {
      diff = value - axisBounds[1];
    }

    return diff;
  }
}
