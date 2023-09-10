import { selectOne } from 'vevet-dom';
import PCancelable from 'p-cancelable';
import { NPreloader } from './types';
import { Component as ComponentClass } from '@/base/Component';
import { normalizedTimeoutCallback } from '@/utils/common';

export type { NPreloader };

/**
 * Page preloader
 */
export class Preloader<
  StaticProps extends NPreloader.IStaticProps = NPreloader.IStaticProps,
  ChangeableProps extends NPreloader.IChangeableProps = NPreloader.IChangeableProps,
  CallbacksTypes extends NPreloader.ICallbacksTypes = NPreloader.ICallbacksTypes
> extends ComponentClass<StaticProps, ChangeableProps, CallbacksTypes> {
  protected _getDefaultProps() {
    return {
      ...super._getDefaultProps(),
      container: `#${this.prefix}`,
      hideAnimation: 250,
    };
  }

  get prefix() {
    return `${this.app.prefix}preloader`;
  }

  /** Preloader container */
  private _container?: HTMLElement | false;

  /** Preloader container */
  get container() {
    return this._container;
  }

  /** Preloader start time */
  private _startTime: number;

  /** Preloader start time */
  get startTime() {
    return this._startTime;
  }

  /** Preloader end time */
  private _endTime: number;

  /** Preloader end time */
  get endTime() {
    return this._endTime;
  }

  /**
   * Total time of page loading before the preloader is to be hidden
   */
  get totalTime() {
    return this.endTime - this.startTime;
  }

  /** Preloader is to be hidden */
  private _isToBeHidden: boolean;

  /** Preloader is hidden */
  private _isHidden: boolean;

  /** Preloader is hidden */
  get isHidden() {
    return this._isHidden;
  }

  constructor(initialProps?: StaticProps & ChangeableProps, canInit = true) {
    super(initialProps, false);

    // get preloader container
    if (this.props.container) {
      const container = selectOne(this.props.container);

      if (container instanceof HTMLElement) {
        this._container = container;
        this.toggleClassName(container, this.className(''), true);
      }
    }

    // set default vars
    this._startTime = +new Date();
    this._endTime = Infinity;
    this._isToBeHidden = false;
    this._isHidden = false;

    if (canInit) {
      this.init();
    }
  }

  /** Init the class */
  protected _init() {
    super._init();

    this._setEvents();
  }

  /** Set module event */
  protected _setEvents() {
    const loadEvent = this._onLoaded();

    loadEvent
      .then(() => {
        if (this.isDestroyed) {
          return;
        }

        this._endTime = +new Date();
        this._handleLoaded();
      })
      .catch(() => {});

    this.addDestroyableAction(() => loadEvent.cancel());
  }

  /** Catch the moment when the page is fully loaded */
  protected _onLoaded() {
    return this.app.onPageLoad();
  }

  /** When the page is fully loaded */
  private _handleLoaded() {
    this.callbacks.tbt('loaded', undefined);

    // hide the preloader
    if (typeof this.props.hideAnimation !== 'boolean') {
      this.hide();
    }
  }

  /** Hide the preloader */
  public hide(
    duration = typeof this.props.hideAnimation !== 'boolean'
      ? this.props.hideAnimation
      : 250
  ) {
    this._isToBeHidden = true;
    this.callbacks.tbt('hide', undefined);

    return new PCancelable((resolve: (...arg: any) => void) => {
      const container = this._container;

      // if container is not to be hidden
      if (!container) {
        this._handleHidden();
        resolve();

        return;
      }

      // if need to hide the container
      container.style.transition = `opacity ${duration}ms, visibility ${duration}ms`;
      container.style.opacity = '0';
      container.style.visibility = 'hidden';

      const timeout = normalizedTimeoutCallback(() => {
        container.style.display = 'none';

        this._handleHidden();
        resolve();
      }, duration);

      this.addDestroyableAction(() => timeout.clear());
    });
  }

  /** Handle the moment when the preloader is hidden */
  private _handleHidden() {
    this._isHidden = true;
    this.callbacks.tbt('hidden', undefined);
  }

  /** Callback for the moment when the preloader starts hiding */
  public onHide(action: () => void) {
    if (this._isToBeHidden) {
      action();

      return undefined;
    }

    return this.addCallback('hide', (() => action()) as any);
  }

  /** Callback for the moment when the preloader is hidden */
  public onHidden(action: () => void) {
    if (this._isHidden) {
      action();

      return undefined;
    }

    return this.addCallback('hidden', (() => action()) as any);
  }
}
