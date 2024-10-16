import { clamp, easing } from '@/utils/math';
import { NTimeline } from './types';
import { getApp } from '@/utils/internal/getApp';
import { Component as ComponentClass } from '@/base/Component';

export type { NTimeline };

/**
 * Animation timeline that handles time-based animations with progress, easing, play, reverse, and pause functionality.
 *
 * @link See examples https://antonbobrov.github.io/vevet-demo/timeline/
 *
 * @link See docs https://antonbobrov.github.io/vevet/classes/Timeline.html
 */
export class Timeline<
  StaticProps extends NTimeline.IStaticProps = NTimeline.IStaticProps,
  ChangeableProps extends
    NTimeline.IChangeableProps = NTimeline.IChangeableProps,
  CallbacksTypes extends NTimeline.ICallbacksTypes = NTimeline.ICallbacksTypes,
> extends ComponentClass<StaticProps, ChangeableProps, CallbacksTypes> {
  protected _getDefaultProps() {
    return {
      ...super._getDefaultProps(),
      easing: getApp().props.easing,
      isDestroyedOnEnd: false,
      duration: 1000,
    };
  }

  /**
   * Global timeline progress, from 0 (start) to 1 (end).
   */
  protected _p: number;

  /**
   * Global timeline progress. Can be manually set, triggering updates.
   */
  get p() {
    return this._p;
  }

  set p(val: number) {
    this._p = val;

    this._handleProgressUpdate();
  }

  /**
   * Eased progress of the timeline, calculated based on the easing function.
   */
  protected _e: number;

  /**
   * Eased progress, which applies the easing function to the global progress.
   */
  get e() {
    return this._e;
  }

  /**
   * Stores the requestAnimationFrame ID for the ongoing animation.
   */
  protected _raf?: number;

  /**
   * Stores the time of the last animation frame.
   */
  protected _rafTime: number;

  /**
   * Indicates if the timeline is currently playing.
   */
  get isPlaying() {
    return typeof this._raf !== 'undefined';
  }

  /**
   * Indicates if the timeline is playing in reverse.
   */
  protected _isReversed: boolean;

  /**
   * Returns whether the timeline is reversed.
   */
  get isReversed() {
    return this._isReversed;
  }

  /**
   * Indicates if the timeline is paused.
   */
  protected _isPaused: boolean;

  /**
   * Returns whether the timeline is paused.
   */
  get isPaused() {
    return this._isPaused;
  }

  /**
   * Returns the duration of the timeline, ensuring a minimum duration of 1 ms.
   */
  get duration() {
    return Math.max(this.props.duration, 1);
  }

  constructor(initialProps?: StaticProps & ChangeableProps, canInit = true) {
    super(initialProps, false);

    // Set default variables
    this._p = 0;
    this._e = 0;
    this._raf = undefined;
    this._rafTime = 0;
    this._isReversed = false;
    this._isPaused = false;

    if (canInit) {
      this.init();
    }
  }

  /**
   * Plays the timeline, advancing progress from its current state toward completion.
   * Will not play if the timeline has already been destroyed or has fully completed.
   */
  public play() {
    if (this.isDestroyed || this.p === 1) {
      return;
    }

    this._isReversed = false;
    this._isPaused = false;

    if (!this.isPlaying) {
      this._rafTime = Date.now();
      this._animate();
    }
  }

  /**
   * Reverses the timeline, moving progress from its current state toward the start.
   * Will not reverse if the timeline has already been destroyed or is at the start.
   */
  public reverse() {
    if (this.isDestroyed || this.p === 0) {
      return;
    }

    this._isReversed = true;
    this._isPaused = false;

    if (!this.isPlaying) {
      this._rafTime = Date.now();
      this._animate();
    }
  }

  /**
   * Pauses the timeline's progress, stopping the animation at its current state.
   */
  public pause() {
    if (this.isDestroyed) {
      return;
    }

    this._isPaused = true;

    if (this._raf) {
      window.cancelAnimationFrame(this._raf);
    }
    this._raf = undefined;
  }

  /**
   * Resets the timeline to the beginning (progress = 0).
   */
  public reset() {
    if (this.isDestroyed) {
      return;
    }

    this.pause();
    this.p = 0;
  }

  /**
   * Starts the animation process, updating the timeline's progress based on elapsed time.
   */
  protected _animate() {
    if (this.isPaused) {
      return;
    }

    const { isReversed } = this;

    // Calculate time difference between frames
    const currentTime = Date.now();
    const frameDiff = Math.abs(this._rafTime - currentTime);
    this._rafTime = currentTime;

    // Calculate current progress
    const progressIterator = frameDiff / this.duration / (isReversed ? -1 : 1);
    const progressTarget = clamp(this.p + progressIterator, [0, 1]);
    this.p = progressTarget;

    // End animation if progress reaches start or end
    if (
      (progressTarget === 1 && !isReversed) ||
      (progressTarget === 0 && isReversed)
    ) {
      this._isReversed = false;
      this._isPaused = false;
      this._raf = undefined;

      return;
    }

    // Continue animation
    this._raf = window.requestAnimationFrame(this._animate.bind(this));
  }

  /**
   * Handles updates to the timeline's progress and triggers associated callbacks.
   */
  protected _handleProgressUpdate() {
    this._e = easing(this._p, this.props.easing);

    this.callbacks.tbt('progress', {
      p: this._p,
      e: this._e,
    });

    if (this.p === 0) {
      this.callbacks.tbt('start', undefined);

      return;
    }

    if (this.p === 1) {
      this.callbacks.tbt('end', undefined);

      if (this.props.isDestroyedOnEnd) {
        this.destroy();
      }
    }
  }

  /**
   * Destroys the timeline, pausing any ongoing animation and cleaning up resources.
   */
  protected _destroy() {
    this.pause();

    super._destroy();
  }
}
