import { IAddEventListener, addEventListener } from 'vevet-dom';
import { Callbacks } from '@/base/Callbacks';
import { NPageLoad } from './types';

export type { NPageLoad };

/**
 * Callbacks on page loaded
 */
export class PageLoad extends Callbacks<NPageLoad.ICallbacksTypes> {
  /** The page is loaded */
  private _isLoaded: boolean;

  /** The page is loaded */
  get isLoaded() {
    return this._isLoaded;
  }

  private _loadListener?: IAddEventListener;

  constructor() {
    super(false);

    this._isLoaded = false;

    this._init();
  }

  protected _init() {
    super._init();

    this._setEvents();
  }

  protected _setEvents() {
    if (document.readyState === 'complete') {
      this._handleLoaded();

      return;
    }

    this._loadListener = addEventListener(window, 'load', () =>
      this._handleLoaded()
    );
  }

  /** Callback on page loaded */
  protected _handleLoaded() {
    const { app } = this;
    const { prefix } = app;

    this._isLoaded = true;

    app.html.classList.remove(`${prefix}loading`);
    app.body.classList.remove(`${prefix}loading`);

    app.html.classList.add(`${prefix}loaded`);

    this.tbt('loaded', undefined);
  }

  /**
   * Add a callback on page load.
   * If the page is already loaded, the callback will be immediately triggered.
   */
  public onLoad(callback: () => void) {
    if (this.isLoaded) {
      callback();

      return undefined;
    }

    return this.add('loaded', callback.bind(this));
  }

  public destroy() {
    super.destroy();

    this._loadListener?.remove();
  }
}
