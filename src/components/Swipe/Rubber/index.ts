import { ModulePart, now } from '@/internal';

import { Swipe } from '..';
import { Timeline } from '../../Timeline';
import { SwipeCoords } from '../Coords';
import { TSwipeAxis } from '../Coords/types';
import { ISwipeState, ISwipeVec3 } from '../global';
import {
  resolveCanRubber,
  resolveOverscroll,
  resolveRubberDuration,
  resolveRubberEase,
} from '../resolveProps';

/**
 * Release settle via {@link Timeline}.
 *
 * Per axis prefers nearest snap ({@link SwipeCoords.getSnapCoord}); otherwise
 * cancels bounds `exceeds` when `overscroll > 0`. With `overscroll <= 0`,
 * exceeds settle is skipped (and snap settle is skipped on axes that exceed).
 * Gated by `canRubber` (blocks the entire settle).
 *
 * @internal
 */
export class SwipeRubber extends ModulePart<Swipe> {
  private _tm?: Timeline;

  constructor(
    parent: Swipe,
    private _coords: SwipeCoords,
    private _onMove: (state: ISwipeState) => void,
  ) {
    super(parent);
  }

  /** Whether the settle timeline is running. */
  get has() {
    return !!this._tm;
  }

  /**
   * Animates toward snap or back inside bounds after overscroll.
   * No-op when `canRubber` is false or there is nothing to settle.
   */
  public release(targetDuration?: number) {
    this.cancel();

    const { props } = this;

    if (!resolveCanRubber(props)()) {
      return;
    }

    const delta = this._getReleaseDelta();

    if (!delta) {
      return;
    }

    const start = { ...this.parent.current };

    const tm = new Timeline({
      duration: targetDuration ?? resolveRubberDuration(props),
      ease: resolveRubberEase(props),
    });

    this._tm = tm;

    this._coords.syncTempAngle();

    tm.on('update', ({ eased }) => {
      this._onMove({
        x: start.x - delta.x * eased,
        y: start.y - delta.y * eased,
        angle: start.angle - delta.angle * eased,
        time: now(),
      });
    });

    tm.on('end', () => this.cancel());

    tm.play();
  }

  /**
   * Per-axis delta to subtract from `current` over the timeline.
   * Prefers nearest snap (unless the axis exceeds and `overscroll <= 0`);
   * otherwise uses bounds `exceeds` when `overscroll > 0`.
   */
  private _getReleaseDelta(): ISwipeVec3 | null {
    const { props, _coords: coords } = this;
    const { rawMovement, exceeds } = coords;
    const allowExceeds = resolveOverscroll(props) > 0;

    const delta: ISwipeVec3 = { x: 0, y: 0, angle: 0 };
    let hasDelta = false;

    const axes: TSwipeAxis[] = ['x', 'y', 'angle'];

    axes.forEach((axis) => {
      const snap = coords.getSnapCoord(axis, rawMovement[axis]);

      if (snap !== undefined) {
        if (exceeds?.[axis] && !allowExceeds) {
          return;
        }

        const d = rawMovement[axis] - snap;

        if (d !== 0) {
          delta[axis] = d;
          hasDelta = true;
        }

        return;
      }

      if (allowExceeds && exceeds?.[axis]) {
        delta[axis] = exceeds[axis];
        hasDelta = true;
      }
    });

    return hasDelta ? delta : null;
  }

  /** Stops the settle timeline. */
  public cancel() {
    this._tm?.destroy();
    this._tm = undefined;
  }
}
