import { Raf } from '@/components/Raf';
import { Timeline } from '@/components/Timeline';
import { isNumber } from '@/internal/isNumber';
import { toPixels } from '@/utils';
import { clamp, lerp, loop, scoped } from '@/utils/math';

import { ISnapTransitionArg, Snap } from '../..';
import { SnapLogic } from '../SnapLogic';

export class SnapTrack extends SnapLogic {
  /** The animation frame */
  private _raf: Raf;

  /** The animationtimeline */
  private _timeline?: Timeline;

  /** Interpolation influence */
  private _influence = {
    current: 0,
    target: 0,
  };

  /** The current track value */
  private _current = 0;

  /** The target track value */
  private _target = 0;

  constructor(snap: Snap) {
    super(snap);

    // Create the animation frame
    this._raf = new Raf();
    this._raf.on('frame', () => this._handleRaf());
    this._raf.on('play', () => snap.callbacks.emit('rafPlay', undefined));
    this._raf.on('pause', () => snap.callbacks.emit('rafPause', undefined));

    // Destroy raf
    this.addDestructor(() => this._raf.destroy());

    // Destroy timeline
    this.addDestructor(() => this.cancelTransition());
  }

  /** Whether the track is interpolated */
  private get isInterpolated() {
    return this.current === this.target && this._influence.current === 0;
  }

  /** Gets the interpolation influence */
  get influence() {
    return this._influence.current;
  }

  /** Sets the interpolation influence */
  set influence(value: number) {
    this._influence.current = value;
    this._influence.target = value;
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
    const { containerSize } = this.snap;
    const diff = value - this._target;

    this._target = value;

    this._influence.target += containerSize ? diff / containerSize : 0;
    this._influence.target = clamp(this._influence.target, -1, 1);
  }

  /** Detect if can loop */
  get canLoop() {
    const { snap } = this;

    return snap.props.loop && snap.slides.length > 1;
  }

  /** Get looped current value */
  get loopedCurrent() {
    return this.loopCoord(this.current);
  }

  /** Get track offset */
  get offset() {
    const { snap } = this;

    return snap.props.centered
      ? snap.containerSize / 2 - snap.firstSlideSize / 2
      : 0;
  }

  /** Get loop count */
  get loopCount() {
    return Math.floor(this.current / this.max);
  }

  /** If transition in progress */
  get isTransitioning() {
    return !!this._timeline;
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

  /** Get minimum track value */
  get min() {
    const { snap } = this;

    if (this.canLoop || snap.isEmpty) {
      return 0;
    }

    if (snap.props.centered) {
      const firstSlide = snap.slides[0];

      if (firstSlide.size > snap.containerSize) {
        return snap.containerSize / 2 - firstSlide.size / 2;
      }
    }

    return 0;
  }

  /** Get maximum track value */
  get max() {
    const { containerSize, slides, isEmpty, props } = this.snap;
    const { canLoop } = this;

    if (isEmpty) {
      return 0;
    }

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

  /** Awake requestAnimationFrame */
  public awake() {
    this._raf.play();
  }

  /** Iterate track target value */
  public iterateTarget(delta: number) {
    this.target += delta;

    this.awake();
  }

  /** Clamp target value between min and max values */
  public clampTarget() {
    if (!this.canLoop) {
      this.target = clamp(this.target, this.min, this.max);
    }

    this.awake();
  }

  /** If the start has been reached */
  get isStart() {
    if (this.snap.props.loop) {
      return false;
    }

    return Math.floor(this.target) <= Math.floor(this.min);
  }

  /** If the end has been reached */
  get isEnd() {
    if (this.snap.props.loop) {
      return false;
    }

    return Math.floor(this.target) >= Math.floor(this.max);
  }

  /** Handle RAF update, interpolate track values */
  private _handleRaf() {
    const { snap } = this;

    if (snap.isTransitioning) {
      return;
    }

    // Interpolate track value
    const ease = this._raf.lerpFactor(snap.props.lerp);
    this.lerp(ease);

    // Stop raf if target reached
    if (this.isInterpolated) {
      this._raf.pause();
    }

    // Render the scene
    snap.render(this._raf.duration);
  }

  /** Interpolate the current track value */
  public lerp(initialFactor: number) {
    const { snap, min, max } = this;
    let { target } = this;

    let lerpFactor = initialFactor;
    const influence = this._influence;

    // Edge space & resistance

    if (!snap.props.loop) {
      const { containerSize } = snap;
      const edgeSpace = (1 - snap.props.edgeFriction) * containerSize;

      if (target < min) {
        const edgeProgress = 1 - scoped(target, -containerSize, min);
        target = min - edgeProgress * edgeSpace;
      } else if (target > max) {
        const edgeProgress = scoped(target, max, max + containerSize);
        target = max + edgeProgress * edgeSpace;
      }

      target = clamp(target, min - edgeSpace, max + edgeSpace);
    }

    // Interpolate current value

    const rest = Math.abs(this.current - target);
    const fastThreshold = 3;

    if (rest < fastThreshold) {
      const fastProgress = 1 - rest / fastThreshold;
      const additionalFactor = (1 - lerpFactor) / 15;
      lerpFactor += additionalFactor * fastProgress;
    }

    this.current = lerp(this.current, target, lerpFactor, 0.000001);

    // Interpolate influence

    influence.target = lerp(influence.target, 0, lerpFactor, 0.000001);

    influence.current = lerp(
      influence.current,
      influence.target,
      lerpFactor,
      0.000001,
    );
  }

  /** Cancel sticky behavior */
  public cancelTransition() {
    this._timeline?.destroy();
    this._timeline = undefined;
  }

  /** Go to a definite coordinate */
  public toCoord(coordinate: number, options?: ISnapTransitionArg) {
    const { snap } = this;
    const { props, callbacks } = snap;

    if (snap.isEmpty || snap.isDestroyed) {
      return false;
    }

    this.cancelTransition();

    const start = this.current;
    const end = coordinate;
    const diff = Math.abs(end - start);

    const durationProp = options?.duration ?? snap.props.duration;

    let duration = isNumber(durationProp) ? durationProp : durationProp(diff);
    if (diff === 0) {
      duration = 0;
    }

    const easing = options?.easing ?? props.easing;

    const tm = new Timeline({ duration, easing });

    this._timeline = tm;

    tm.on('start', () => {
      callbacks.emit('timelineStart', undefined);
      options?.onStart?.();
    });

    tm.on('update', (data) => {
      this.current = lerp(start, end, data.eased);
      this.target = this.current;
      this.influence *= 1 - data.progress;

      if (data.progress === 1) {
        snap.$_targetIndex = undefined;
      }

      snap.render();

      callbacks.emit('timelineUpdate', data);
      options?.onUpdate?.(data);
    });

    tm.on('end', () => {
      tm.destroy();

      callbacks.emit('timelineEnd', undefined);
      options?.onEnd?.();

      this._timeline = undefined;
    });

    tm.on('destroy', () => {
      snap.$_targetIndex = undefined;
    });

    tm.play();

    return true;
  }
}
