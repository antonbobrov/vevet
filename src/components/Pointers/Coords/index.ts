import { unwrapAngleDelta } from '@/internal/unwrapAngle';
import { ModulePart } from '@/shared/ModulePart';

import { Pointers } from '..';
import { IPointersVec2 } from '../global';

import { IPointersMove } from './types';

/**
 * Aggregates multi-pointer gesture metrics for the {@link Pointers.move} callback.
 *
 * @internal
 */
export class PointersCoords extends ModulePart<Pointers> {
  private _data: IPointersMove | null = null;

  /** Unwrapped angle state for cumulative rotation. */
  private _angle = { raw: 0, unwrapped: 0, unwrappedStart: 0 };

  /**
   * Latest aggregated gesture snapshot, or `null` before the first `move` after `start`.
   */
  get data() {
    return this._data;
  }

  /** Clears gesture state (on `end`, cancel, or cleanup). */
  public reset() {
    this._data = null;
    this._angle = { raw: 0, unwrapped: 0, unwrappedStart: 0 };
  }

  /**
   * Recomputes pan, pinch, and rotate metrics from current pointer positions.
   *
   * `scale` and `angle` update only when at least two pointers are active.
   */
  public move(points: IPointersVec2[]) {
    const center = this._getAverageCenter(points);
    const distance = Math.max(this._getAverageDistance(points), 0.001);
    const rawAngle = this._getAngle(points);

    if (!this._data) {
      this._angle = {
        raw: rawAngle,
        unwrapped: rawAngle,
        unwrappedStart: rawAngle,
      };

      this._data = {
        center,
        prevCenter: { ...center },
        startCenter: { ...center },
        distance,
        prevDistance: distance,
        startDistance: distance,
        scale: 1,
        prevScale: 1,
        angle: 0,
        prevAngle: 0,
      };

      return;
    }

    this._data.prevCenter = { ...this._data.center };
    this._data.center = { ...center };

    this._data.prevDistance = this._data.distance;
    this._data.distance = distance;

    if (points.length >= 2) {
      this._data.prevScale = this._data.scale;
      this._data.scale = distance / this._data.startDistance;

      this._angle.unwrapped += unwrapAngleDelta(rawAngle, this._angle.raw);
      this._angle.raw = rawAngle;

      this._data.prevAngle = this._data.angle;
      this._data.angle = this._angle.unwrapped - this._angle.unwrappedStart;
    }
  }

  /** Returns the angle between the first two pointers (deg). */
  private _getAngle(points: IPointersVec2[]) {
    if (points.length < 2) {
      return 0;
    }

    const [first, second] = points;

    return (Math.atan2(second.y - first.y, second.x - first.x) * 180) / Math.PI;
  }

  /** Returns the average center of pointer positions. */
  private _getAverageCenter(points: IPointersVec2[]) {
    if (points.length === 1) {
      return points[0];
    }

    const sum = points.reduce(
      (acc, p) => ({
        x: acc.x + p.x,
        y: acc.y + p.y,
      }),
      { x: 0, y: 0 },
    );

    return {
      x: sum.x / points.length,
      y: sum.y / points.length,
    };
  }

  /** Returns the average distance from the center to each pointer. */
  private _getAverageDistance(points: IPointersVec2[]) {
    if (points.length <= 1) {
      return 0;
    }

    const center = this._getAverageCenter(points);

    const total = points.reduce(
      (sum, p) => sum + Math.hypot(p.x - center.x, p.y - center.y),
      0,
    );

    return total / points.length;
  }
}
