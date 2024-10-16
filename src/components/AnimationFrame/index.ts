import { Component as ComponentClass } from '@/base/Component';
import { NAnimationFrame } from './types';

export type { NAnimationFrame };

/**
 * Launches an animation frame with a specified FPS, allowing
 * control over playback and FPS calculations in real-time.
 *
 * @link See examples https://antonbobrov.github.io/vevet-demo/animation-frame/
 *
 * @link See docs https://antonbobrov.github.io/vevet/classes/AnimationFrame.html
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

  /** Whether the animation frame is currently playing */
  protected _isPlaying: boolean;

  /** Returns the current playback state of the animation frame */
  get isPlaying() {
    return this._isPlaying;
  }

  /** The ID of the currently active requestAnimationFrame, or `null` if inactive */
  protected _raf: number | null;

  /** Index of the current animation frame */
  protected _rafIndex: number;

  /** The timestamp of the first frame in the animation sequence */
  protected _rafFirst: null | number;

  /** The timestamp of the last frame in the animation sequence */
  protected _rafLast: null | number;

  /** Array storing the duration of each frame in milliseconds */
  protected _durations: number[];

  /** The computed frames per second based on real-time performance */
  protected _computedFPS: number;

  /** Returns the current computed FPS, which may differ from the set FPS */
  get computedFPS() {
    return this._computedFPS;
  }

  /** Coefficient that scales based on a target of 60 FPS compared to the computed FPS */
  get fpsMultiplier() {
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
      this._play();
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

  /** Begins the animation loop */
  public play() {
    if (this.isDestroyed) {
      return;
    }

    if (this.props.isEnabled) {
      return;
    }

    this.changeProps({ isEnabled: true } as ChangeableProps);
  }

  /** Internal method to start the animation loop */
  protected _play() {
    if (this.isPlaying) {
      return;
    }

    this._isPlaying = true;

    this.callbacks.tbt('play', undefined);
    this.callbacks.tbt('toggle', undefined);

    this._raf = window.requestAnimationFrame(this._animate.bind(this));
  }

  /** Pauses the animation loop */
  public pause() {
    if (!this.props.isEnabled) {
      return;
    }

    this.changeProps({ isEnabled: false } as ChangeableProps);
  }

  /** Internal method to pause the animation loop */
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

  /** Handles each frame of the animation, calculates FPS, and triggers callbacks */
  protected _animate() {
    if (!this._isPlaying) {
      return;
    }

    this._raf = window.requestAnimationFrame(this._animate.bind(this));

    const startTime = Date.now();
    if (this._rafFirst === null) {
      this._rafFirst = startTime;
    }

    const minFrameDuration =
      this.props.fps === 'auto' ? 1 : 1000 / this.props.fps;
    const newFrameIndex = Math.floor(
      (startTime - this._rafFirst) / minFrameDuration,
    );

    if (newFrameIndex <= this._rafIndex) {
      return;
    }

    this._rafIndex = newFrameIndex;

    this._computeFPS(startTime);

    this.callbacks.tbt('frame', undefined);

    this._rafLast = startTime;
  }

  /** Computes the real-time FPS based on the duration between frames */
  protected _computeFPS(startTime: number) {
    const lastFrameDuration = startTime - (this._rafLast ?? startTime);

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

    this._durations = [];
  }

  /** Destroys the animation frame and stops the loop */
  protected _destroy() {
    this.pause();

    super._destroy();
  }
}
