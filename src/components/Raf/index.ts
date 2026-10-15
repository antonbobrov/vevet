import { Module } from '@/base/Module';
import { TModuleProps } from '@/base/Module/types';
import {
  isFiniteNumber,
  noopIfDestroyed,
  now,
  TRequiredProps,
} from '@/internal';
import { lerp } from '@/utils';

import { MUTABLE_PROPS, STATIC_PROPS } from './props';
import { IRafCallbacksMap, IRafMutableProps, IRafStaticProps } from './types';

type TC = IRafCallbacksMap;
type TS = IRafStaticProps;
type TM = IRafMutableProps;

/**
 * `requestAnimationFrame` loop with FPS throttling and frame-rate–independent easing.
 *
 * - Schedules a rAF chain while `enabled` is true
 * - Throttles logical frames via `fps` (fixed cap or `'auto'`)
 * - Measures real-time `fps`, `duration`, and frame `index`
 * - Exposes {@link lerpFactor} and {@link damp} for refresh-rate–independent motion
 *
 * Animation loop
 *
 * `play` / `enabled: true` → rAF chain → throttled `frame` callbacks →
 * `pause` / `enabled: false` → `cancelAnimationFrame`.
 *
 * Each `frame` payload includes `lerpFactor` bound to the current {@link duration}.
 *
 * [Documentation](https://vevetjs.com/docs/Raf)
 *
 * @group Components
 */
export class Raf extends Module<TC, TS, TM> {
  public _getStatic(): TRequiredProps<TS> {
    return { ...super._getStatic(), ...STATIC_PROPS };
  }

  public _getMutable(): TRequiredProps<TM> {
    return { ...super._getMutable(), ...MUTABLE_PROPS };
  }

  private _isPlaying = false;

  private _raf: number | null = null;

  private _lastTimestamp: null | number = null;

  private _timestamp: null | number = null;

  private _index = 0;

  private _fps = 60;

  private _duration = 0;

  constructor(props?: TModuleProps<TC, TS, TM, Raf>) {
    super(props);

    this._fps = this.props.fps === 'auto' ? this._fps : this.props.fps;

    if (this.props.enabled) {
      this._play();
    }
  }

  /** Whether the rAF chain is active (`enabled` and not paused). */
  get isPlaying() {
    return this._isPlaying;
  }

  /** High-resolution timestamp of the last processed frame (`now()`). */
  get timestamp() {
    return this._timestamp ?? 0;
  }

  /** Count of processed frames since the last `enabled` / `fps` reset. */
  get index() {
    return this._index;
  }

  /** Estimated real-time FPS (recalculated every `fpsRecalcFrames`). */
  get fps() {
    return this._fps;
  }

  /** Duration of the last processed frame in milliseconds. */
  get duration() {
    return this._duration;
  }

  /** Multiplier `60 / fps` for physics tuned to a 60 Hz baseline. */
  get fpsFactor() {
    return 60 / this.fps;
  }

  protected _handleProps(props: Partial<TM>) {
    super._handleProps(props);

    this._lastTimestamp = null;

    if (this.props.enabled) {
      this._play();
    } else {
      this._pause();
    }
  }

  /** Sets `enabled: true` and starts the loop when currently disabled. */
  @noopIfDestroyed
  public play() {
    if (this.props.enabled) {
      return;
    }

    this.updateProps({ enabled: true });
  }

  private _play() {
    if (this.isPlaying) {
      return;
    }

    this._isPlaying = true;

    this.callbacks.emit('play', undefined);
    this.callbacks.emit('toggle', undefined);

    this._raf = window.requestAnimationFrame(this._animate.bind(this));
  }

  /** Sets `enabled: false` and cancels the scheduled rAF. */
  @noopIfDestroyed
  public pause() {
    if (!this.props.enabled) {
      return;
    }

    this.updateProps({ enabled: false });
  }

  private _pause() {
    if (!this.isPlaying) {
      return;
    }

    if (this._raf) {
      window.cancelAnimationFrame(this._raf);
      this._raf = null;
    }

    this._isPlaying = false;

    this.callbacks.emit('pause', undefined);
    this.callbacks.emit('toggle', undefined);
  }

  /**
   * rAF tick — schedules the next frame, applies FPS cap, emits `frame`.
   *
   * @internal
   */
  private _animate() {
    if (!this._isPlaying) {
      return;
    }

    this._raf = window.requestAnimationFrame(this._animate.bind(this));

    const minFrameDuration =
      this.props.fps === 'auto' ? 1 : 1000 / this.props.fps;

    this._timestamp = now();
    this._lastTimestamp ??= this._timestamp;

    const duration = this._timestamp - (this._lastTimestamp ?? this._timestamp);

    if (duration < minFrameDuration) {
      return;
    }

    this._duration = duration;
    this._lastTimestamp = this._timestamp;
    this._index += 1;

    this._computeFPS();

    this.callbacks.emit('frame', {
      fps: this.fps,
      fpsFactor: this.fpsFactor,
      duration: this.duration,
      lerpFactor: this.lerpFactor.bind(this),
    });
  }

  /**
   * Frame-rate–independent interpolation factor for the last {@link duration}.
   *
   * Non-finite `ease` falls back to `1`.
   */
  public lerpFactor(ease: number) {
    const finalEase = isFiniteNumber(ease) ? ease : 1;

    return 1 - Math.exp(-finalEase * 60 * (this.duration / 1000));
  }

  /** {@link lerp} toward `to` using {@link lerpFactor}. */
  public damp(from: number, to: number, ease: number, approximation?: number) {
    return lerp(from, to, this.lerpFactor(ease), approximation);
  }

  private _computeFPS() {
    const { duration, index, props } = this;

    if (
      (index > 10 && index % props.fpsRecalcFrames !== 0) ||
      duration <= 0 ||
      duration > 250
    ) {
      return;
    }

    const standardFps = 60;
    const standardFrameTime = 1000 / standardFps;
    const fpsMultiplier = standardFrameTime / duration;

    this._fps = Math.round(60 * fpsMultiplier) || 1;
  }

  /** Pauses the loop and clears the scheduled rAF. */
  protected _destroy() {
    this.pause();

    super._destroy();
  }
}
