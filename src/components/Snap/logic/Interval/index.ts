import { isFiniteNumber } from '@/internal/isFiniteNumber';

import { Snap } from '../..';
import { SnapLogic } from '../SnapLogic';

export class SnapInterval extends SnapLogic {
  /** Interval reference */
  private _interval?: NodeJS.Timeout;

  constructor(snap: Snap) {
    super(snap);

    snap.on('update', () => this._handleUpdate(), { protected: true });

    this.addDestructor(() => {
      this._clearInterval();
    });
  }

  private get allowInterval() {
    const { snap } = this;

    if (
      snap.isSwiping ||
      snap.hasInteria ||
      snap.isTransitioning ||
      snap.isInterpolating ||
      !isFiniteNumber(snap.props.interval)
    ) {
      return false;
    }

    return true;
  }

  /** Handle Snap update */
  private _handleUpdate() {
    const { snap } = this;

    if (!this.allowInterval) {
      this._clearInterval();

      return;
    }

    if (!this._interval) {
      this._interval = setInterval(() => {
        this._handleInterval();
      }, snap.props.interval);
    }
  }

  /** Handle interval action */
  private _handleInterval() {
    const { snap } = this;

    if (snap.props.intervalDirection === 'prev') {
      snap.prev();
    } else {
      snap.next();
    }
  }

  /** Clear interval */
  private _clearInterval() {
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = undefined;
    }
  }
}
