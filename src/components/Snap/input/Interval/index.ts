import { isFiniteNumber, ModulePart } from '@/internal';

import { Snap } from '../..';

/**
 * Autoplay interval (`next` / `prev`) when the scene is idle.
 *
 * @internal
 */
export class SnapInterval extends ModulePart<Snap> {
  private _interval?: NodeJS.Timeout;

  constructor(parent: Snap) {
    super(parent);

    this.callbacks.on('update', this._handleUpdate.bind(this), {
      protected: true,
    });

    this.onDestroy(() => this._clear());
  }

  private get allowInterval() {
    const { parent } = this;

    return (
      !parent.isSwiping &&
      !parent.hasInertia &&
      !parent.isTransitioning &&
      !parent.isInterpolating &&
      isFiniteNumber(parent.props.interval)
    );
  }

  private _handleUpdate() {
    if (!this.allowInterval) {
      this._clear();

      return;
    }

    if (!this._interval) {
      this._interval = setInterval(
        () => this._handleInterval(),
        this.props.interval,
      );
    }
  }

  private _handleInterval() {
    if (this.props.intervalDirection === 'prev') {
      this.parent.prev();
    } else {
      this.parent.next();
    }
  }

  private _clear() {
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = undefined;
    }
  }
}
