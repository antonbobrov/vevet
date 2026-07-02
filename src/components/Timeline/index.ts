import { Module, TModuleProps } from '@/base/Module';
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
 * Timeline for time-based progress with easing.
 *
 * Operates in the `0 → 1` range; {@link play}, {@link reverse}, {@link pause},
 * and {@link reset} control playback. Does not touch the DOM — use callbacks
 * or the {@link progress} / {@link eased} accessors to drive animation.
 *
 * [Documentation](https://vevetjs.com/docs/Timeline)
 *
 * @group Components
 */
export class Timeline extends Module<TC, TS, TM> {
  public _getStatic(): TRequiredProps<TS> {
    return { ...super._getStatic(), ...STATIC_PROPS };
  }

  public _getMutable(): TRequiredProps<TM> {
    return { ...super._getMutable(), ...MUTABLE_PROPS };
  }

  private _progress: number;

  private _eased: number;

  private _raf?: number;

  private _time: number;

  private _isReversed: boolean;

  private _isPaused: boolean;

  constructor(props?: TModuleProps<TC, TS, TM, Timeline>) {
    super(props);

    this._progress = 0;
    this._eased = 0;
    this._raf = undefined;
    this._time = 0;
    this._isReversed = false;
    this._isPaused = false;
  }

  /**
   * Linear progress (`0 → 1`).
   *
   * Assigning a value clamps, recalculates {@link eased}, and fires callbacks.
   */
  get progress() {
    return this._progress;
  }

  set progress(val: number) {
    this._progress = clamp(val);

    this._onUpdate();
  }

  /** Eased progress derived from {@link progress} and the `easing` prop. */
  get eased() {
    return this._eased;
  }

  /** Whether a `requestAnimationFrame` loop is active. */
  get isPlaying() {
    return !isUndefined(this._raf);
  }

  /** Whether playback direction is reversed. */
  get isReversed() {
    return this._isReversed;
  }

  /** Whether playback is paused. */
  get isPaused() {
    return this._isPaused;
  }

  /**
   * Duration in milliseconds.
   *
   * Non-finite or negative values are treated as `0` (instant completion).
   */
  get duration() {
    const source = this.props.duration;

    if (!isFiniteNumber(source) || source < 0) {
      return 0;
    }

    return this.props.duration;
  }

  /**
   * Plays forward toward `progress = 1`.
   *
   * No-op when destroyed or when progress is already `1`.
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
   * Plays backward toward `progress = 0`.
   *
   * No-op when destroyed or when progress is already `0`.
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

  /** Pauses playback without resetting progress. */
  @noopIfDestroyed
  public pause() {
    this._isPaused = true;

    if (this._raf) {
      window.cancelAnimationFrame(this._raf);
    }

    this._raf = undefined;
  }

  /** Pauses and sets {@link progress} to `0`. */
  @noopIfDestroyed
  public reset() {
    this.pause();
    this.progress = 0;
  }

  /** Advances progress from elapsed time and schedules the next frame. */
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

  /** Recomputes eased progress and emits `update` / `start` / `end`. */
  private _onUpdate() {
    this._eased = easing(this._progress, this.props.easing);

    this._emit('update', {
      progress: this._progress,
      eased: this._eased,
    });

    if (this.progress === 0) {
      this._emit('start', undefined);
    }

    if (this.progress === 1) {
      this._emit('end', undefined);
    }
  }

  protected _destroy() {
    this.pause();

    super._destroy();
  }
}
