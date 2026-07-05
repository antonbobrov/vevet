import { ModulePart } from '@/shared/ModulePart';
import { addEventListener } from '@/utils';

import { Snap } from '../..';

/**
 * Locks native scroll on the container during carousel use.
 *
 * @internal
 */
export class SnapKeyboard extends ModulePart<Snap> {
  constructor(parent: Snap) {
    super(parent);

    this.onDestroy(
      addEventListener(parent.container, 'scroll', () => this._handle()),
    );
  }

  /** Handle scroll lock */
  private _handle() {
    this.parent.container.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }
}
