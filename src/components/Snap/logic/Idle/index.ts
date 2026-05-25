import { SnapLogic } from '..';
import { Snap } from '../..';

export class SnapIdle extends SnapLogic {
  /** Debounce timeout reference */
  private _timeout?: NodeJS.Timeout;

  constructor(ctx: Snap) {
    super(ctx);

    this.callbacks.on('update', () => this._handleUpdate(), {
      protected: true,
    });

    this.addDestructor(() => this._clear());
  }

  /** Check if idle */
  get isIdle() {
    return (
      !this.isSwiping &&
      !this.hasInertia &&
      !this.isInterpolating &&
      !this.isTransitioning
    );
  }

  /** Handle Snap update */
  private _handleUpdate() {
    this._clear();

    this._timeout = setTimeout(() => this._handleTimeout(), 10);
  }

  /** Handle timeout action */
  private _handleTimeout() {
    if (this.isIdle) {
      this.callbacks.emit('idle', undefined);
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
