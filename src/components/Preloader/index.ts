import { selectOne } from 'vevet-dom';
import { PCancelable } from '@/utils/common/PCancelable';
import { NPreloader } from './types';
import { Component as ComponentClass } from '@/base/Component';
import { normalizedTimeoutCallback } from '@/utils/common';
import { getApp } from '@/utils/internal/getApp';

export type { NPreloader };

/**
 * Page preloader component, which manages the visibility of a preloader during page loading.
 * It can hide the preloader after the page is fully loaded and trigger related events.
 *
 * @requires Requires styles: `@import '~vevet/lib/styles/components/Preloader';`
 */
export class Preloader<
  StaticProps extends NPreloader.IStaticProps = NPreloader.IStaticProps,
  ChangeableProps extends
    NPreloader.IChangeableProps = NPreloader.IChangeableProps,
  CallbacksTypes extends
    NPreloader.ICallbacksTypes = NPreloader.ICallbacksTypes,
> extends ComponentClass<StaticProps, ChangeableProps, CallbacksTypes> {
  protected _getDefaultProps() {
    return {
      ...super._getDefaultProps(),
      container: `#${this.prefix}`,
      hideAnimation: 250,
    };
  }

  get prefix() {
    return `${getApp().prefix}preloader`;
  }

  /**
   * The preloader container element.
   */
  protected _container?: HTMLElement | false;

  /**
   * Returns the preloader container element.
   */
  get container() {
    return this._container;
  }

  /**
   * Indicates if the preloader is in the process of being hidden.
   */
  protected _isToBeHidden: boolean;

  /**
   * Indicates if the preloader has already been hidden.
   */
  protected _isHidden: boolean;

  /**
   * Returns whether the preloader is hidden.
   */
  get isHidden() {
    return this._isHidden;
  }

  constructor(initialProps?: StaticProps & ChangeableProps, canInit = true) {
    super(initialProps, false);

    // Get the preloader container
    if (this.props.container) {
      const container = selectOne(this.props.container);

      if (container instanceof HTMLElement) {
        this._container = container;
        this.toggleClassName(container, this.className(''), true);
      }
    }

    // Set default values
    this._isToBeHidden = false;
    this._isHidden = false;

    if (canInit) {
      this.init();
    }
  }

  /**
   * Initializes the preloader and sets event listeners.
   */
  protected _init() {
    super._init();

    this._setEvents();
  }

  /**
   * Sets up the preloader's event handling for when the page is fully loaded.
   */
  protected _setEvents() {
    const loadEvent = this._onLoaded();

    loadEvent
      .then(() => {
        if (this.isDestroyed) {
          return;
        }

        this._handleLoaded();
      })
      .catch(() => {});

    this.addDestroyableAction(() => loadEvent.cancel());
  }

  /**
   * Handles the page load event, triggering when the page is fully loaded.
   */
  protected _onLoaded() {
    return getApp().onPageLoad();
  }

  /**
   * Handles the logic that occurs after the page is fully loaded.
   */
  protected _handleLoaded() {
    this.callbacks.tbt('loaded', undefined);

    if (typeof this.props.hideAnimation !== 'boolean') {
      this.hide();
    }
  }

  /**
   * Hides the preloader with an optional animation duration.
   *
   * @param duration - The duration of the hide animation (in milliseconds).
   */
  public hide(
    duration = typeof this.props.hideAnimation !== 'boolean'
      ? this.props.hideAnimation
      : 250,
  ) {
    this._isToBeHidden = true;
    this.callbacks.tbt('hide', undefined);

    return new PCancelable((resolve: (...args: any) => void) => {
      const container = this._container;

      if (!container) {
        this._handleHidden();
        resolve();

        return;
      }

      // Apply hide animation
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

  /**
   * Handles actions when the preloader is fully hidden.
   */
  protected _handleHidden() {
    this._isHidden = true;
    this.callbacks.tbt('hidden', undefined);
  }

  /**
   * Registers a callback for when the preloader starts hiding.
   *
   * @param action - The callback function to execute.
   * @returns A cancelable action or undefined if already in hiding process.
   */
  public onHide(action: () => void) {
    if (this._isToBeHidden) {
      action();

      return undefined;
    }

    return this.addCallback('hide', (() => action()) as any);
  }

  /**
   * Registers a callback for when the preloader is fully hidden.
   *
   * @param action - The callback function to execute.
   * @returns A cancelable action or undefined if already hidden.
   */
  public onHidden(action: () => void) {
    if (this._isHidden) {
      action();

      return undefined;
    }

    return this.addCallback('hidden', (() => action()) as any);
  }
}
