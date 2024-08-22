import { clamp } from '@/utils/math';
import { BaseTimeline } from '../BaseTimeline';
import { NTimeline } from './types';

export type { NTimeline };

/**
 * Animation timeline
 */
export class Timeline<
  StaticProps extends NTimeline.IStaticProps = NTimeline.IStaticProps,
  ChangeableProps extends
    NTimeline.IChangeableProps = NTimeline.IChangeableProps,
  CallbacksTypes extends NTimeline.ICallbacksTypes = NTimeline.ICallbacksTypes,
> extends BaseTimeline<StaticProps, ChangeableProps, CallbacksTypes> {
  protected _getDefaultProps() {
    return {
      ...super._getDefaultProps(),
      duration: 1000,
      shouldDestroyOnEnd: false,
    };
  }

  /** The animation frame */
  protected _animationFrame?: number;

  /** Last time when animationFrame callback has been called */
  protected _animationFrameLastTime: number;

  /** Timeline is playing */
  get isPlaying() {
    return typeof this._animationFrame !== 'undefined';
  }

  /** Timeline is reversed */
  protected _isReversed: boolean;

  /** Timeline is reversed */
  get isReversed() {
    return this._isReversed;
  }

  /** Timeline is paused */
  protected _isPaused: boolean;

  /** Timeline is paused */
  get isPaused() {
    return this._isPaused;
  }

  get duration() {
    return Math.max(this.props.duration, 1);
  }

  constructor(initialProps?: StaticProps & ChangeableProps, canInit = true) {
    super(initialProps, false);

    // set default variables
    this._animationFrame = undefined;
    this._animationFrameLastTime = 0;
    this._isReversed = false;
    this._isPaused = false;

    if (canInit) {
      this.init();
    }
  }

  /** Play the timeline */
  public play() {
    if (this.isDestroyed || this.p === 1) {
      return;
    }

    this._isReversed = false;
    this._isPaused = false;

    if (!this.isPlaying) {
      this._animationFrameLastTime = +new Date();
      this._animate();
    }
  }

  /** Reverse timeline */
  public reverse() {
    if (this.isDestroyed || this.p === 0) {
      return;
    }

    this._isReversed = true;
    this._isPaused = false;

    if (!this.isPlaying) {
      this._animationFrameLastTime = +new Date();
      this._animate();
    }
  }

  /** Pause animation */
  public pause() {
    if (this.isDestroyed) {
      return;
    }

    this._isPaused = true;

    if (this._animationFrame) {
      window.cancelAnimationFrame(this._animationFrame);
    }
    this._animationFrame = undefined;
  }

  /** Reset timeline */
  public reset() {
    if (this.isDestroyed) {
      return;
    }

    this.pause();
    this.p = 0;
  }

  /** Start animation */
  protected _animate() {
    if (this.isPaused) {
      return;
    }

    const { isReversed } = this;

    // calculate difference between frames
    const currentTime = +new Date();
    const frameDiff = Math.abs(this._animationFrameLastTime - currentTime);
    this._animationFrameLastTime = currentTime;

    // calculate current progress
    const progressIterator = frameDiff / this.duration / (isReversed ? -1 : 1);
    const progressTarget = clamp(this.p + progressIterator, [0, 1]);
    this.p = progressTarget;

    // end animation
    if (
      (progressTarget === 1 && !isReversed) ||
      (progressTarget === 0 && isReversed)
    ) {
      this._isReversed = false;
      this._isPaused = false;
      this._animationFrame = undefined;

      return;
    }

    // continue animation
    this._animationFrame = window.requestAnimationFrame(
      this._animate.bind(this),
    );
  }

  /** Events on progress */
  protected _handleProgressUpdate() {
    super._handleProgressUpdate();

    if (this.p === 0) {
      this.callbacks.tbt('start', undefined);

      return;
    }

    if (this.p === 1) {
      this.callbacks.tbt('end', undefined);

      if (this.props.shouldDestroyOnEnd) {
        this.destroy();
      }
    }
  }

  /** Destroy the timeline */
  protected _destroy() {
    this.pause();

    super._destroy();
  }
}
