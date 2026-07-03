import { ModulePart } from '@/shared/ModulePart';

import { Swipe } from '..';
import { ISwipeState, ISwipeVec2 } from '../global';

import { TSwipeGestureSample, TSwipeInputType } from './types';

export * from './types';

/**
 * Gesture activation state: pending threshold → swiping → ended / aborted.
 *
 * - **pending** — pointer down, below `threshold` or `minTime` not met
 * - **swiping** — `start` has fired; further samples are moves
 * - **aborted** — `axis` or `willAbort` rejected the gesture
 *
 * @internal
 */
export class SwipeGesture extends ModulePart<Swipe> {
  private _isSwiping = false;

  private _isAborted = false;

  private _startTime?: number;

  private _startCoord?: ISwipeVec2;

  /** Whether the swipe threshold has been passed and `start` fired. */
  get isSwiping() {
    return this._isSwiping;
  }

  /** Whether the gesture was aborted (axis / `willAbort`). */
  get isAborted() {
    return this._isAborted;
  }

  /**
   * Processes a pointer sample and returns the next gesture action.
   */
  public sample(
    state: ISwipeState,
    type: TSwipeInputType,
  ): TSwipeGestureSample {
    if (this._isAborted) {
      return { type: 'ignore' };
    }

    if (!this._startCoord) {
      this._startCoord = { ...state };
    }

    if (!this._startTime) {
      this._startTime = Date.now();
    }

    if (!this._isSwiping) {
      if (!this._canActivate(state, type)) {
        return { type: 'pending' };
      }

      this._isSwiping = true;
      this._startCoord = { ...state };

      return { type: 'activate', state };
    }

    return { type: 'move', state };
  }

  /** Clears per-session flags after pointer release. */
  public clearSession() {
    this._startTime = undefined;
    this._isAborted = false;
  }

  /** Resets activation tracking (after swipe end or abort). */
  public reset() {
    this._startCoord = undefined;
    this._isSwiping = false;
  }

  private _canActivate(state: ISwipeState, type: TSwipeInputType) {
    const { _startCoord: startCoord, _startTime: startTime } = this;

    if (!startCoord || !startTime) {
      return false;
    }

    const { threshold, minTime, axis, willAbort } = this.props;

    const diff = {
      x: state.x - startCoord.x,
      y: state.y - startCoord.y,
    };

    const dist = Math.hypot(diff.x, diff.y);

    if (dist < threshold) {
      return false;
    }

    if (Date.now() - startTime < minTime) {
      return false;
    }

    if (axis) {
      const rawAngle =
        (Math.atan2(Math.abs(diff.y), Math.abs(diff.x)) * 180) / Math.PI;

      const normalizedAngle = axis === 'x' ? rawAngle : 90 - rawAngle;

      if (normalizedAngle > 45) {
        this._abort();

        return false;
      }
    }

    const shouldAbort = willAbort({
      type,
      state,
      start: startCoord,
      diff,
    });

    if (shouldAbort) {
      this._abort();

      return false;
    }

    return true;
  }

  private _abort() {
    this.reset();
    this._isAborted = true;

    this.callbacks.emit('abort', undefined);
  }
}
