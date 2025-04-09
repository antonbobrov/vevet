import { TRequiredProps } from '@/internal/requiredProps';
import { Module } from '@/base/Module';
import { clamp, easing } from '@/utils/math';
import {
  ITimelineCallbacksMap,
  ITimelineMutableProps,
  ITimelineStaticProps,
} from './types';
import { initVevet } from '@/global/initVevet';

export * from './types';

/**
 * A timeline class for managing animations with easing and precise progress control.
 * It provides methods for playing, reversing, pausing, and resetting the timeline.
 *
 * [Documentation](https://antonbobrov.github.io/vevet/docs/components/Timeline)
 *
 * @group Components
 */
export class Timeline<
  CallbacksMap extends ITimelineCallbacksMap = ITimelineCallbacksMap,
  StaticProps extends ITimelineStaticProps = ITimelineStaticProps,
  MutableProps extends ITimelineMutableProps = ITimelineMutableProps,
> extends Module<CallbacksMap, StaticProps, MutableProps> {
  /** Get default static properties. */
  public _getStatic(): TRequiredProps<StaticProps> {
    return { ...super._getStatic() } as TRequiredProps<StaticProps>;
  }

  /** Get default mutable properties. */
  public _getMutable(): TRequiredProps<MutableProps> {
    return {
      ...super._getMutable(),
      easing: initVevet().props.easing,
      duration: 1000,
    } as TRequiredProps<MutableProps>;
  }

  /** Current linear progress of the timeline (0 to 1). */
  protected _progress: number;

  /**
   * Get or set the linear progress of the timeline.
   * Setting this triggers an update and associated callbacks.
   */
  get progress() {
    return this._progress;
  }

  set progress(val: number) {
    this._progress = clamp(val);

    this._onUpdate();
  }

  /** Current eased progress of the timeline (after applying easing function). */
  protected _eased: number;

  /**
   * Get the eased progress of the timeline, derived from the easing function.
   */
  get eased() {
    return this._eased;
  }

  /** Stores the ID of the current animation frame request. */
  protected _raf?: number;

  /** Stores the timestamp of the last frame update. */
  protected _time: number;

  /**
   * Whether the timeline is currently playing.
   */
  get isPlaying() {
    return typeof this._raf !== 'undefined';
  }

  /** Indicates whether the timeline is currently reversed. */
  protected _isReversed: boolean;

  /**
   * Whether the timeline is reversed (progress decreases over time).
   */
  get isReversed() {
    return this._isReversed;
  }

  /** Indicates whether the timeline is paused. */
  protected _isPaused: boolean;

  /**
   * Whether the timeline is paused.
   */
  get isPaused() {
    return this._isPaused;
  }

  /**
   * Get the timeline duration, ensuring it is at least 0 ms.
   */
  get duration() {
    return Math.max(this.props.duration, 0);
  }

  constructor(props?: StaticProps & MutableProps) {
    super(props);

    // Initialize default values
    this._progress = 0;
    this._eased = 0;
    this._raf = undefined;
    this._time = 0;
    this._isReversed = false;
    this._isPaused = false;
  }

  /**
   * Play the timeline, advancing progress toward completion.
   * Does nothing if the timeline is destroyed or already completed.
   */
  public play() {
    if (this.isDestroyed || this.progress === 1) {
      return;
    }

    this._isReversed = false;
    this._isPaused = false;

    if (!this.isPlaying) {
      this._time = Date.now();
      this._animate();
    }
  }

  /**
   * Reverse the timeline, moving progress toward the start.
   * Does nothing if the timeline is destroyed or already at the start.
   */
  public reverse() {
    if (this.isDestroyed || this.progress === 0) {
      return;
    }

    this._isReversed = true;
    this._isPaused = false;

    if (!this.isPlaying) {
      this._time = Date.now();
      this._animate();
    }
  }

  /**
   * Pause the timeline, halting progress without resetting it.
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
   * Reset the timeline to the beginning (progress = 0).
   */
  public reset() {
    if (this.isDestroyed) {
      return;
    }

    this.pause();
    this.progress = 0;
  }

  /**
   * Animate the timeline, updating progress based on elapsed time.
   */
  protected _animate() {
    if (this.isPaused) {
      return;
    }

    const { isReversed, duration } = this;

    if (duration <= 0) {
      this.progress = isReversed ? 1 : 0;
      this.progress = isReversed ? 0 : 1;

      return;
    }

    const currentTime = Date.now();
    const frameDiff = Math.abs(this._time - currentTime);
    this._time = currentTime;

    const progressIterator = frameDiff / duration / (isReversed ? -1 : 1);
    const progressTarget = this.progress + progressIterator;

    this.progress = progressTarget;

    if (
      (this.progress === 1 && !isReversed) ||
      (this.progress === 0 && isReversed)
    ) {
      this._isReversed = false;
      this._isPaused = false;
      this._raf = undefined;

      return;
    }

    this._raf = window.requestAnimationFrame(() => this._animate());
  }

  /**
   * Handle progress updates and trigger callbacks.
   */
  protected _onUpdate() {
    this._eased = easing(this._progress, this.props.easing);

    this.callbacks.emit('update', {
      progress: this._progress,
      eased: this._eased,
    });

    if (this.progress === 0) {
      this.callbacks.emit('start', undefined);

      return;
    }

    if (this.progress === 1) {
      this.callbacks.emit('end', undefined);
    }
  }

  /**
   * Destroy the timeline, stopping any active animation and cleaning up resources.
   */
  protected _destroy() {
    this.pause();

    super._destroy();
  }
}
