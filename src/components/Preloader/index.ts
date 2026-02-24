import { Module, TModuleOnCallbacksProps } from '@/base/Module';
import { initVevet } from '@/global/initVevet';
import { isNumber } from '@/internal/isNumber';
import { TRequiredProps } from '@/internal/requiredProps';

import { Timeline } from '../Timeline';

import { MUTABLE_PROPS, STATIC_PROPS } from './props';
import {
  IPreloaderCallbacksMap,
  IPreloaderMutableProps,
  IPreloaderStaticProps,
} from './types';

export * from './types';

/**
 * Page preloader component that manages the visibility and lifecycle of a loading screen.
 * The module does not provide styling for the container.
 *
 * [Documentation](https://vevetjs.com/docs/Preloader)
 *
 * @group Components
 */
export class Preloader<
  C extends IPreloaderCallbacksMap = IPreloaderCallbacksMap,
  S extends IPreloaderStaticProps = IPreloaderStaticProps,
  M extends IPreloaderMutableProps = IPreloaderMutableProps,
> extends Module<C, S, M> {
  /**
   * Retrieves the default static properties.
   */
  public _getStatic(): TRequiredProps<S> {
    return { ...super._getStatic(), ...STATIC_PROPS };
  }

  /**
   * Retrieves the default mutable properties.
   */
  public _getMutable(): TRequiredProps<M> {
    return { ...super._getMutable(), ...MUTABLE_PROPS };
  }

  /** Indicates if the preloader is in the process of being hidden. */
  private _shouldHide = false;

  /** Indicates if the preloader has already been hidden. */
  private _isHidden = false;

  /** Indicates if the page is fully loaded. */
  private _isLoaded = false;

  constructor(
    props?: S & M & TModuleOnCallbacksProps<C, Preloader<C, S, M>>,
    onCallbacks?: TModuleOnCallbacksProps<C, Preloader<C, S, M>>,
  ) {
    super(props, onCallbacks as any);

    // Handle page load event
    const timeout = setTimeout(() => {
      this._onLoaded(() => this._handleLoaded());
    }, 0);

    this.onDestroy(() => clearTimeout(timeout));
  }

  /**
   * Returns whether the preloader is currently hidden.
   */
  get isHidden() {
    return this._isHidden;
  }

  /**
   * Handles the page load event, triggering when the page is fully loaded.
   */
  protected _onLoaded(callback: () => void) {
    initVevet().onLoad(callback);
  }

  /**
   * Handles the logic that occurs after the page is fully loaded.
   */
  private _handleLoaded() {
    if (this.isDestroyed) {
      return;
    }

    this._isLoaded = true;
    this.callbacks.emit('loaded', undefined);

    if (isNumber(this.props.hide)) {
      this.hide(this.props.hide);
    }
  }

  /**
   * Hides the preloader with a custom animation duration.
   *
   * @param duration - The duration of the hide animation (in milliseconds). Applies only when the container is used.
   * @param callback - The callback to execute when the hide animation is complete.
   *
   * @returns Returns an action destructor.
   */
  public hide(duration: number, callback?: () => void) {
    if (this.isDestroyed) {
      return undefined;
    }

    if (!this._isLoaded || this._shouldHide) {
      return undefined;
    }

    let isDestroyed = false;

    this._shouldHide = true;
    this.callbacks.emit('hide', undefined);

    this._hideContainer(() => {
      this._onHidden();

      if (!isDestroyed) {
        callback?.();
      }
    }, duration);

    return () => {
      isDestroyed = true;
    };
  }

  /**
   * Executes the hiding animation for the preloader container.
   */
  private _hideContainer(onHidden: () => void, duration: number) {
    const { container } = this.props;

    if (!container) {
      onHidden();

      return;
    }

    const tm = new Timeline({ duration });
    this.onDestroy(() => tm.destroy());

    tm.on('update', ({ progress }) => {
      const { style } = container;
      style.opacity = String(1 - progress);
      style.display = progress === 1 ? 'none' : 'flex';
    });

    tm.on('end', () => onHidden());

    tm.play();
  }

  /**
   * Handles actions when the preloader is fully hidden.
   */
  private _onHidden() {
    this._isHidden = true;
    this.callbacks.emit('hidden', undefined);
  }

  /**
   * Registers a callback for when the preloader starts hiding.
   *
   * @param action - The callback function to execute.
   * @returns A destructor.
   */
  public onHide(action: () => void) {
    if (this.isDestroyed) {
      return () => {};
    }

    if (this._shouldHide) {
      action();

      return () => {};
    }

    return this.on('hide', (() => action()) as any);
  }

  /**
   * Registers a callback for when the preloader is fully hidden.
   *
   * @param action - The callback function to execute.
   * @returns A destructor.
   */
  public onHidden(action: () => void) {
    if (this.isDestroyed) {
      return () => {};
    }

    if (this._isHidden) {
      action();

      return () => {};
    }

    return this.on('hidden', (() => action()) as any);
  }
}
