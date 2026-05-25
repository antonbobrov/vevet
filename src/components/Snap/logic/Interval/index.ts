import { isFiniteNumber } from '@/internal/isFiniteNumber';

import { SnapLogic } from '..';
import { Snap } from '../..';

export class SnapInterval extends SnapLogic {
  /** Interval reference */
  private _interval?: NodeJS.Timeout;

  constructor(
    ctx: Snap,
    private _onPrev: () => void,
    private _onNext: () => void,
  ) {
    super(ctx);

    this.callbacks.on('update', () => this._handleUpdate(), {
      protected: true,
    });

    this.addDestructor(() => this._clearInterval());
  }

  private get allowInterval() {
    return (
      !this.isSwiping &&
      !this.hasInertia &&
      !this.isTransitioning &&
      !this.isInterpolating &&
      isFiniteNumber(this.props.interval)
    );
  }

  /** Handle Snap update */
  private _handleUpdate() {
    if (!this.allowInterval) {
      this._clearInterval();

      return;
    }

    if (!this._interval) {
      this._interval = setInterval(
        () => this._handleInterval(),
        this.props.interval,
      );
    }
  }

  /** Handle interval action */
  private _handleInterval() {
    if (this.props.intervalDirection === 'prev') {
      this._onPrev();
    } else {
      this._onNext();
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
