import { Raf } from '@/components/Raf';
import { Timeline } from '@/components/Timeline';
import { isNumber } from '@/internal/isNumber';
import { toPixels } from '@/utils';
import { clamp, lerp, loop } from '@/utils/math';

import { Snap } from '..';
import { ISnapTransitionArg, SnapSlide } from '../..';
import { LERP_APPROXIMATION } from '../props';

import { IProps } from './types';

export class SnapTrack {
  /** The animation frame */
  private _raf: Raf;

  /** The animationtimeline */
  private _tm?: Timeline;

  /** Interpolation influence */
  private _influence = { current: 0, target: 0 };

  /** The current track value */
  private _current = 0;

  /** The target track value */
  private _target = 0;

  /** Target slide index */
  private _targetIndex?: number;

  /** Whether the track is destroyed */
  private _isDestroyed = false;

  constructor(
    private props: typeof Snap.prototype.props,
    private _slides: () => SnapSlide[],
    private ctx: IProps,
  ) {
    // Create the animation frame
    this._raf = new Raf();
    this._raf.on('frame', () => this._handleRaf());
    this._raf.on('play', () => ctx.onRafPlay?.());
    this._raf.on('pause', () => ctx.onRafPause?.());
  }

  private get slides() {
    return this._slides();
  }

  /** Gets the target slide index */
  get targetIndex() {
    return this._targetIndex;
  }

  /** Gets the interpolation influence */
  get influence() {
    return this._influence.current;
  }

  /** Gets the current track value. */
  get current() {
    return this._current;
  }

  /** Sets the current track value */
  set current(value: number) {
    this._current = value;
  }

  /** Gets the target track value. */
  get target() {
    return this._target;
  }

  /** Sets the target track value */
  set target(value: number) {
    const containerSize = this.ctx.containerSize();
    const diff = value - this._target;

    this._target = value;

    this._influence.target += containerSize ? diff / containerSize : 0;
    this._influence.target = clamp(this._influence.target, -1, 1);
  }

  /** Detect if can loop */
  get canLoop() {
    const { props, slides } = this;

    return props.loop && slides.length > 1;
  }

  /** Get looped current value */
  get loopedCurrent() {
    return this.loopCoord(this.current);
  }

  /** Get track offset */
  get offset() {
    const containerSize = this.ctx.containerSize();
    const firstSlideSize = this.ctx.firstSlideSize();

    return this.props.centered ? containerSize / 2 - firstSlideSize / 2 : 0;
  }

  /** Get loop count */
  get loopCount() {
    if (!this.canLoop) {
      return 0;
    }

    return Math.floor(this.current / this.max);
  }

  /** If transition in progress */
  get isTransitioning() {
    return !!this._tm;
  }

  /** Get minimum track value */
  get min() {
    const containerSize = this.ctx.containerSize();
    const { props, slides } = this;

    if (this.canLoop) {
      return 0;
    }

    if (props.centered) {
      const firstSlide = slides[0];

      if (firstSlide.size > containerSize) {
        return containerSize / 2 - firstSlide.size / 2;
      }
    }

    return 0;
  }

  /** Get maximum track value */
  get max() {
    const containerSize = this.ctx.containerSize();
    const { slides, canLoop, props } = this;

    const firstSlide = slides[0];
    const lastSlide = slides[slides.length - 1];
    const lastCoordWithSlide = lastSlide.staticCoord + lastSlide.size;

    let max = canLoop
      ? lastCoordWithSlide + toPixels(props.gap)
      : lastCoordWithSlide - containerSize;

    if (canLoop) {
      return max;
    }

    if (props.centered) {
      max += containerSize / 2 - firstSlide.size / 2;

      if (lastSlide.size < containerSize) {
        max += containerSize / 2 - lastSlide.size / 2;
      }
    }

    if (!props.centered) {
      max = Math.max(max, 0);
    }

    return max;
  }

  /** Get track progress. From 0 to 1 if not loop. From -Infinity to Infinity if loop */
  get progress() {
    return this.current / this.max;
  }

  /** If the start has been reached */
  get isStart() {
    if (this.props.loop) {
      return false;
    }

    return Math.floor(this.target) <= Math.floor(this.min);
  }

  /** If the end has been reached */
  get isEnd() {
    if (this.props.loop) {
      return false;
    }

    return Math.floor(this.target) >= Math.floor(this.max);
  }

  /** Whether the track is interpolated */
  private get isInterpolated() {
    return this.current === this.target && this._influence.current === 0;
  }

  /** Handle RAF update, interpolate track values */
  private _handleRaf() {
    const { isTransitioning, props, _raf: raf } = this;

    if (isTransitioning) {
      return;
    }

    // Interpolate track value
    const ease = raf.lerpFactor(props.lerp);
    this._lerp(ease);

    // Stop raf if target reached
    if (this.isInterpolated) {
      raf.pause();
    }

    // Render the scene
    this.ctx.onRender(raf.duration);
  }

  /** Awake requestAnimationFrame */
  public awake() {
    this._raf.play();
  }

  /** Set track target value */
  public updateTarget(value: number) {
    this.target = value;

    this.awake();
  }

  /** Clamp target value between min and max values */
  public clampTarget() {
    if (!this.canLoop) {
      this.target = clamp(this.target, this.min, this.max);
    }

    this.awake();
  }

  /** Set a value to current & target value instantly */
  public set(value: number) {
    this.current = value;
    this.target = value;
    this._influence.current = 0;
    this._influence.target = 0;
  }

  /** Loop a coordinate if can loop */
  public loopCoord(coord: number) {
    return this.canLoop ? loop(coord, this.min, this.max) : coord;
  }

  /** Interpolate the current track value */
  private _lerp(initialFactor: number) {
    const { target, _influence: influence } = this;

    let lerpFactor = initialFactor;

    // Interpolate current value

    const rest = Math.abs(this.current - target);
    const fastThreshold = 3;

    if (rest < fastThreshold) {
      const fastProgress = 1 - rest / fastThreshold;
      const additionalFactor = (1 - lerpFactor) / 15;
      lerpFactor += additionalFactor * fastProgress;
    }

    this.current = lerp(this.current, target, lerpFactor, LERP_APPROXIMATION);

    // Interpolate influence

    influence.target = lerp(
      influence.target,
      0,
      lerpFactor,
      LERP_APPROXIMATION,
    );

    influence.current = lerp(
      influence.current,
      influence.target,
      lerpFactor,
      LERP_APPROXIMATION,
    );
  }

  /** Go to a definite coordinate */
  public toCoord(coordinate: number, options?: ISnapTransitionArg) {
    if (this._isDestroyed) {
      return false;
    }

    const { props, ctx } = this;

    this.cancelTransition();

    const start = this.current;
    const end = coordinate;
    const diff = Math.abs(end - start);

    const durationProp = options?.duration ?? props.duration;

    let duration = isNumber(durationProp) ? durationProp : durationProp(diff);
    if (diff === 0) {
      duration = 0;
    }

    const easing = options?.easing ?? props.easing;

    const tm = new Timeline({ duration, easing });

    this._tm = tm;

    tm.on('start', () => {
      ctx.onTimelineStart();
      options?.onStart?.();
    });

    tm.on('update', (data) => {
      this.current = lerp(start, end, data.eased);
      this.target = this.current;

      this._influence.current = this._influence.current * (1 - data.progress);
      this._influence.target = this._influence.current;

      if (data.progress === 1) {
        this.setTargetIndex(undefined);
        this._tm = undefined;
      }

      ctx.onTimelineUpdate(data);
      ctx.onRender();
      options?.onUpdate?.(data);
    });

    tm.on('end', () => {
      tm.destroy();

      ctx.onTimelineEnd();
      options?.onEnd?.();
    });

    tm.on('destroy', () => {
      this.setTargetIndex(undefined);
    });

    tm.play();

    return true;
  }

  /** Set target index */
  public setTargetIndex(value: number | undefined) {
    this._targetIndex = value;
  }

  /** Cancel sticky behavior */
  public cancelTransition() {
    this._tm?.destroy();
    this._tm = undefined;
  }

  /** Destroy the instance */
  public destroy() {
    this._isDestroyed = true;

    this._raf.destroy();
    this.cancelTransition();
  }
}
