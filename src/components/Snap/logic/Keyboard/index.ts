import { addEventListener } from '@/utils';

import { SnapLogic } from '..';
import { Snap } from '../..';

export class SnapKeyboard extends SnapLogic {
  constructor(ctx: Snap) {
    super(ctx);

    this.addDestructor(
      addEventListener(ctx.container, 'scroll', () => this._handleScroll()),
    );
  }

  /** Handle scroll lock */
  private _handleScroll() {
    this.container.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }
}
