import { addEventListener } from '@/utils';
import { Snap } from '..';

export class SnapKeyboard {
  /** Listeners to destruct */
  protected _destructors: (() => void)[] = [];

  constructor(protected _snap: Snap) {
    _snap.on('destroy', () => this._destroy(), { protected: true });

    this._destructors.push(
      addEventListener(_snap.container, 'scroll', () => this._handleScroll()),
    );
  }

  /** Snap component */
  protected get snap() {
    return this._snap;
  }

  /** Handle scroll lock */
  protected _handleScroll() {
    this.snap.container.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }

  /** Destroy wheel listeners */
  protected _destroy() {
    this._destructors.forEach((destructor) => destructor());
  }
}
