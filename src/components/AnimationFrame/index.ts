import { Component as ComponentClass } from '@/base/Component';
import { NAnimationFrame } from './types';

export type { NAnimationFrame };

/**
 * Launch an animation frame with a certain FPS
 */
export class AnimationFrame<
  StaticProps extends NAnimationFrame.IStaticProps = NAnimationFrame.IStaticProps,
  ChangeableProps extends NAnimationFrame.IChangeableProps = NAnimationFrame.IChangeableProps,
  CallbacksTypes extends NAnimationFrame.ICallbacksTypes = NAnimationFrame.ICallbacksTypes
> extends ComponentClass<StaticProps, ChangeableProps, CallbacksTypes> {
  protected _getDefaultProps() {
    return {
      ...super._getDefaultProps(),
      fps: 'auto',
      autoFpsFrames: 10,
      isEnabled: false,
    };
  }

  /** If the frame is launched */
  private _isPlaying: boolean;

  get isPlaying() {
    return this._isPlaying;
  }

  /** The animation frame */
  private _frame: number | null;

  /** Last frame time */
  private _frameIndex: number;

  /** First frame time */
  private _firstFrameTime: null | number;

  /** Last frame time */
  private _lastFrameTime: null | number;

  /** Array of frame time durations */
  private _frameDurations: number[];

  /** Computed fps */
  private _computedFPS: number;

  /** Computed real time fps */
  get computedFPS() {
    return this._computedFPS;
  }

  /** Coefficient of standard fps (60) divided by computed fps */
  get easeMultiplier() {
    return 60 / this.computedFPS;
  }

  constructor(initialProps?: StaticProps & ChangeableProps, canInit = true) {
    super(initialProps, false);

    this._isPlaying = false;
    this._frame = null;
    this._frameIndex = -1;
    this._firstFrameTime = null;
    this._lastFrameTime = null;
    this._frameDurations = [];
    this._computedFPS = this.props.fps !== 'auto' ? this.props.fps : 60;

    if (canInit) {
      this.init();
    }
  }

  protected _init() {
    super._init();

    if (this.props.isEnabled) {
      this.play();
    }
  }

  protected _onPropsMutate() {
    super._onPropsMutate();

    this._frameIndex = -1;
    this._firstFrameTime = null;
    this._lastFrameTime = null;

    if (this.props.isEnabled) {
      this._play();
    } else {
      this._pause();
    }
  }

  /** Play animation */
  public play() {
    if (this.isDestroyed) {
      return;
    }

    if (this.props.isEnabled) {
      return;
    }

    this.changeProps({ isEnabled: true } as ChangeableProps);
  }

  /** Play animation */
  private _play() {
    if (this.isPlaying) {
      return;
    }

    this._isPlaying = true;

    this.callbacks.tbt('play', undefined);
    this.callbacks.tbt('toggle', undefined);

    this._frame = window.requestAnimationFrame(this._animate.bind(this));
  }

  /** Pause animation */
  public pause() {
    if (!this.props.isEnabled) {
      return;
    }

    this.changeProps({ isEnabled: false } as ChangeableProps);
  }

  /** Pause animation */
  private _pause() {
    if (!this.isPlaying) {
      return;
    }

    if (this._frame) {
      window.cancelAnimationFrame(this._frame);
      this._frame = null;
    }

    this._isPlaying = false;

    this.callbacks.tbt('pause', undefined);
    this.callbacks.tbt('toggle', undefined);
  }

  /** Launch the animation frame */
  private _animate() {
    if (!this._isPlaying) {
      return;
    }

    this._frame = window.requestAnimationFrame(this._animate.bind(this));

    // update time
    const startTime = +new Date();
    if (this._firstFrameTime === null) {
      this._firstFrameTime = startTime;
    }

    // calculate frame index
    const minFrameDuration =
      this.props.fps === 'auto' ? 1 : 1000 / this.props.fps;
    const newFrameIndex = Math.floor(
      (startTime - this._firstFrameTime) / minFrameDuration
    );

    // break if frame index the same
    if (newFrameIndex <= this._frameIndex) {
      return;
    }

    // update frame index
    this._frameIndex = newFrameIndex;

    // compute fps
    this._computeFPS(startTime);

    // launch callbacks
    this.callbacks.tbt('frame', undefined);

    // update vars
    this._lastFrameTime = startTime;
  }

  /** Compute real-time FPS */
  private _computeFPS(startTime: number) {
    const lastFrameDuration = startTime - (this._lastFrameTime ?? startTime);

    // skip frames that seem not real
    if (lastFrameDuration <= 0 || lastFrameDuration > 250) {
      return;
    }

    this._frameDurations.push(lastFrameDuration);

    if (this._frameDurations.length < this.props.autoFpsFrames) {
      return;
    }

    const totalFramesDuration = this._frameDurations.reduce(
      (prev, curr) => prev + curr
    );

    const approximateFrameDuration =
      totalFramesDuration / this._frameDurations.length;

    const computedFPS = Math.floor(1000 / approximateFrameDuration);
    const normalizedFPS = Math.round(computedFPS / 10) * 10;

    this._computedFPS = normalizedFPS;

    // clear durations
    this._frameDurations = [];
  }

  /** Destroy the animation frame */
  protected _destroy() {
    this.pause();

    super._destroy();
  }
}
