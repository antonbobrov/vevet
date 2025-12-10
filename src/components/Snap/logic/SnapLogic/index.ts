import { Snap } from '../..';

export class SnapLogic {
  /** Listeners to destruct */
  private _destructors: (() => void)[] = [];

  constructor(private _snap: Snap) {
    _snap.on('destroy', () => this._destroy(), { protected: true });
  }

  /** Snap component */
  protected get snap() {
    return this._snap;
  }

  /** Snap component */
  protected addDestructor(callback: () => void) {
    this._destructors.push(callback);
  }

  /** Destroy wheel listeners */
  private _destroy() {
    this._destructors.forEach((destructor) => destructor());
  }
}
