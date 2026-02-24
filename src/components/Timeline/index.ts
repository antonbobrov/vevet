import { Module, TModuleOnCallbacksProps } from '@/base/Module';
import { isFiniteNumber } from '@/internal/isFiniteNumber';
import { isUndefined } from '@/internal/isUndefined';
import { noopIfDestroyed } from '@/internal/noopIfDestroyed';
import { TRequiredProps } from '@/internal/requiredProps';
import { clamp, easing } from '@/utils/math';

import { MUTABLE_PROPS, STATIC_PROPS } from './props';
import {
  ITimelineCallbacksMap,
  ITimelineMutableProps,
  ITimelineStaticProps,
} from './types';

export * from './types';

type TC = ITimelineCallbacksMap;
type TS = ITimelineStaticProps;
type TM = ITimelineMutableProps;

/**
 * A timeline class for managing animations with easing and precise progress control.
 * It provides methods for playing, reversing, pausing, and resetting the timeline.
 *
 * [Documentation](https://vevetjs.com/docs/Timeline)
 *
 * @group Components
 */
export class Timeline extends Module<TC, TS, TM> {
  /** Get default static properties. */
  public _getStatic(): TRequiredProps<TS> {
    return { ...super._getStatic(), ...STATIC_PROPS };
  }

  /** Get default mutable properties. */
  public _getMutable(): TRequiredProps<TM> {
    return { ...super._getMutable(), ...MUTABLE_PROPS };
  }

  /** Current linear progress of the timeline (0 to 1). */
  private _progress: number;

  /** Current eased progress of the timeline (after applying easing function). */
  private _eased: number;

  /** Stores the ID of the current animation frame request. */
  private _raf?: number;

  /** Stores the timestamp of the last frame update. */
  private _time: number;

  /** Indicates whether the timeline is currently reversed. */
  private _isReversed: boolean;

  /** Indicates whether the timeline is paused. */
  private _isPaused: boolean;

  constructor(
    props?: TS & TM & TModuleOnCallbacksProps<TC, Timeline>,
    onCallbacks?: TModuleOnCallbacksProps<TC, Timeline>,
  ) {
    super(props, onCallbacks as any);

    // Initialize default values
    this._progress = 0;
    this._eased = 0;
    this._raf = undefined;
    this._time = 0;
    this._isReversed = false;
    this._isPaused = false;
  }

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

  /**
   * Get the eased progress of the timeline, derived from the easing function.
   */
  get eased() {
    return this._eased;
  }

  /**
   * Whether the timeline is currently playing.
   */
  get isPlaying() {
    return !isUndefined(this._raf);
  }

  /**
   * Whether the timeline is reversed (progress decreases over time).
   */
  get isReversed() {
    return this._isReversed;
  }

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
    const source = this.props.duration;

    if (!isFiniteNumber(source) || source < 0) {
      return 0;
    }

    return this.props.duration;
  }

  /**
   * Play the timeline, advancing progress toward completion.
   * Does nothing if the timeline is destroyed or already completed.
   */
  @noopIfDestroyed
  public play() {
    if (this.progress === 1) {
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
  @noopIfDestroyed
  public reverse() {
    if (this.progress === 0) {
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
  @noopIfDestroyed
  public pause() {
    this._isPaused = true;

    if (this._raf) {
      window.cancelAnimationFrame(this._raf);
    }

    this._raf = undefined;
  }

  /**
   * Reset the timeline to the beginning (progress = 0).
   */
  @noopIfDestroyed
  public reset() {
    this.pause();
    this.progress = 0;
  }

  /**
   * Animate the timeline, updating progress based on elapsed time.
   */
  private _animate() {
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
  private _onUpdate() {
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
