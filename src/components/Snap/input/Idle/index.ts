import { ModulePart } from '@/shared/ModulePart';

import { Snap } from '../..';
import { IDLE_DEBOUNCE, WHEEL_DEBOUNCE } from '../../constants';

/**
 * Debounced `idle` callback when the scene is not animating or interacting.
 *
 * @internal
 */
export class SnapIdle extends ModulePart<Snap> {
  private _timeout?: NodeJS.Timeout;

  constructor(parent: Snap) {
    super(parent);

    this.callbacks.on('update', () => this._handleUpdate(), {
      protected: true,
    });

    this.onDestroy(() => this._clear());
  }

  get isIdle() {
    const { parent } = this;

    return (
      !parent.isSwiping &&
      !parent.hasInertia &&
      !parent.isInterpolating &&
      !parent.isTransitioning &&
      !parent.isWheeling
    );
  }

  private _handleUpdate() {
    this._clear();

    const debounce = Math.max(IDLE_DEBOUNCE, WHEEL_DEBOUNCE) + 10;

    this._timeout = setTimeout(() => this._handleTimeout(), debounce);
  }

  private _handleTimeout() {
    if (this.isIdle) {
      this.callbacks.emit('idle', undefined);
    }
  }

  private _clear() {
    if (this._timeout) {
      clearTimeout(this._timeout);
      this._timeout = undefined;
    }
  }
}
