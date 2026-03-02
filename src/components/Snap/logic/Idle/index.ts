import { Snap } from '../..';
import { SnapLogic } from '../SnapLogic';

export class SnapIdle extends SnapLogic {
  /** Debounce timeout reference */
  private _timeout?: NodeJS.Timeout;

  constructor(snap: Snap) {
    super(snap);

    snap.on('update', () => this._handleUpdate(), { protected: true });

    this.addDestructor(() => {
      this._clear();
    });
  }

  /** Check if idle */
  get isIdle() {
    const { snap } = this;

    if (snap.isSwiping || snap.isInterpolating || snap.isTransitioning) {
      return false;
    }

    return true;
  }

  /** Handle Snap update */
  private _handleUpdate() {
    this._clear();

    this._timeout = setTimeout(() => {
      this._handleTimeout();
    }, 10);
  }

  /** Handle timeout action */
  private _handleTimeout() {
    const { snap } = this;

    if (this.isIdle) {
      snap.callbacks.emit('idle', undefined);
    }
  }

  /** Clear timeout reference */
  private _clear() {
    if (this._timeout) {
      clearTimeout(this._timeout);
      this._timeout = undefined;
    }
  }
}
