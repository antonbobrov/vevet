import { ModulePart } from '@/shared/ModulePart';

import { Pointers } from '..';

/**
 * Coalesces multiple `pointermove` updates into one microtask per tick.
 *
 * @internal
 */
export class PointersScheduler extends ModulePart<Pointers> {
  private _scheduled = false;

  /**
   * Runs `fn` once in the next microtask.
   *
   * Subsequent calls before the microtask runs are ignored.
   */
  public schedule(fn: () => void) {
    if (this._scheduled) {
      return;
    }

    this._scheduled = true;

    queueMicrotask(() => {
      this._scheduled = false;
      fn();
    });
  }

  /** Cancels a pending microtask flag (does not abort an already queued task). */
  public clear() {
    this._scheduled = false;
  }
}
