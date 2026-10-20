import { Module } from '@/base/Module';
import { TModuleProps } from '@/base/Module/types';
import {
  isFiniteNumber,
  isNumber,
  noopIfDestroyed,
  now,
  TRequiredProps,
} from '@/internal';
import { isSpring, lerp } from '@/utils';

import { DEFAULTS, MUTABLE_PROPS, STATIC_PROPS } from './props';
import {
  IRafCallbacksMap,
  IRafMutableProps,
  IRafStaticProps,
  TRafEntry,
  TRafStoredEntry,
} from './types';
import { rafSpring } from './utils/spring';

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
 * - Named entries via {@link add} / {@link value} / {@link target} / {@link sync} /
 *   {@link delete} / {@link interpolated}: damp (`ease: number`) or spring (`ease: { stiffness, damping }`),
 *   optional `friction` (interpolate numeric target toward `0` with the same `ease`),
 *   interpolated each processed frame
 *
 * Animation loop
 *
 * `play` / `enabled: true` → rAF chain → throttled `frame` callbacks →
 * `pause` / `enabled: false` → `cancelAnimationFrame`.
 *
 * Named entries are updated before `frame` fires.
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

  private _entries = new Map<string, TRafStoredEntry>();

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
    this._lerpValues();

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

  /**
   * Registers a named entry interpolated each processed frame.
   *
   * - `ease: number` → {@link damp}
   * - `ease: { stiffness, damping }` → spring
   * - `ease: () => …` → resolved every frame (dynamic config)
   * - `friction: true` → also interpolate numeric target toward `0` with the same `ease`
   *
   * No-op if `name` is already registered.
   */
  @noopIfDestroyed
  public add(name: string, entry: number | TRafEntry) {
    if (this._entries.has(name)) {
      return;
    }

    if (isNumber(entry)) {
      this._entries.set(name, {
        value: entry,
        target: entry,
        velocity: 0,
        targetVelocity: 0,
      });

      return;
    }

    this._entries.set(name, {
      value: entry.value,
      target: entry.target ?? entry.value,
      velocity: 0,
      targetVelocity: 0,
      ease: entry.ease,
      appx: entry.appx,
      friction: entry.friction,
    });
  }

  /**
   * Gets or sets the current (lerped) value for a registered name.
   *
   * - `value(name)` — current value
   * - `value(name, number)` — set value, clear spring velocity, and call {@link play}
   *
   * @throws If `name` is not registered.
   */
  public value(name: string, value?: number): number {
    const entry = this._entries.get(name);

    if (!entry) {
      throw new Error(`Raf entry "${name}" is not registered`);
    }

    if (isFiniteNumber(value)) {
      entry.value = value;
      entry.velocity = 0;
      this.play();

      return value;
    }

    return entry.value;
  }

  /**
   * Gets or sets the lerp target for a registered name.
   *
   * - `target(name)` — current target
   * - `target(name, value)` — set target and call {@link play}
   * - `target(name, value, true)` — snap immediately (clear spring velocities) and call {@link play}
   *
   * @throws If `name` is not registered.
   */
  public target(name: string, value?: number, immediate?: boolean): number {
    const entry = this._entries.get(name);

    if (!entry) {
      throw new Error(`Raf entry "${name}" is not registered`);
    }

    if (isFiniteNumber(value)) {
      entry.target = value;

      if (immediate) {
        entry.value = value;
        entry.velocity = 0;
        entry.targetVelocity = 0;
      }

      this.play();

      return value;
    }

    return this._getTarget(entry);
  }

  /**
   * Snaps named entries to their targets, clears spring velocities, and calls {@link play}.
   *
   * - No args — every registered entry
   * - `sync('x', 'y')` — only those names
   *
   * @throws If a provided name is not registered.
   */
  @noopIfDestroyed
  public sync(...names: string[]) {
    const syncEntry = (entry: TRafStoredEntry) => {
      entry.value = this._getTarget(entry);
      entry.velocity = 0;
      entry.targetVelocity = 0;
    };

    if (names.length === 0) {
      this._entries.forEach(syncEntry);
    } else {
      names.forEach((name) => {
        const entry = this._entries.get(name);

        if (!entry) {
          throw new Error(`Raf entry "${name}" is not registered`);
        }

        syncEntry(entry);
      });
    }

    this.play();
  }

  /** Removes a registered entry. */
  @noopIfDestroyed
  public delete(name: string) {
    this._entries.delete(name);
  }

  /**
   * Whether named entries have settled within their `appx`.
   *
   * - No args — every registered entry
   * - `name` — that entry only
   *
   * @throws If `name` is provided but not registered.
   */
  public interpolated(name?: string) {
    if (name !== undefined) {
      const entry = this._entries.get(name);

      if (!entry) {
        throw new Error(`Raf entry "${name}" is not registered`);
      }

      return this._isInterpolated(entry);
    }

    let settled = true;

    this._entries.forEach((entry) => {
      if (!settled) {
        return;
      }

      if (!this._isInterpolated(entry)) {
        settled = false;
      }
    });

    return settled;
  }

  private _isInterpolated(entry: TRafStoredEntry) {
    const { value, velocity, targetVelocity } = entry;
    const target = this._getTarget(entry);
    const appx = this._getAppx(entry);

    if (entry.friction) {
      return (
        Math.abs(value) <= appx &&
        Math.abs(target) <= appx &&
        Math.abs(velocity) <= appx &&
        Math.abs(targetVelocity) <= appx
      );
    }

    return Math.abs(target - value) <= appx && Math.abs(velocity) <= appx;
  }

  private _getTarget(entry: TRafStoredEntry) {
    const { target } = entry;

    return typeof target === 'function' ? target() : target;
  }

  private _getEase(entry: TRafStoredEntry) {
    const { ease } = entry;

    return typeof ease === 'function' ? ease() : (ease ?? DEFAULTS.ease);
  }

  private _getAppx(entry: TRafStoredEntry) {
    const { appx } = entry;
    const value = typeof appx === 'function' ? appx() : appx;

    if (value === undefined) {
      return DEFAULTS.appx;
    }

    return isFiniteNumber(value) && value > 0 ? value : 0;
  }

  /** Interpolates named entries toward their targets (damp or spring). */
  private _lerpValues() {
    this._entries.forEach((entry) => {
      const { value, velocity } = entry;

      const ease = this._getEase(entry);
      const appx = this._getAppx(entry);

      let target = this._getTarget(entry);

      if (entry.friction && isNumber(entry.target)) {
        if (isSpring(ease)) {
          const next = rafSpring({
            spring: ease,
            current: entry.target,
            target: 0,
            velocity: entry.targetVelocity,
            duration: this.duration,
            appx,
          });

          entry.target = next.value;
          entry.targetVelocity = next.velocity;
        } else {
          entry.target = this.damp(entry.target, 0, ease, appx);
          entry.targetVelocity = 0;
        }

        target = entry.target;
      }

      if (isSpring(ease)) {
        const next = rafSpring({
          spring: ease,
          current: value,
          target,
          velocity,
          duration: this.duration,
          appx,
        });

        entry.value = next.value;
        entry.velocity = next.velocity;
      } else {
        entry.value = this.damp(value, target, ease, appx);
      }
    });
  }

  /** Pauses the loop and clears the scheduled rAF. */
  protected _destroy() {
    this.pause();
    this._entries.clear();

    super._destroy();
  }
}
