import { Module } from '@/base/Module';
import { TModuleProps } from '@/base/Module/types';
import { initVevet } from '@/global/initVevet';
import { isNumber, noopIfDestroyed, TRequiredProps } from '@/internal';

import { Timeline } from '../Timeline';

import { MUTABLE_PROPS, STATIC_PROPS } from './props';
import {
  IPreloaderCallbacksMap,
  IPreloaderMutableProps,
  IPreloaderStaticProps,
} from './types';

/**
 * Page preloader — loading screen visibility and lifecycle.
 *
 * - Waits for page load via {@link _onLoaded} (overridable by {@link ProgressPreloader})
 * - Optional auto-hide when `hide` is a duration in milliseconds
 * - Fades `container` opacity via {@link Timeline}
 *
 * Does not provide styling for the container.
 *
 * Lifecycle
 *
 * `loaded` → `hide` (auto or manual) → container fade → `hidden`
 *
 * When `hide` is `false`, call {@link hide} manually after load.
 * When `container` is `null`, only events fire — no DOM animation.
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
  public _getStatic(): TRequiredProps<S> {
    return { ...super._getStatic(), ...STATIC_PROPS };
  }

  public _getMutable(): TRequiredProps<M> {
    return { ...super._getMutable(), ...MUTABLE_PROPS };
  }

  private _isHiding = false;

  private _isHidden = false;

  private _isLoaded = false;

  constructor(props?: TModuleProps<C, S, M, Preloader<C, S, M>>) {
    super(props);

    const timeout = setTimeout(() => {
      this._onLoaded(() => this._handleLoaded());
    }, 0);

    this.onDestroy(() => clearTimeout(timeout));
  }

  /** Whether the hide animation has completed and `hidden` has fired. */
  get isHidden() {
    return this._isHidden;
  }

  /** Whether {@link hide} has started but `hidden` has not fired yet. */
  get isHiding() {
    return this._isHiding;
  }

  /** Whether the load signal has fired and `loaded` was emitted. */
  get isLoaded() {
    return this._isLoaded;
  }

  /**
   * Subscribes to the load signal.
   *
   * Default: `initVevet().onLoad`. {@link ProgressPreloader} overrides this
   * to wait for resource progress.
   */
  protected _onLoaded(callback: () => void) {
    initVevet().onLoad(callback);
  }

  /** Marks the page as loaded, emits `loaded`, and auto-hides when configured. */
  @noopIfDestroyed
  private _handleLoaded() {
    this._isLoaded = true;
    this._emit('loaded', undefined);

    this._emit('requestHide', undefined);

    if (isNumber(this.props.hide)) {
      this.hide(this.props.hide);
    }
  }

  /**
   * Hides the preloader with a fade on `container`.
   *
   * Works only after load and when not already hiding. The returned destructor
   * cancels the optional `callback` only — the fade still runs.
   */
  public hide(duration: number, callback?: () => void) {
    if (this.isDestroyed) {
      return undefined;
    }

    if (!this._isLoaded || this._isHiding) {
      return undefined;
    }

    let isDestroyed = false;

    this._isHiding = true;
    this._emit('hide', undefined);

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

  /** Fades `container` opacity via {@link Timeline}, or completes immediately when `container` is null. */
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

  /** Sets `isHidden` and emits `hidden`. */
  private _onHidden() {
    this._isHidden = true;
    this._emit('hidden', undefined);
  }

  /**
   * Registers a one-shot listener for `hide`, or runs immediately if already hiding.
   *
   * @returns A destructor that removes the listener.
   */
  public onHide(action: () => void) {
    if (this.isDestroyed) {
      return () => {};
    }

    if (this._isHiding) {
      action();

      return () => {};
    }

    return this.on('hide', (() => action()) as any);
  }

  /**
   * Registers a one-shot listener for `hidden`, or runs immediately if already hidden.
   *
   * @returns A destructor that removes the listener.
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
