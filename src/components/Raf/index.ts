import { Module, TModuleOnCallbacksProps } from '@/base/Module';
import { noopIfDestroyed } from '@/internal/noopIfDestroyed';
import { TRequiredProps } from '@/internal/requiredProps';

import { MUTABLE_PROPS, STATIC_PROPS } from './props';
import { IRafCallbacksMap, IRafMutableProps, IRafStaticProps } from './types';

export * from './types';

type TC = IRafCallbacksMap;
type TS = IRafStaticProps;
type TM = IRafMutableProps;

/**
 * Manages an animation frame loop with configurable FPS and playback controls.
 *
 * [Documentation](https://vevetjs.com/docs/Raf)
 *
 * @group Components
 */
export class Raf extends Module<TC, TS, TM> {
  /** Get default static properties */
  public _getStatic(): TRequiredProps<TS> {
    return { ...super._getStatic(), ...STATIC_PROPS };
  }

  /** Get default mutable properties */
  public _getMutable(): TRequiredProps<TM> {
    return { ...super._getMutable(), ...MUTABLE_PROPS };
  }

  /** Indicates if the animation frame is currently running */
  private _isPlaying = false;

  /** Active requestAnimationFrame ID, or `null` if not running */
  private _raf: number | null = null;

  /** Timestamp of the last frame */
  private _lastTimestamp: null | number = null;

  /** Timestamp of the current frame */
  private _timestamp: null | number = null;

  /** Current frame index */
  private _index = 0;

  /** Real-time FPS */
  private _fps = 60;

  /** Duration of the last frame in ms */
  private _duration = 0;

  constructor(props?: TS & TM, onCallbacks?: TModuleOnCallbacksProps<TC, Raf>) {
    super(props, onCallbacks as any);

    // Initialize FPS
    this._fps = this.props.fps === 'auto' ? this._fps : this.props.fps;

    // Play on init
    if (this.props.enabled) {
      this._play();
    }
  }

  /** Playback state of the animation frame */
  get isPlaying() {
    return this._isPlaying;
  }

  /** Timestamp of the current frame */
  get timestamp() {
    return this._timestamp ?? 0;
  }

  /** Current frame index */
  get index() {
    return this._index;
  }

  /** Real-time FPS */
  get fps() {
    return this._fps;
  }

  /** Duration of the last frame in ms */
  get duration() {
    return this._duration;
  }

  /** Scaling coefficient based on a 60 FPS target */
  get fpsFactor() {
    return 60 / this.fps;
  }

  /** Handle property mutations */
  protected _handleProps() {
    super._handleProps();

    this._lastTimestamp = null;

    if (this.props.enabled) {
      this._play();
    } else {
      this._pause();
    }
  }

  /** Start the animation loop */
  @noopIfDestroyed
  public play() {
    if (this.props.enabled) {
      return;
    }

    this.updateProps({ enabled: true } as TM);
  }

  /** Internal method to start the loop */
  private _play() {
    if (this.isPlaying) {
      return;
    }

    this._isPlaying = true;

    this.callbacks.emit('play', undefined);
    this.callbacks.emit('toggle', undefined);

    this._raf = window.requestAnimationFrame(this._animate.bind(this));
  }

  /** Pause the animation loop */
  @noopIfDestroyed
  public pause() {
    if (!this.props.enabled) {
      return;
    }

    this.updateProps({ enabled: false } as TM);
  }

  /** Internal method to pause the loop */
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

  /** Animation loop handler, calculates FPS, and triggers callbacks */
  private _animate() {
    if (!this._isPlaying) {
      return;
    }

    this._raf = window.requestAnimationFrame(this._animate.bind(this));

    const minFrameDuration =
      this.props.fps === 'auto' ? 1 : 1000 / this.props.fps;

    this._timestamp = performance.now();
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

  /** Calculate linear interpolation factor to make animations run the same regardless of FPS */
  public lerpFactor(ease: number) {
    return 1 - Math.exp(-ease * 60 * (this.duration / 1000));
  }

  /** Compute real-time FPS from frame durations */
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

  /** Destroy the animation frame and stop the loop */
  protected _destroy() {
    this.pause();

    super._destroy();
  }
}
