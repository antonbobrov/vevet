import { cnAdd, cnHas, cnRemove } from '@/internal/cn';
import { ModulePart } from '@/shared/ModulePart';

import { Scrollbar } from '..';

/**
 * Auto-hide visibility for {@link Scrollbar}.
 *
 * Adds `_in-action` after scroll activity (`show`) and removes it after a delay
 * (`hide`). Pending timeouts are cleared on destroy.
 *
 * @internal
 */
export class ScrollbarAction extends ModulePart<Scrollbar> {
  private _addInActionTimeout?: NodeJS.Timeout;

  private _removeInActionTimeout?: NodeJS.Timeout;

  private _className = this._cn('_in-action');

  constructor(parent: Scrollbar) {
    super(parent);

    this.onDestroy(() => {
      this.cancelIn();
      this._cancelOut();
    });
  }

  private get outer() {
    return this.parent.outer;
  }

  /** Cancels a pending `show` timeout (for example before `resize`). */
  public cancelIn() {
    if (this._addInActionTimeout) {
      clearTimeout(this._addInActionTimeout);
      this._addInActionTimeout = undefined;
    }
  }

  private _cancelOut() {
    if (this._removeInActionTimeout) {
      clearTimeout(this._removeInActionTimeout);
      this._removeInActionTimeout = undefined;
    }
  }

  /** Schedules `_in-action` and `show` after scroll movement. */
  public in() {
    this._addInActionTimeout = setTimeout(() => {
      if (!cnHas(this.outer, this._className)) {
        cnAdd(this.outer, this._className);

        this.callbacks.emit('show', undefined);
      }
    }, 50);
  }

  /** Schedules removal of `_in-action` and emits `hide`. */
  public out() {
    this._cancelOut();

    this._removeInActionTimeout = setTimeout(() => {
      cnRemove(this.outer, this._className);

      this.callbacks.emit('hide', undefined);
    }, 500);
  }
}
