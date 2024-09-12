import { Component as ComponentClass } from '@/base/Component';
import { NAnimationFrame } from './types';

export type { NAnimationFrame };

/**
 * Launch an animation frame with a certain FPS
 */
export class AnimationFrame<
  StaticProps extends
    NAnimationFrame.IStaticProps = NAnimationFrame.IStaticProps,
  ChangeableProps extends
    NAnimationFrame.IChangeableProps = NAnimationFrame.IChangeableProps,
  CallbacksTypes extends
    NAnimationFrame.ICallbacksTypes = NAnimationFrame.ICallbacksTypes,
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
  protected _isPlaying: boolean;

  get isPlaying() {
    return this._isPlaying;
  }

  /** The animation frame */
  protected _raf: number | null;

  /** Last frame time */
  protected _rafIndex: number;

  /** First frame time */
  protected _rafFirst: null | number;

  /** Last frame time */
  protected _rafLast: null | number;

  /** Array of frame time durations */
  protected _durations: number[];

  /** Computed fps */
  protected _computedFPS: number;

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
    this._raf = null;
    this._rafIndex = -1;
    this._rafFirst = null;
    this._rafLast = null;
    this._durations = [];
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

    this._rafIndex = -1;
    this._rafFirst = null;
    this._rafLast = null;

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
  protected _play() {
    if (this.isPlaying) {
      return;
    }

    this._isPlaying = true;

    this.callbacks.tbt('play', undefined);
    this.callbacks.tbt('toggle', undefined);

    this._raf = window.requestAnimationFrame(this._animate.bind(this));
  }

  /** Pause animation */
  public pause() {
    if (!this.props.isEnabled) {
      return;
    }

    this.changeProps({ isEnabled: false } as ChangeableProps);
  }

  /** Pause animation */
  protected _pause() {
    if (!this.isPlaying) {
      return;
    }

    if (this._raf) {
      window.cancelAnimationFrame(this._raf);
      this._raf = null;
    }

    this._isPlaying = false;

    this.callbacks.tbt('pause', undefined);
    this.callbacks.tbt('toggle', undefined);
  }

  /** Launch the animation frame */
  protected _animate() {
    if (!this._isPlaying) {
      return;
    }

    this._raf = window.requestAnimationFrame(this._animate.bind(this));

    // update time
    const startTime = Date.now();
    if (this._rafFirst === null) {
      this._rafFirst = startTime;
    }

    // calculate frame index
    const minFrameDuration =
      this.props.fps === 'auto' ? 1 : 1000 / this.props.fps;
    const newFrameIndex = Math.floor(
      (startTime - this._rafFirst) / minFrameDuration,
    );

    // break if frame index the same
    if (newFrameIndex <= this._rafIndex) {
      return;
    }

    // update frame index
    this._rafIndex = newFrameIndex;

    // compute fps
    this._computeFPS(startTime);

    // launch callbacks
    this.callbacks.tbt('frame', undefined);

    // update vars
    this._rafLast = startTime;
  }

  /** Compute real-time FPS */
  protected _computeFPS(startTime: number) {
    const lastFrameDuration = startTime - (this._rafLast ?? startTime);

    // skip frames that seem not real
    if (lastFrameDuration <= 0 || lastFrameDuration > 250) {
      return;
    }

    this._durations.push(lastFrameDuration);

    if (this._durations.length < this.props.autoFpsFrames) {
      return;
    }

    const totalFramesDuration = this._durations.reduce(
      (prev, curr) => prev + curr,
    );

    const approximateFrameDuration =
      totalFramesDuration / this._durations.length;

    const computedFPS = Math.floor(1000 / approximateFrameDuration);
    const normalizedFPS = Math.round(computedFPS / 10) * 10;

    this._computedFPS = normalizedFPS;

    // clear durations
    this._durations = [];
  }

  /** Destroy the animation frame */
  protected _destroy() {
    this.pause();

    super._destroy();
  }
}
