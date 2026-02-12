import { addEventListener } from '@/utils';

import { Snap } from '../..';
import { SnapLogic } from '../SnapLogic';

export class SnapKeyboard extends SnapLogic {
  constructor(snap: Snap) {
    super(snap);

    this.addDestructor(
      addEventListener(snap.container, 'scroll', () => this._handleScroll()),
    );
  }

  /** Handle scroll lock */
  private _handleScroll() {
    this.snap.container.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }
}
