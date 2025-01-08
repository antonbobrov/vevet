import { TRequiredProps } from '@/internal/requiredProps';
import {
  IPreloaderCallbacksMap,
  IPreloaderMutableProps,
  IPreloaderStaticProps,
} from './types';
import { Module } from '@/base/Module';
import { Timeline } from '../Timeline';
import { initVevet } from '@/global/initVevet';
import { EaseInOutSine } from '@/utils/math/easing';

export * from './types';

/**
 * Page preloader component that manages the visibility and lifecycle of a loading screen.
 * The module does not provide styling for the container.
 *
 * [Documentation](https://antonbobrov.github.io/vevet/docs/components/Preloader)
 *
 * @group Components
 */
export class Preloader<
  CallbacksMap extends IPreloaderCallbacksMap = IPreloaderCallbacksMap,
  StaticProps extends IPreloaderStaticProps = IPreloaderStaticProps,
  MutableProps extends IPreloaderMutableProps = IPreloaderMutableProps,
> extends Module<CallbacksMap, StaticProps, MutableProps> {
  /**
   * Retrieves the default static properties.
   */
  public _getStatic(): TRequiredProps<StaticProps> {
    return {
      ...super._getStatic(),
      hide: 250,
    } as TRequiredProps<StaticProps>;
  }

  /**
   * Retrieves the default mutable properties.
   */
  public _getMutable(): TRequiredProps<MutableProps> {
    return { ...super._getMutable() } as TRequiredProps<MutableProps>;
  }

  /** Indicates if the preloader is in the process of being hidden. */
  protected _shouldHide = false;

  /** Indicates if the preloader has already been hidden. */
  protected _isHidden = false;

  /** Indicates if the page is fully loaded. */
  protected _isLoaded = false;

  /**
   * Returns whether the preloader is currently hidden.
   */
  get isHidden() {
    return this._isHidden;
  }

  constructor(props?: StaticProps & MutableProps) {
    super(props);

    // Handle page load event
    const timeout = setTimeout(() => {
      this._onLoaded(() => this._handleLoaded());
    }, 0);

    this.onDestroy(() => clearTimeout(timeout));
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
  protected _handleLoaded() {
    if (this.isDestroyed) {
      return;
    }

    this._isLoaded = true;
    this.callbacks.emit('loaded', undefined);

    if (typeof this.props.hide === 'number') {
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
  protected _hideContainer(onHidden: () => void, duration: number) {
    const { container } = this.props;

    if (!container) {
      onHidden();

      return;
    }

    const tm = new Timeline({ duration, easing: EaseInOutSine });
    this.onDestroy(() => tm.destroy());

    tm.on('update', ({ progress }) => {
      container.style.opacity = String(1 - progress);
      container.style.display = progress === 1 ? 'none' : 'flex';
    });

    tm.on('end', () => onHidden());

    tm.play();
  }

  /**
   * Handles actions when the preloader is fully hidden.
   */
  protected _onHidden() {
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
    if (this._isHidden) {
      action();

      return () => {};
    }

    return this.on('hidden', (() => action()) as any);
  }
}
