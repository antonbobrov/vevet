import { isFiniteNumber, ModulePart } from '@/internal';
import { closest } from '@/utils';

import { Swipe } from '../..';
import { ISwipeVec3 } from '../../global';
import { TSwipeAxis } from '../types';

/**
 * Snap targets in movement space during a gesture.
 *
 * @internal
 */
export class SwipeSnap extends ModulePart<Swipe> {
  /** Active snap target per axis, if any. */
  private _targets: { x?: number; y?: number; angle?: number } = {};

  /** Resolved snap target per axis during the current gesture. */
  get targets() {
    return this._targets;
  }

  /** Snaps one movement axis toward the nearest target. */
  public applyAxis(
    axis: TSwipeAxis,
    movement: ISwipeVec3,
    hasInertia: boolean,
  ) {
    const { props } = this;

    const snap = props.snap?.();

    if (!snap) {
      this._targets[axis] = undefined;

      return;
    }

    const snaps = snap[axis];

    if (!snaps?.length) {
      this._targets[axis] = undefined;

      return;
    }

    const value = movement[axis];
    const target = closest(value, snaps);
    const radius = props.snapRadius;

    if (isFiniteNumber(radius) && Math.abs(target - value) > Math.abs(radius)) {
      this._targets[axis] = undefined;

      return;
    }

    this._targets[axis] = target;

    if (!hasInertia) {
      movement[axis] = target;
    }
  }
}
