import { addEventListener } from '@/utils';
import { SnapLogic } from '../SnapLogic';
import { Snap } from '../..';

export class SnapKeyboard extends SnapLogic {
  constructor(snap: Snap) {
    super(snap);

    this.addDestructor(
      addEventListener(snap.container, 'scroll', () => this._handleScroll()),
    );
  }

  /** Handle scroll lock */
  protected _handleScroll() {
    this.snap.container.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }
}
